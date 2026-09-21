from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

T='/root/.claude/uploads/3404cebb-130e-5643-a499-3c4fae4c7977/a81eaf21-ISTSS_TEMPLATE.pptx'
pr=Presentation(T)
RED=RGBColor(0xFF,0,0); BLK=RGBColor(0,0,0); GRAY=RGBColor(0x89,0x89,0x89)
layouts={l.name:l for l in pr.slide_masters[0].slide_layouts}
L_TC=layouts['Title and Content']; L_SH=layouts['Section Header']; L_2C=layouts['Two Content']
def notes(sl, txt): sl.notes_slide.notes_text_frame.text = txt

s=pr.slides[0]
s.placeholders[0].text_frame.text="Prevalence and Predictors of PTSD, Depression, and Anxiety Among Persons Exposed to Diverse Forms of Armed Violence Across Six Nigerian States"
for p in s.placeholders[0].text_frame.paragraphs:
    for r in p.runs: r.font.size=Pt(26)
sub=s.placeholders[1].text_frame
sub.text="Salma M. Abdalla, MBBS, MPH, DrPH · Washington University in St. Louis"
p2=sub.add_paragraph(); r=p2.add_run(); r.text="The MaRVIN study — Abba-Aji, Abdalla, Gradus, Ojo, Magaji, Galea"; r.font.size=Pt(14); r.font.color.rgb=GRAY
p3=sub.add_paragraph(); r=p3.add_run(); r.text="ISTSS 42nd Annual Meeting · San Antonio, TX · September 24, 2026"; r.font.size=Pt(13); r.font.color.rgb=GRAY
notes(s,"Thank the chair. One sentence: Jaimie showed the instruments hold in this population; this paper deploys them at scale and asks what, besides trauma itself, carries the burden.")

s=pr.slides[1]
tf=s.placeholders[1].text_frame
for p in list(tf.paragraphs):
    t=p.text
    if t.startswith('-or-') or 'have had the following financial relationship' in t or 'add a sentence here to explain' in t:
        p._p.getparent().remove(p._p)
    elif '(insert name)' in t:
        for r in p.runs:
            if '(insert name)' in r.text: r.text=r.text.replace('(insert name)','Salma M. Abdalla')
notes(s,"No financial relationships to disclose. [Confirm with Salma.]")

xml=pr.slides._sldIdLst
for sldId in list(xml)[2:]:
    pr.part.drop_rel(sldId.rId); xml.remove(sldId)

SECTIONS=["1. Background","2. Methods","3. Results","4. Discussion"]
def add(layout): return pr.slides.add_slide(layout)
def rmbody(s):
    try:
        for p in [p for p in s.placeholders if p.placeholder_format.idx!=0]:
            p._element.getparent().remove(p._element)
    except Exception: pass
def divider(cur, note):
    s=add(L_SH); tf=s.placeholders[0].text_frame; tf.clear()
    for i,t in enumerate(SECTIONS):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        r=p.add_run(); r.text=t; r.font.size=Pt(28)
        if i==cur: r.font.color.rgb=RED
    rmbody(s); notes(s,note); return s
def content(titletext, lines, note, size=20):
    s=add(L_TC); s.placeholders[0].text_frame.text=titletext
    tf=s.placeholders[1].text_frame; tf.clear(); tf.word_wrap=True
    for i,t in enumerate(lines):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        r=p.add_run(); r.text=t; r.font.size=Pt(size); p.space_after=Pt(12)
    notes(s,note); return s
def bigstmt(text, note):
    s=add(L_SH); s.placeholders[0].text_frame.text=text
    s.placeholders[0].text_frame.paragraphs[0].runs[0].font.size=Pt(34)
    rmbody(s); notes(s,note); return s

divider(0,"Roadmap: background, methods, results, discussion.")
content("Organized violence and its aftermath",[
 "Three forms: state-based conflict, non-state violence, one-sided violence against civilians",
 "By end-2023, conflict had displaced more than 75 million people internally worldwide",
 "Both pathways damage mental health: the traumatic events, and the conditions displacement creates",
 "Their relative contribution is debated - and it decides what interventions target"],
 "Organized violence takes three forms, and each drives displacement - over 75 million internally displaced worldwide. Two pathways to poor mental health run through it: cumulative traumatic exposure, with its dose-response signature, and the post-displacement environment. Which pathway carries more of the burden is debated, and the answer decides whether programming targets individual trauma or the structural conditions of displacement.")
content("Why Nigeria, and what was missing",[
 "All three forms of violence co-occur: insurgency, communal and criminal violence, attacks on civilians",
 "Over 3 million internally displaced - among the largest such populations globally",
 "Existing evidence: hospital-based or single-site samples; unvalidated instruments",
 "No multi-state population-based prevalence study existed"],
 "Nigeria carries all three forms of violence at once, across six geopolitical zones differing in conflict type, religion, language, and economy - associations holding across that variation are unlikely to be artifacts of one conflict. The evidence base was hospital samples and single sites, mostly with instruments never validated locally. Jaimie's paper fixed the instruments; this one supplies the population estimates.")
bigstmt("The trauma, or the conditions displacement creates?","The question in one line. Pause.")
divider(1,"Methods.")
content("Sample",[
 "1,774 adults across six states, one per geopolitical zone",
 "12 LGAs (urban + rural per state); 573 communities; IDP camps included",
 "Household systematic sampling; face-to-face interviews, ODK",
 "May-October 2025; STROBE-compliant"],
 "Six states, one per zone: Benue, Borno, Enugu, Ogun, Rivers, Sokoto. Two LGAs per state, urban and rural; 573 communities; households by systematic sampling from a random start; IDP camps sampled through the same procedures in the three states that host them. 1,774 adults, face-to-face, May to October 2025, with AFENET and the Federal Ministry of Health and Social Welfare.")
content("Measures and models",[
 "PCL-5 ≥ 38 (population-validated), PHQ-9 ≥ 10, GAD-7 ≥ 10",
 "Trauma: Life Events Checklist count · IDP camp residence: field-verified",
 "Design-based modified Poisson → prevalence ratios; community PSUs, state strata",
 "Model A: trauma as focal exposure · Model B: camp residence, adjusting for trauma"],
 "Outcomes at the cut-points Jaimie validated - the PCL-5 at 38, which outperformed the international 33 here. Two multivariable models, one focal exposure each: Model A, the trauma count, adjusted for demographics and geography; Model B, current IDP camp residence, additionally adjusted for trauma. Daily stressors and food insecurity stay out deliberately - they are plausible mediators of the camp pathway, and adjusting for mediators biases the camp estimate toward null. Multilevel models estimate community clustering.")
divider(2,"Results: the burden, where it sits, what predicts it.")

s=add(L_2C); s.placeholders[0].text_frame.text="A substantial burden"
ph=[p for p in s.placeholders if p.placeholder_format.idx!=0]
tf=ph[0].text_frame; tf.clear()
for i,(n,c) in enumerate([("18.5%","PTSD (95% CI 14.2-23.8)"),("21.0%","Depression (16.4-26.3)"),("20.7%","Anxiety (16.9-25.1)")]):
    p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
    r=p.add_run(); r.text=n+"  "; r.font.size=Pt(32)
    r2=p.add_run(); r2.text=c; r2.font.size=Pt(14); p.space_after=Pt(14)
tf=ph[1].text_frame; tf.clear()
r=tf.paragraphs[0].add_run(); r.text="30.4%"; r.font.size=Pt(60); r.font.color.rgb=RED
p=tf.add_paragraph(); r=p.add_run(); r.text="met criteria for at least one condition"; r.font.size=Pt(16)
p=tf.add_paragraph(); r=p.add_run(); r.text="36% of those with any condition met all three"; r.font.size=Pt(13); r.font.color.rgb=GRAY
notes(s,"Survey-adjusted prevalence: PTSD 18.5, depression 21, anxiety 20.7 percent. Nearly one in three adults met criteria for at least one condition, and among those with any, over a third met all three - the conditions travel together, tetrachoric correlations above 0.8.")

content("The burden is not evenly spread",[
 "PTSD by state: 1.5% in Ogun to 42.1% in Benue - a 28-fold difference",
 "IDP camp residents: roughly 4-fold higher prevalence of every condition (40% vs 11-15%)",
 "Trauma dose-response: PTSD 7.9% at zero events to 45.2% at five or more"],
 "Prevalence varies 28-fold across states - 1.5 percent in Ogun, the non-conflict comparison, to 42 percent in Benue. Camp residents carry roughly four times the prevalence of community residents. Trauma shows the expected dose-response, 8 percent at zero events to 45 at five plus. The multivariable question is what survives adjustment.")

s=add(L_TC); s.placeholders[0].text_frame.text="Two focal exposures, adjusted"; rmbody(s)
rows=[["","PTSD","Depression","Anxiety"],
 ["Model A: per traumatic event","1.15 (1.07-1.23)","1.15 (1.09-1.22)","1.14 (1.08-1.21)"],
 ["Model B: IDP camp residence","2.32 (1.24-4.32)","1.94 (1.21-3.10)","2.87 (1.79-4.62)"]]
tbl=s.shapes.add_table(3,4,Inches(0.9),Inches(2.3),Inches(11.6),Inches(2.6)).table
for ri,r_ in enumerate(rows):
    for ci,c in enumerate(r_):
        cell=tbl.cell(ri,ci); cell.text=c
        if cell.text_frame.paragraphs[0].runs:
            run=cell.text_frame.paragraphs[0].runs[0]; run.font.size=Pt(16)
            if ri==2 and ci>0: run.font.color.rgb=RED
notes(s,"Model A: each additional traumatic event carries 14 to 15 percent higher prevalence of every condition. Model B is the headline, in red: current camp residence carries two- to three-fold higher prevalence after adjusting for demographics, geography, AND trauma exposure - and the trauma coefficients barely move when camp enters. Two separable pathways: the events, and the environment. Camp residence also absorbs much of the Benue-Borno difference.")

content("The burden clusters by community",[
 "Null-model ICCs: 0.86 (PTSD), 0.72 (depression), 0.72 (anxiety)",
 "Still 0.49-0.62 after full adjustment",
 "Most residual variation lies between communities, not between neighbors",
 "Robust: post-stratification weights, alternative cut-points, LGA fixed effects, continuous scores"],
 "The intraclass correlations are exceptional - 0.86 for PTSD in the null model, still above 0.6 adjusted. Most of the variation is between communities, not within them: a targeting instruction. Every sensitivity analysis holds. One more result matters for the next talk: the state-by-trauma interaction was significant, and the trauma association was steepest where baseline exposure was lowest - Enugu, Rivers - and flat in Borno where exposure runs highest. Mohammed's paper takes exactly that thread.")

bigstmt("The camp carries risk the trauma count does not explain.","The finding in one line. Pause.")
divider(3,"What this means.")
content("What this means",[
 "The post-displacement environment is an intervention target in its own right",
 "Extreme community clustering supports community-targeted delivery",
 "Direct input for implementing Nigeria's Mental Health Act",
 "Trauma treatment alone leaves the camp pathway untouched"],
 "The camp association, robust to trauma adjustment, identifies the post-displacement environment as its own target: shelter, safety, livelihoods, services - not trauma treatment alone. The clustering says deliver by community. This is the evidence base the Ministry asked for - Dr. Ojo takes it from here to the Mental Health Act. Limitations in one breath: cross-sectional; purposively selected states so no national weights; camps present in only three states; camp residence could reflect selection of the most affected into camps, though the trauma adjustment addresses the most obvious version of that.")
bigstmt("Thank you","Thank field teams, AFENET, the Federal Ministry, co-authors. [Salma's email]")
pr.save('istss_burden_salma.pptx'); print(len(pr.slides),'slides')
