import pandas as pd, numpy as np, statsmodels.api as sm, statsmodels.formula.api as smf
from scipy import stats
import json, warnings
warnings.filterwarnings('ignore')
rng=np.random.default_rng(20260920)

a=pd.read_parquet('analytic.parquet')
a['trauma_cat']=pd.cut(a['trauma'],[-0.5,0.5,2.5,4.5,99],labels=['0','1-2','3-4','5+'])
a['stress_c']=a['stress']-a['stress'].mean()
# restricted cubic spline for trauma, 3 knots at 0,2,5 (Harrell)
def rcs(x,k):
    k=np.asarray(k,float); t=lambda u:np.maximum(u,0)**3
    d=(k[-1]-k[0])**2
    return ( t(x-k[0]) - t(x-k[1])*(k[-1]-k[0])/(k[-1]-k[1]) + t(x-k[2])*(k[1]-k[0])/(k[-1]-k[1]) )/d
a['trauma_s1']=rcs(a['trauma'].values,[0,2,5])

res={}
def fit(formula,data,groups):
    m=smf.glm(formula,data=data,family=sm.families.Poisson()).fit(cov_type='cluster',cov_kwds={'groups':data[groups]})
    return m

adj='age + female + C(edu) + C(state_name)'
outs={'ptsd':'PTSD (PCL-5>=38)','dep':'Depression (PHQ-9>=10)','anx':'Anxiety (GAD-7>=10)'}

# 1) replication of original categorical spec (unadjusted, as in abstract)
for o in outs:
    m=fit(f'{o} ~ C(trauma_cat)*stress_c',a,'psu')
    rows={}
    base=m.params.get('stress_c'); 
    for lab,term in [('0',None),('1-2','C(trauma_cat)[T.1-2]:stress_c'),('3-4','C(trauma_cat)[T.3-4]:stress_c'),('5+','C(trauma_cat)[T.5+]:stress_c')]:
        if term is None:
            b=base; se=m.bse['stress_c']; irr=np.exp(b); lo,hi=np.exp(b-1.96*se),np.exp(b+1.96*se)
        else:
            b=base+m.params[term]
            c=np.zeros(len(m.params)); idx=list(m.params.index)
            c[idx.index('stress_c')]=1; c[idx.index(term)]=1
            se=float(np.sqrt(c@m.cov_params().values@c))
            irr,lo,hi=np.exp(b),np.exp(b-1.96*se),np.exp(b+1.96*se)
        rows[lab]=[round(irr,3),round(lo,3),round(hi,3)]
    # wald test for interaction block
    terms=[t for t in m.params.index if ':stress_c' in t]
    R=np.zeros((len(terms),len(m.params)))
    for i,t in enumerate(terms): R[i,list(m.params.index).index(t)]=1
    w=m.wald_test(R,scalar=True)
    res[f'cat_{o}']={'irr_by_cat':rows,'inter_p':float(w.pvalue),'n':int(m.nobs)}

# 2) updated primary: continuous trauma spline x stress, adjusted
models={}
for o in outs:
    m0=fit(f'{o} ~ trauma + trauma_s1 + stress + {adj}',a,'psu')
    m1=fit(f'{o} ~ (trauma + trauma_s1)*stress + {adj}',a,'psu')
    terms=[t for t in m1.params.index if ':stress' in t or 'stress:' in t]
    R=np.zeros((len(terms),len(m1.params)))
    for i,t in enumerate(terms): R[i,list(m1.params.index).index(t)]=1
    w=m1.wald_test(R,scalar=True)
    models[o]=m1
    res[f'spline_{o}']={'inter_p':float(w.pvalue),'aic_main':round(m0.aic,1),'aic_int':round(m1.aic,1)}

# 3) marginal predicted prevalence + stress effects at trauma levels, cluster bootstrap
grid_t=[0,1,2,3,5,7]; grid_s=[0,2,4,6]
def predict_surface(data):
    out={}
    for o in outs:
        try:
            m=smf.glm(f'{o} ~ (trauma + trauma_s1)*stress + {adj}',data=data,family=sm.families.Poisson()).fit()
        except Exception: return None
        for t in grid_t:
            for s in grid_s:
                g=data.copy(); g['trauma']=t; g['trauma_s1']=rcs(np.full(len(g),float(t)),[0,2,5]); g['stress']=s
                out[(o,t,s)]=float(np.clip(m.predict(g),0,1).mean())
    return out
point=predict_surface(a)
clus=a['psu'].unique(); B=400; boots=[]
for b in range(B):
    samp=rng.choice(clus,size=len(clus),replace=True)
    db=pd.concat([a[a['psu']==c] for c in samp],ignore_index=True)
    r=predict_surface(db)
    if r: boots.append(r)
def ci(key):
    v=np.array([b[key] for b in boots]); return float(np.percentile(v,2.5)),float(np.percentile(v,97.5))
surface={}
for k,v in point.items():
    lo,hi=ci(k); surface[f'{k[0]}|t{k[1]}|s{k[2]}']=[round(v,3),round(lo,3),round(hi,3)]
res['surface']=surface
# additive: risk difference per +2 stressors at trauma 0 vs 5
rd={}
for o in outs:
    for t in [0,5]:
        key_hi=(o,t,4); key_lo=(o,t,0)
        pt=point[key_hi]-point[key_lo]
        v=np.array([b[key_hi]-b[key_lo] for b in boots])
        rd[f'{o}|t{t}|s4-s0']=[round(pt,3),round(float(np.percentile(v,2.5)),3),round(float(np.percentile(v,97.5)),3)]
res['risk_diff']=rd

# 4) sensitivity: alt cutoffs, adjusted categorical, continuous outcome
a['ptsd33']=(a['pcl5']>=33).astype(float); a['dep15']=(a['phq9']>=15).astype(float); a['anx7']=(a['gad7']>=7).astype(float)
for o in ['ptsd33','dep15','anx7']:
    m1=fit(f'{o} ~ (trauma + trauma_s1)*stress + {adj}',a,'psu')
    terms=[t for t in m1.params.index if ':stress' in t]
    R=np.zeros((len(terms),len(m1.params)))
    for i,t in enumerate(terms): R[i,list(m1.params.index).index(t)]=1
    res[f'sens_{o}_inter_p']=float(m1.wald_test(R,scalar=True).pvalue)
# continuous severity (OLS cluster robust)
for o,score in [('ptsd','pcl5'),('dep','phq9'),('anx','gad7')]:
    m=smf.ols(f'{score} ~ (trauma + trauma_s1)*stress + {adj}',data=a).fit(cov_type='cluster',cov_kwds={'groups':a['psu']})
    terms=[t for t in m.params.index if ':stress' in t]
    R=np.zeros((len(terms),len(m.params)))
    for i,t in enumerate(terms): R[i,list(m.params.index).index(t)]=1
    res[f'sens_cont_{score}_inter_p']=float(m.wald_test(R,scalar=True).pvalue)

json.dump(res,open('results.json','w'),indent=1)
print(json.dumps({k:v for k,v in res.items() if k!='surface'},indent=1))
print('--- surface (prevalence [95% CI]) ---')
for o in outs:
    print(o)
    for t in grid_t:
        print(' t=%d: '%t + '  '.join('s%d %.2f(%.2f-%.2f)'%(s,*surface[f'{o}|t{t}|s{s}']) for s in grid_s))
