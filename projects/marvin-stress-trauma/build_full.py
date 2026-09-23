from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

T='/root/.claude/uploads/3404cebb-130e-5643-a499-3c4fae4c7977/a81eaf21-ISTSS_TEMPLATE.pptx'
RED=RGBColor(0xC8,0x10,0x2E); BLK=RGBColor(0,0,0); GRAY=RGBColor(0x89,0x89,0x89)
B1=RGBColor(0x7F,0xA8,0xD9); B2=RGBColor(0x3E,0x6F,0xA5); B3=RGBColor(0x1E,0x3A,0x5C)

def build(fname, titletxt, subtitle_lines, discl_name, slides, chart=None):
    pr=Presentation(T)
    layouts={l.name:l for l in pr.slide_masters[0].slide_layouts}
    L_TC=layouts['Title and Content']
    def notes(sl,txt): sl.notes_slide.notes_text_frame.text=txt
    s=pr.slides[0]
    s.placeholders[0].text_frame.text=titletxt
    for p in s.placeholders[0].text_frame.paragraphs:
        for r in p.runs: r.font.size=Pt(26)
    sub=s.placeholders[1].text_frame; sub.text=subtitle_lines[0]
    for line,sz in subtitle_lines[1:]:
        p=sub.add_paragraph(); r=p.add_run(); r.text=line; r.font.size=Pt(sz); r.font.color.rgb=GRAY
    notes(s, slides[0].get('n',''))
    s=pr.slides[1]
    tf=s.placeholders[1].text_frame
    for p in list(tf.paragraphs):
        t=p.text
        if t.startswith('-or-') or 'have had the following financial relationship' in t or 'add a sentence here to explain' in t:
            p._p.getparent().remove(p._p)
        elif '(insert name)' in t:
            for r in p.runs:
                if '(insert name)' in r.text: r.text=r.text.replace('(insert name)',discl_name)
    notes(s,"No financial relationships to disclose.")
    xml=pr.slides._sldIdLst
    for sldId in list(xml)[2:]:
        pr.part.drop_rel(sldId.rId); xml.remove(sldId)

    for sd in slides[1:]:
        s=pr.slides.add_slide(L_TC)
        s.placeholders[0].text_frame.text=sd['t']
        if sd.get('chart'):
            for p in [p for p in s.placeholders if p.placeholder_format.idx!=0]:
                p._element.getparent().remove(p._element)
            cd=CategoryChartData(); cd.categories=["0","2","4","6"]
            for nm,vals in sd['chart']: cd.add_series(nm,vals)
            gf=s.shapes.add_chart(XL_CHART_TYPE.LINE,Inches(1.2),Inches(1.9),Inches(11.0),Inches(5.0),cd)
            ch=gf.chart; ch.has_legend=True; ch.legend.position=XL_LEGEND_POSITION.RIGHT; ch.legend.include_in_layout=False
            for i,ser in enumerate(ch.series):
                ser.format.line.color.rgb=[RED,B1,B2,B3][i]; ser.format.line.width=Pt(2.5); ser.smooth=False
            ch.value_axis.maximum_scale=60; ch.value_axis.minimum_scale=0
            ch.value_axis.has_title=True; ch.value_axis.axis_title.text_frame.text="Prevalence (%)"
            ch.category_axis.has_title=True; ch.category_axis.axis_title.text_frame.text="Socioeconomic stressors (count)"
        elif sd.get('table'):
            for p in [p for p in s.placeholders if p.placeholder_format.idx!=0]:
                p._element.getparent().remove(p._element)
            rows=sd['table']; redrow=sd.get('redrow',-1)
            tbl=s.shapes.add_table(len(rows),len(rows[0]),Inches(0.9),Inches(2.0),Inches(11.6),Inches(0.5*len(rows))).table
            for ri,r_ in enumerate(rows):
                for ci,c in enumerate(r_):
                    cell=tbl.cell(ri,ci); cell.text=c
                    if cell.text_frame.paragraphs[0].runs:
                        run=cell.text_frame.paragraphs[0].runs[0]; run.font.size=Pt(15)
                        if ri==redrow and ci>0: run.font.color.rgb=RED
        else:
            tf=s.placeholders[1].text_frame; tf.clear(); tf.word_wrap=True
            first=True
            for item in sd['b']:
                lvl=0; txt=item; red=False
                if isinstance(item,tuple): txt,lvl=item[0],item[1]; red=len(item)>2 and item[2]
                p=tf.paragraphs[0] if first else tf.add_paragraph(); first=False
                p.level=lvl
                r=p.add_run(); r.text=txt; r.font.size=Pt(18 if lvl==0 else 15)
                if red: r.font.color.rgb=RED
                p.space_after=Pt(8 if lvl==0 else 4)
        notes(s, sd.get('n',''))
    pr.save(fname); return len(pr.slides)

# ---------------- Mohammed's deck ----------------
mo=[
{'n':"Thank the chair. This talk asks whether trauma changes what everyday stress does to mental health, in the population Salma just described."},
{'t':"Nigeria's Crisis Landscape",'b':[
 "Overlapping insecurity across all six geopolitical zones — not one war but many",
 ("Northeast: Boko Haram / ISWAP insurgency — 350,000+ deaths, 2.2 million displaced in Borno",1),
 ("Northwest: armed banditry and mass kidnappings (Sokoto)",1),
 ("Middle Belt: farmer–herder conflict — ~60,000 lives (Benue)",1),
 ("Southeast: separatist and political violence (Enugu); Niger Delta: cultist violence (Rivers)",1),
 "Violence is layered on economic crisis: GDP per capita ~US$800 (from ~$3,100 in 2014); ~63% multidimensionally poor; food inflation reached ~41%"],
 'n':"When we talk about conflict-affected Nigeria, we are not talking about one war but multiple, overlapping forms of insecurity. In the northeast, Boko Haram and ISWAP. In the northwest, banditry and mass kidnappings. In the Middle Belt, farmer-herder conflict. In the southeast, separatist violence; in the Delta, cult groups. These events sit on top of a very difficult economy: income per person has fallen by two-thirds in a decade, roughly 133 million people are multidimensionally poor, and food inflation touched 40 percent. The population we study is exposed to violence and chronic economic stress at the same time."},
{'t':"Two Exposures, Two Intervention Logics",'b':[
 "This population carries both traumatic events and grinding daily stressors — job loss, rent difficulty, food insecurity, family disruption",
 "MaRVIN survey (previous talk): PTSD 18.5%, depression 21.0%, anxiety 20.7%; nearly 1 in 3 with at least one condition",
 "System capacity cannot treat everyone: ~0.6 mental health workers per 100,000 (WHO recommends 5.0); ~250 psychiatrists for 200+ million; <10% receive care",
 "Whether trauma and stressors simply add — or interact — decides who benefits from which intervention"],
 'n':"Two exposures run together here: the traumatic events, and the daily stressors of poverty and displacement. Salma showed the burden: nearly one in three adults with at least one condition. Against that, capacity: 0.6 mental health workers per hundred thousand people, one psychiatrist per 800,000 Nigerians, fewer than one in ten receiving care. Rationing is unavoidable, so the question of whether trauma and stress add or interact is not academic — it decides targeting."},
{'t':"Three Competing Accounts of Trauma and Daily Stress",'b':[
 "Building-block model: trauma and stressors add independently (Miller & Rasmussen, 2010)",
 ("Underlies most humanitarian programming — stress reduction assumed to help everyone equally",1),
 "Stress sensitization: trauma amplifies reactivity to later stress (Hammen, 2005; McLaughlin et al., 2010)",
 ("Predicts steepest stress–symptom gradients among the most trauma-exposed",1),
 "Emerging third pattern — saturation: stress sensitivity diminishing at high exposure (Syrian and Burundian refugees: Hou et al., 2020; Scharpf et al., 2021)",
 ("Never formally tested: shape of the interaction, multiple outcomes, African conflict setting",1)],
 'n':"The literature gives three incompatible answers. The building-block model says effects add, so every stressor removed helps everyone. Sensitization says trauma lowers the threshold at which stress triggers symptoms — gradients should be steepest among the most exposed. And a third pattern is emerging from refugee studies: diminishing sensitivity at high exposure. Nobody had formally tested the shape of this interaction, across outcomes, in an African conflict setting. That is this paper."},
{'t':"Study Aim and Hypotheses",'b':[
 "Aim: test whether trauma exposure modifies the association between socioeconomic stressors and PTSD, depression, and anxiety",
 "H1: trauma and stressors each predict all three outcomes",
 "H2: significant trauma × stressor interactions emerge",
 "H3: adults with extensive trauma show diminished stress sensitivity — saturation, not sensitization",
 "Design principle: let the data reject saturation — model trauma continuously, test on both relative and absolute scales"],
 'n':"Three hypotheses. Both exposures predict outcomes; the interaction exists; and its direction is saturation, not sensitization. The design principle mattered as much as the hypotheses: the model had to be free to reject saturation, which drives the analytic choices you will see."},
{'t':"Design and Sample",'b':[
 "MaRVIN population-based cross-sectional survey, May–October 2025, with AFENET and the Federal Ministry of Health and Social Welfare",
 "Six states, one per geopolitical zone: five conflict-affected (Benue, Borno, Enugu, Rivers, Sokoto) + Ogun as non-conflict comparison",
 "12 LGAs (urban + rural per state); 573 communities; households by systematic sampling; IDP camps included through the same procedures",
 "1,729 adults completed the trauma inventory (of 1,774 interviewed); 37 who declined the trauma items treated as missing, not unexposed",
 "Adjusted models: N=1,706 across 558 community clusters"],
 'n':"The sample Salma presented: six states, one per zone, with Ogun anchoring the low end of the trauma gradient. Of 1,774 interviewed, 1,729 completed the trauma inventory. The 37 who declined it are missing, not zeros — we verified the count against the item-level responses. Interviews were face-to-face, 45 to 60 minutes, tablet-based with range checks, private settings, referral information in hand."},
{'t':"Measures",'b':[
 "Outcomes — instruments validated against SCID-5 psychiatrist interview in this population (paper 1):",
 ("PCL-5, 20 items, past month; probable PTSD ≥ 38 (population-specific; AUC 0.71; α 0.92)",1),
 ("PHQ-9, 9 items; depression ≥ 10 (AUC 0.70; α 0.88) · GAD-7, 7 items; anxiety ≥ 10 (α 0.86)",1),
 "Trauma exposure: adapted Life Events Checklist, 12 event types, lifetime; summed 0–12",
 ("Distribution: 28% none, 54% 1–2, 13% 3–4, 5.5% five or more",1),
 "Daily stressors: 10-item Nigerian-specific count (0–10) — job loss, rent, eviction, family disruption, isolation; mean 2.05 (SD 1.65)",
 "Covariates: age, gender, education, state"],
 'n':"Outcomes use the cut-points Jaimie validated, including the population-specific PCL-5 threshold of 38. Trauma is a count of twelve event types from an adapted Life Events Checklist. Stressors are a ten-item Nigerian-specific count — the everyday socioeconomic grind. Note the exposure distribution: over a quarter report nothing, a small tail reports five or more."},
{'t':"Analysis: Letting the Data Draw the Curve",'b':[
 "Poisson regression → prevalence ratios; design-based variances (state strata, community PSUs, Taylor linearization)",
 "Trauma entered continuously as a restricted cubic spline (knots 0, 2, 5)",
 ("Smooth curve segments joined at knots — the data chooses the shape; categories would impose it",1),
 "Focal test: trauma × stressor interaction (adjusted Wald test)",
 "Both scales: per-stressor prevalence ratios AND absolute prevalence differences (margins), because targeting claims rest on absolute risk",
 "Prespecified sensitivity: PCL-5≥33, PHQ-9≥15, GAD-7≥7; continuous scores; categorical specification; Stata 19.5"],
 'n':"Two analytic choices matter. First, trauma enters as a restricted cubic spline — smooth cubic segments joined at knots — so any flattening is estimated from the data rather than imposed by bins. The model was free to show sensitization, additivity, or saturation. Second, we read the interaction on both scales, because ratios can fade arithmetically when baseline risk is high; percentage points cannot. Everything prespecified, with sensitivity analyses on thresholds and continuous scores."},
{'t':"The Burden Gradient Comes First",'b':[
 "Trauma shows the expected dose-response with every outcome",
 ("Adjusted PTSD prevalence at zero stressors: 6.5% (no trauma) → 19.6% (three events) → 40.9% (five events)",1),
 "Both exposures predict all three outcomes (H1 confirmed)",
 "Stressor burden also rises with trauma exposure — which is exactly why the interaction needs adjusted, formal testing",
 "The question is what happens to the stress gradient along this curve"],
 'n':"First, the main effect: trauma dominates the risk landscape, a six-fold prevalence gradient. That is not the news — it confirms hypothesis one and sets the stage. The news is what happens to the stressor effect as you move up this curve."},
{'t':"Per-Stressor Prevalence Ratio, by Trauma Exposure",'table':[
 ["Trauma","PTSD","Depression","Anxiety"],
 ["0 events","1.97 (1.53–2.54)","1.83 (1.46–2.30)","1.71 (1.35–2.17)"],
 ["1–2 events","1.26 (1.06–1.50)","1.27 (1.11–1.45)","1.15 (1.01–1.31)"],
 ["3–4 events","1.03 (0.87–1.21)","0.95 (0.81–1.12)","0.86 (0.75–0.99)"],
 ["5+ events","0.92 (0.83–1.03)","0.99 (0.90–1.09)","1.03 (0.95–1.13)"],
 ["Interaction p","<0.0001","<0.0001","<0.0001"]],'redrow':1,
 'n':"The interaction. Read the red row: among adults with no trauma exposure, each additional stressor nearly doubles PTSD prevalence — ratio 1.97 — and depression and anxiety behave the same. Walk down any column and the effect fades monotonically to null at five or more events. All three interactions below 0.0001. This is the opposite of sensitization: the gradient is steepest where exposure is lowest. The adjusted spline models confirm it — p of 0.0027, 0.0001, 0.0027 — with the curve free to reject it."},
{'t':"Adjusted PTSD Prevalence Across the Stressor Range",'chart':[
 ("No trauma",(6.5,13.6,28.4,59.1)),("1 event",(9.4,15.2,24.4,39.4)),
 ("3 events",(19.6,21.5,23.7,26.0)),("5 events",(40.9,39.6,38.4,37.2))],
 'n':"The same result as a picture. Each line is a trauma level. The red line — no trauma exposure — climbs from about 7 percent to 28 and keeps rising. Each step up the trauma curve rotates the line flatter. At five events the line is high, around 40 percent, and horizontal. The gradient belongs to the unexposed; the burden belongs to the exposed. Depression and anxiety fan out the same way."},
{'t':"The Absolute Scale Carries the Programming Point",'b':[
 "Four additional stressors (0 → 4), change in adjusted prevalence:",
 ("No trauma exposure — PTSD +21.8 points (95% CI 7.2–36.5); depression +24.1 (10.5–37.6); anxiety +17.8 (3.9–31.6)",1,True),
 ("Five or more events — PTSD −2.5 (−18.3 to +13.4); depression +3.5 (−7.7 to +14.6); anxiety −4.0 (−15.1 to +7.1) — null in all three",1),
 "At five events, prevalence sits near 40% at every stressor level — high and flat",
 "The fading is not ratio arithmetic: it appears in percentage points too"],
 'n':"Why this matters for programming: the absolute scale. Four additional stressors add 22 points of PTSD prevalence among the unexposed, 24 of depression, 18 of anxiety. The same contrast among the heavily exposed adds nothing, against a baseline near 40 percent. A fading ratio can be arithmetic when baseline risk is high; a fading risk difference cannot."},
{'t':"Robustness",'b':[
 "Adjusted spline interaction: PTSD p=0.0027; depression p=0.0001; anxiety p=0.0027",
 "Alternative thresholds: PCL-5≥33 (p=0.0002), PHQ-9≥15 (p=0.0001), GAD-7≥7 (p<0.0001)",
 "Continuous symptom scores — no cutoff at all: all p≤0.0001",
 "Not a ceiling: the 5+ group sits at ~40% prevalence with a tight confidence interval, estimated over real stressor variation",
 "Categorical and continuous specifications agree; adjusted and unadjusted agree"],
 'n':"Every route to an artifact is closed. Alternative cutoffs reproduce it. The continuous scores reproduce it with no threshold at all. The high-exposure group is far from any ceiling and its null is precise, not sparse. And the spline, free to reject the shape, chose it."},
{'t':"Interpretation: Differential Stress Sensitivity",'b':[
 "The stress–symptom gradient is concentrated among adults with limited trauma exposure; among the heavily exposed, prevalence is high at every stressor level",
 "Consistent with sensitization AND saturation operating at different exposure levels: sensitivity retained at 1–2 events, flattening at 3–4, complete by 5+",
 "Candidate mechanisms: allostatic exhaustion (McEwen), hypocortisolism and blunted amygdala reactivity (Yehuda), emotional numbing, altered world assumptions",
 "Cross-sectional data: this is a population pattern, not a demonstrated within-person mechanism"],
 'n':"We read this as trauma saturation — stated carefully. The population pattern: sensitivity concentrated among the least exposed, burden saturated among the most. Both classic theories may hold at different exposure levels: sensitivity is retained at one to two events and gone by five. Mechanistic candidates — allostatic exhaustion, hypocortisolism, numbing — are discussion, not demonstration; the data are cross-sectional."},
{'t':"Implications for Humanitarian Programming",'b':[
 "One program for everyone serves neither group well",
 "~4 in 5 adults have fewer than three event types and retain stress sensitivity:",
 ("Stress management, livelihood support, Problem Management Plus, community psychosocial support (Rahman 2016; Jordans 2010)",1),
 "The heavily exposed minority carries ~40% prevalence regardless of stressors:",
 ("Trauma-focused therapies — Narrative Exposure Therapy (Robjant & Fazel 2010), culturally adapted CPT (Bass 2013)",1),
 "Brief trauma-history screening at program entry could route scarce specialist capacity to where stress reduction cannot substitute for it"],
 'n':"The programming implication is stratification. For the four in five with limited exposure, stress-focused and livelihood interventions address something their symptoms demonstrably track. For the heavily exposed minority, the burden does not move with stressors — trauma-focused therapies are the treatments with evidence. A brief trauma-history screen at entry is cheap and routes specialist capacity where it is irreplaceable. Dr. Ojo will speak to how this enters Mental Health Act implementation."},
{'t':"Limitations",'b':[
 "Cross-sectional: saturation names an association pattern, not a mechanism; selection and reverse causation cannot be excluded",
 "Lifetime event recall set against current stressors",
 "Sparse data above six events (~60 respondents): extreme-tail predictions unstable, reported only to five events",
 "Screens, not diagnoses — though locally validated, and the pattern holds in continuous scores",
 "Equal sampling weights; design-based clustering (state strata, community PSUs)"],
 'n':"Stated plainly. Cross-sectional, so no within-person claim. Recall of lifetime events against current stress. A thin extreme tail. Screens rather than diagnoses, though validated ones. The longitudinal test — does a new stressor move symptoms differently by trauma history — is the next study."},
{'t':"Conclusions",'b':[
 "Trauma exposure modifies what everyday stress does: per-stressor PTSD risk falls from ×1.97 among the unexposed to null at five or more events, across all three outcomes, on both scales, in every sensitivity analysis",
 "Simple dose-response assumptions — and universal psychosocial programming built on them — do not fit these data",
 "Match the intervention to trauma history: stress-focused support where sensitivity is retained; trauma-focused therapy where exposure is extensive",
 "Next: longitudinal designs to establish when saturation develops and whether it reverses with treatment"],
 'n':"To close: trauma changes what stress does. The gradient lives among the least exposed; the burden among the most. Programming should follow that structure. Thank you — and the field teams across six states, AFENET, the Federal Ministry, and my co-authors. I hand over to Dr. Ojo, who takes these findings to policy."},
]
n1=build('istss_mohammed_full.pptx',
 "When More Trauma Means Less Stress Sensitivity",
 ["Evidence for a Trauma Saturation Effect Among Violence-Exposed Populations in Nigeria",
  ("Mohammed Abba-Aji, MBBS, MPH, DrPH · Washington University in St. Louis",14),
  ("ISTSS 42nd Annual Meeting · San Antonio, TX · September 24, 2026",13)],
 "Mohammed Abba-Aji", mo)

# ---------------- Salma's deck ----------------
sa=[
{'n':"Thank the chair. Jaimie showed the instruments hold; this paper deploys them at scale and asks what, besides trauma itself, drives the burden."},
{'t':"Nigeria's Crisis Landscape",'b':[
 "Overlapping insecurity across all six geopolitical zones — not one war but many",
 ("Northeast: Boko Haram / ISWAP insurgency · Northwest: banditry and mass kidnappings",1),
 ("Middle Belt: farmer–herder conflict · Southeast: separatist violence · Niger Delta: cultist violence",1),
 "All three forms of organized violence co-occur: state-based conflict, non-state violence, one-sided violence against civilians",
 "Over 3 million internally displaced — among the largest such populations globally; 75+ million displaced by conflict worldwide by end-2023"],
 'n':"Nigeria carries multiple overlapping crises: insurgency in the northeast, banditry in the northwest, farmer-herder conflict in the Middle Belt, separatist violence in the southeast, cult violence in the Delta. All three forms of organized violence at once, producing one of the world's largest internally displaced populations."},
{'t':"Violence Layered on Economic Hardship",'b':[
 "GDP per capita ~US$800 in 2024, down from ~$3,100 in 2014",
 ">46% below the national poverty line; ~63% (≈133 million people) multidimensionally poor",
 "Headline inflation ~34% in 2024; food inflation ~41%",
 "Mental health system capacity: ~0.6 workers per 100,000 (WHO recommends 5.0); ~250 psychiatrists for 200+ million; <10% of those affected receive care",
 "Two candidate drivers of mental health burden: the traumatic events, and the conditions displacement creates"],
 'n':"The violence sits on a punishing economy — income per person down two-thirds in a decade, 133 million multidimensionally poor, food inflation at 40 percent — and a health system with almost no mental health capacity. Two pathways could drive the psychiatric burden: the traumatic events themselves, and the post-displacement environment. Distinguishing them is this paper's job."},
{'t':"The Nigerian Evidence Gap",'b':[
 "Existing studies: fragmented, mostly hospital-based or single-site convenience samples",
 ("Reported PTSD prevalence 42–67%, depression 35–55% — wide variation, mostly IDP-camp samples, instruments unvalidated locally",1),
 "No multi-state population-based prevalence estimates existed",
 "Predictors, comorbidity patterns, and the trauma-vs-displacement question largely unexamined",
 "Data needed to implement Nigeria's National Mental Health Policy and Mental Health Act"],
 'n':"Despite the scale of the problem, the evidence was thin: single sites, convenience samples, unvalidated instruments, estimates ranging from 42 to 67 percent for PTSD. No multi-state population-based study existed. The Ministry needs these numbers to implement the Mental Health Act — which is why it co-owns this study."},
{'t':"Study Aim",'b':[
 "Estimate the prevalence of PTSD, depression, and generalized anxiety across violence-exposed populations in all six geopolitical zones",
 "Identify demographic, geographic, and contextual factors associated with each condition",
 "Distinguish the contribution of cumulative trauma exposure from that of the post-displacement environment (IDP camp residence)"],
 'n':"Three objectives: population prevalence across the six zones; the factors associated with each condition; and the separation of the trauma pathway from the displacement-environment pathway."},
{'t':"Design and Sample",'b':[
 "MaRVIN population-based cross-sectional survey, May–October 2025, with AFENET and the Federal Ministry of Health and Social Welfare; STROBE-compliant",
 "Six states, one per geopolitical zone: Benue, Borno, Enugu, Ogun, Rivers, Sokoto",
 "12 LGAs (one urban, one rural per state); 573 communities; systematic household sampling from a random start",
 "IDP camps sampled through the same procedures in the three states hosting them",
 "N=1,774 adults ≥ 18, resident ≥ 6 months; face-to-face interviews on ODK tablets"],
 'n':"Six states, one per zone. Two LGAs per state, urban and rural; 573 communities; households by systematic sampling; camps through the same procedures. 1,774 adults, face-to-face, May to October 2025."},
{'t':"Measures and Analytic Strategy",'b':[
 "Outcomes at population-validated cut-points (paper 1): PCL-5 ≥ 38, PHQ-9 ≥ 10, GAD-7 ≥ 10",
 "Trauma: Life Events Checklist count · IDP camp residence: field-verified at sampling",
 "Design-based modified Poisson → prevalence ratios; community PSUs, state strata, robust variances",
 "Model A — focal exposure: trauma count, adjusted for demographics and geography",
 "Model B — focal exposure: camp residence, additionally adjusted for trauma",
 "Stressors and food insecurity deliberately excluded as plausible mediators of the camp pathway",
 "Multilevel models estimate community-level clustering (ICCs)"],
 'n':"Two multivariable models, one focal exposure each. Model A: the trauma count. Model B: camp residence, adjusted for trauma — so the camp estimate is the environment's association net of measured events. Daily stressors and food insecurity stay out deliberately: they are plausible mediators of the camp pathway, and adjusting for mediators biases the estimate toward null. Multilevel models give us the clustering."},
{'t':"Who Was in the Sample",'b':[
 "Mean age 41.0 years (SD 14.4); 54.8% female; 65.8% currently married",
 "Education reflects regional patterns: Quranic/Islamic 19.3% (Borno 39.9%, Sokoto 59.2%); tertiary 18.6% (Enugu 34.8%, Rivers 28.1%)",
 "26.2% residing in IDP camps (present in Benue, Borno, Sokoto only)",
 "Mean traumatic events 1.5 (SD 1.7); 18.0% reported three or more",
 "Moderate or severe food insecurity: 64.8%"],
 'n':"The sample looks like the six zones: Quranic education concentrated in the north, tertiary in the southeast and south-south. A quarter live in camps. Two-thirds are food insecure. Mean trauma exposure of one and a half event types, with an 18 percent tail at three or more."},
{'t':"A Substantial, Overlapping Burden",'b':[
 "Survey-adjusted prevalence: PTSD 18.5% (95% CI 14.2–23.8); depression 21.0% (16.4–26.3); anxiety 20.7% (16.9–25.1)",
 ("Nearly one in three (30.4%) met criteria for at least one condition",1,True),
 "The conditions travel together: 36.2% of those with any condition met all three; tetrachoric correlations 0.83–0.87",
 "Design effects 4.7–6.9 — the first signal of pronounced community-level clustering"],
 'n':"Prevalence: 18.5, 21, and 20.7 percent. Nearly one in three with at least one condition, and among those, over a third meet all three — correlations above 0.8. Note the design effects near seven: the burden clusters intensely by community, which becomes its own finding."},
{'t':"The Burden Is Not Evenly Spread",'b':[
 "28-fold variation across states: PTSD 1.5% in Ogun to 42.1% in Benue (depression 3.0–44.1%; anxiety 2.7–38.3%)",
 "IDP camp residents: ~4-fold the prevalence of community residents (PTSD 40.4% vs 10.7%)",
 "Clear trauma dose-response: PTSD 7.9% at zero events → 45.2% at five or more",
 "The multivariable question: what survives adjustment?"],
 'n':"Unadjusted, everything varies enormously: 28-fold across states, four-fold between camp and community, a steep trauma dose-response. The question is what survives when the exposures compete in adjusted models."},
{'t':"Model A: Trauma Shows a Consistent Dose-Response",'table':[
 ["Focal exposure","PTSD","Depression","Anxiety"],
 ["Per traumatic event (Model A)","1.15 (1.07–1.23)","1.15 (1.09–1.22)","1.14 (1.08–1.21)"],
 ["IDP camp residence (Model B)","2.32 (1.24–4.32)","1.94 (1.21–3.10)","2.87 (1.79–4.62)"]],'redrow':2,
 'n':"Model A: each additional traumatic event carries 14 to 15 percent higher prevalence of every condition, adjusted for demographics and geography. Model B is the headline, in red: current camp residence carries two- to three-fold higher prevalence after additionally adjusting for trauma — and the trauma coefficients barely move when camp enters. Two separable pathways. Camp residence also absorbs much of the Benue–Borno difference in state effects."},
{'t':"The Burden Clusters by Community",'b':[
 "Null-model ICCs: 0.86 (PTSD), 0.72 (depression), 0.72 (anxiety)",
 "Still 0.49–0.62 after full adjustment — most residual variation lies between communities, not between neighbors",
 "State × trauma interaction significant (p<0.001): the trauma association is steepest where baseline exposure is lowest (Enugu, Rivers) and flat in Borno, where exposure runs highest",
 "Robust across: post-stratification weights, PCL-5 ≥ 33, LGA fixed effects, continuous scores, multilevel logistic models"],
 'n':"The intraclass correlations are exceptional — 0.86 for PTSD unadjusted, still above 0.6 adjusted. The burden is a property of communities as much as individuals. One more result sets up the next talk: the trauma gradient is steepest where exposure is lowest and flat where it is highest. Mohammed's paper takes exactly that thread. Every sensitivity analysis holds."},
{'t':"What This Means",'b':[
 "The post-displacement environment is an intervention target in its own right — camp conditions carry risk the trauma count does not explain",
 "Trauma treatment alone leaves the camp pathway untouched: shelter, safety, livelihoods, services",
 "Extreme community clustering supports community-targeted delivery over individual-only approaches",
 "Direct evidence base for implementing Nigeria's Mental Health Act — the subject of the next presentation",
 "Limitations: cross-sectional; purposively selected states (no national weights); camps in three states only; selection into camps possible, though trauma adjustment addresses its most obvious form"],
 'n':"The camp association, robust to trauma adjustment, identifies the post-displacement environment as its own target. The clustering says deliver by community. And this is the evidence the Ministry asked for — Dr. Ojo takes it from here. Limitations in one breath: cross-sectional, purposive state selection, camps in only three states, and camp selection effects that the trauma adjustment only partly addresses."},
]
n2=build('istss_salma_full.pptx',
 "Prevalence and Predictors of PTSD, Depression, and Anxiety Among Persons Exposed to Diverse Forms of Armed Violence Across Six Nigerian States",
 ["Salma M. Abdalla, MBBS, MPH, DrPH · Washington University in St. Louis",
  ("The MaRVIN study — Abba-Aji, Abdalla, Gradus, Ojo, Magaji, Galea",14),
  ("ISTSS 42nd Annual Meeting · San Antonio, TX · September 24, 2026",13)],
 "Salma M. Abdalla", sa)
print(n1, n2)
