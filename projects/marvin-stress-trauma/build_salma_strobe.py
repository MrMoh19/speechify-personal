from restructure import *

pr = Presentation("salma_orig.pptx")
S = {i + 1: s for i, s in enumerate(pr.slides)}
L_TC = S[7].slide_layout      # Title and Content
L_TO = S[11].slide_layout     # Title Only

# ---- Introduction
set_title(S[4], "Background: Conflict Landscape")
set_title(S[6], "Background: Economic Context and Mental Health Capacity")
set_title(S[7], "Rationale: The Evidence Gap")
body7 = [ph for ph in S[7].placeholders if ph.placeholder_format.idx == 1][0]
delete_paragraph_containing(body7, "42–67%")
replace_in_shape(body7, "Existing studies: fragmented, mostly hospital-based or single-site convenience samples",
                 "Existing studies: fragmented, mostly hospital-based or single-site convenience samples, with widely varying estimates and instruments rarely validated locally")
set_title(S[8], "Objectives")

# ---- Methods
set_title(S[10], "Study Design and Setting")
set_title(S[11], "Participants and Study Size")
set_title(S[12], "Variables: Outcomes and Cut-Offs")
set_run_text(shape_with_text(S[12], "Cut-offs validated"),
             "PCL-5 and PHQ-9 cut-offs from the validation study (paper 1); GAD-7 at the international ≥10, interpreted cautiously")
set_title(S[13], "Variables: Exposures and Covariates")
set_bullets([ph for ph in S[13].placeholders if ph.placeholder_format.idx == 1][0], [
    "Trauma exposure: adapted Life Events Checklist, count of lifetime event types",
    "IDP camp residence: field-verified at sampling",
    "Covariates: sex, age group, education, marital status, state, and urban or rural setting",
])
bias = new_content_slide(pr, L_TC, "Bias", [
    "Outcome misclassification: case definitions at cut-offs validated against psychiatrist interview in this population",
    "Measurement: standardized tablet-based interviews with built-in range and consistency checks",
    "Over-adjustment: daily stressors and food insecurity excluded as likely mediators of the camp pathway",
    "Selection into camps: Model B adjusts for trauma exposure; residual selection acknowledged",
])
set_title(S[14], "Statistical Analysis")

# ---- Results
flow = flow_slide(pr, L_TO,
                  [("1,774", "adults interviewed across six states"),
                   ("1,732", "included in adjusted models (complete-case analysis)")],
                  ["42 excluded: missing outcome or covariate data"])
set_title(S[16], "Descriptive Data")
set_title(S[18], "Outcome Data: Prevalence")
side = S[18].shapes.add_textbox(Inches(8.95), Inches(2.2), Inches(3.75), Inches(4.1))
tf = side.text_frame
tf.word_wrap = True
lines = [("PTSD 18.5% (95% CI 14.2–23.8)", 15, False, WHITE),
         ("Depression 21.0% (16.4–26.3)", 15, False, WHITE),
         ("Anxiety 20.7% (16.9–25.1)", 15, False, WHITE),
         ("At least 1 in 5 adults met criteria for each condition; 30.4% for at least one", 15, True, ORANGE),
         ("36.2% of those with any condition met all three", 13, False, WHITE),
         ("Design effects 4.7–6.9", 13, False, WHITE)]
for i, (t, sz, b, c) in enumerate(lines):
    p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
    p.space_after = Pt(9)
    r = p.add_run()
    r.text = t
    r.font.size = Pt(sz)
    r.font.bold = b
    r.font.color.rgb = c
set_title(S[19], "Outcome Data: Variation by State, Residence, and Trauma")
set_title(S[20], "Main Results: Adjusted Prevalence Ratios")
set_title(S[21], "Other Analyses: Interaction and Sensitivity")
set_title(S[22], "Other Analyses: Clustering")

# ---- Discussion
set_title(S[26], "Key Results")
body26 = [ph for ph in S[26].placeholders if ph.placeholder_format.idx == 1][0]
set_bullets(body26, [
    "At least 1 in 5 adults across six states met criteria for each condition; 30.4% for at least one",
    "IDP camp residents carry about four times the PTSD burden of community residents (40.4% vs 10.7%), and the camp association holds after adjustment for trauma",
    "Most residual variation lies between communities (ICCs 0.49–0.62 after full adjustment)",
])
limits = new_content_slide(pr, L_TC, "Limitations", [
    "Cross-sectional design: associations, not causal effects",
    "Purposively selected states: estimates are not nationally representative",
    "IDP camps present in three states only",
    "Selection into camps possible; trauma adjustment addresses its most obvious form",
])
set_title(S[24], "Interpretation and Generalisability")
set_bullets([ph for ph in S[24].placeholders if ph.placeholder_format.idx == 1][0], [
    "The post-displacement environment is an intervention target in its own right; trauma treatment alone leaves the camp pathway untouched",
    "Shelter, safety, livelihoods, and services act as mental health interventions in camps",
    "Extreme community clustering supports community-targeted delivery over individual-only approaches",
    "Associations held across six zones differing in conflict type, religion, language, and economy, supporting transfer to other violence-affected settings with similar displacement conditions",
    "Direct evidence base for implementing Nigeria's Mental Health Act",
], size=15)

order = [S[1], S[2], S[4], S[6], S[7], S[8], S[10], S[11], S[12], S[13], bias, S[14],
         flow, S[16], S[18], S[19], S[20], S[21], S[22], S[26], limits, S[24]]
reorder_and_prune(pr, order)
label_all(order, [(3, 6, "Introduction"), (7, 12, "Methods"), (13, 19, "Results"), (20, 22, "Discussion")])

NOTES = [
 "Thank you, Jaimie. I am presenting this paper on behalf of Dr. Salma Abdalla, who led the analysis and could not be here today. Jaimie has shown that the instruments hold in this population, provided they are calibrated. This paper puts them to work across the country and asks two questions: how large is the burden, and what, besides trauma itself, drives it?",
 "Dr. Abdalla has no financial relationships to disclose.",
 "Jaimie described the landscape, so I will be brief. Nigeria has no single conflict. It has insurgency in the northeast, banditry and mass kidnapping in the northwest, farmer–herder conflict in the Middle Belt, separatist violence in the southeast, and cult violence in the Niger Delta. All three recognised forms of organised violence are present at once: conflict involving the state, conflict between armed groups, and violence aimed directly at civilians. Together they have displaced more than three million people.",
 "That violence falls on a population under severe economic pressure. Income per person fell from about 3,100 dollars in 2014 to about 800 in 2024. The mental health system cannot absorb the result: about 0.6 mental health workers per 100,000 people, against a WHO benchmark of 5, roughly 250 psychiatrists for more than 200 million people, and fewer than one in ten people who need care receive any.",
 "Until now the evidence has been fragmented. Most studies were hospital-based or drawn from a single camp, used instruments never validated here, and, as Jaimie showed, produced estimates that vary too widely to guide planning. No study had estimated prevalence across several states using population sampling. The Federal Ministry needs exactly that to implement the Mental Health Act, which is why it co-owns this study.",
 "The paper has three objectives: to estimate the prevalence of PTSD, depression, and anxiety across all six geopolitical zones; to identify the factors associated with each; and to separate two pathways that are usually tangled together, the trauma a person has lived through and the conditions displacement has placed them in.",
 "This is a cross-sectional, population-based survey. We selected one state in each geopolitical zone: Sokoto, Borno, Benue, Ogun, Enugu, and Rivers. Five are affected by different forms of violence; Ogun, in the southwest, serves as the comparison state. In each state we sampled two local government areas, one urban and one rural, and within them seventy wards and their communities. Households were selected systematically from a random start.",
 "Participants were adults aged 18 or older who had lived in the community for at least six months. Camps for internally displaced people were sampled by the same procedure in the three states that have them. The result is 1,774 adults, interviewed face to face between August and December 2025 by teams working with AFENET and the Federal Ministry of Health and Social Welfare.",
 "The outcomes use the thresholds from Jaimie's validation: probable PTSD at a PCL-5 score of 38 or more, and probable depression at a PHQ-9 score of 10 or more. For anxiety we used the international GAD-7 threshold of 10, and, given what Jaimie showed about its discrimination, we read the anxiety estimates with caution.",
 "Trauma exposure is a count of lifetime event types from an adapted Life Events Checklist. Camp residence was verified by the field team at the time of sampling. The covariates are sex, age group, education, marital status, state, and urban or rural setting.",
 "We addressed four sources of bias. Outcome misclassification, through case definitions validated against psychiatrist interview in this population. Measurement error, through standardized tablet-based interviews with built-in checks. Over-adjustment: daily stressors and food insecurity are likely part of the pathway from camp life to symptoms, so we kept them out of the models; adjusting for them would hide the effect we are trying to measure. And selection into camps, which Model B addresses by adjusting for trauma.",
 "We fit two models, each with one focal exposure. Model A asks about trauma: each additional event, adjusted for demographics and geography. Model B asks about camp residence and adds the trauma count to the adjustment, so the camp estimate is the camp's association over and above the events people report. Both are modified Poisson regressions giving prevalence ratios, with variances that respect the clustered design. Multilevel models estimate how much of the variation lies between communities.",
 "Of the 1,774 adults interviewed, 1,732 had complete outcome and covariate data and enter the adjusted models. This is a complete-case analysis; 42 people were excluded for missing data.",
 "The sample reflects the six zones. Mean age was 41; 55 percent were women. Quranic education is concentrated in Borno and Sokoto, and tertiary education in Enugu and Rivers. A quarter of participants lived in camps. Two thirds were moderately or severely food insecure. On average, people reported one and a half types of traumatic event, and 18 percent reported three or more.",
 "Design-adjusted prevalence was 18.5 percent for probable PTSD, 21 percent for depression, and 20.7 percent for anxiety: at least one adult in five met criteria for each condition, and 30.4 percent met criteria for at least one. Those of you who read the program will see slightly different figures there; the abstract carried preliminary estimates, and these are the final estimates from the fully cleaned sample. The conditions travel together: among people with any condition, more than a third met criteria for all three. The design effects, close to seven, are the first sign that the burden clusters by community.",
 "Before adjustment, the variation is striking. PTSD prevalence ranges from 1.5 percent in Ogun to 42 percent in Benue, a 28-fold difference. Camp residents have about four times the prevalence of people living in communities: 40 percent against 11. And trauma shows a clear gradient: 8 percent among people with no traumatic events, 45 percent among those with five or more. The question is which of these survives adjustment.",
 "Both do. In Model A, each additional traumatic event is associated with about 15 percent higher prevalence of each condition. In Model B, living in a camp is associated with roughly twice the prevalence of PTSD and depression and nearly three times the prevalence of anxiety, after accounting for trauma. The trauma estimates hardly move when camp residence enters the model. These are two separable pathways: what happened to people, and where they now live.",
 "Two further analyses. The association between trauma and outcomes is not the same everywhere. It is steepest in Enugu and Rivers, where exposure is lowest, and nearly flat in Borno, where exposure is highest. Keep that result in mind; my own paper begins there. The findings hold under post-stratification weights, the international PCL-5 threshold of 33, local government fixed effects, continuous scores, and multilevel models.",
 "The intraclass correlations are unusually high: 0.86 for PTSD before adjustment, and between 0.49 and 0.62 after full adjustment. After everything we can measure, about half of the remaining variation lies between communities, not between neighbours. The burden belongs to places as much as to people.",
 "To summarise the key results: at least one adult in five met criteria for each condition, and 30 percent for at least one. Camp residents carry about four times the PTSD burden of community residents, and that association holds after adjustment for trauma. And much of the variation lies between communities.",
 "The limitations are the ones you would expect. The design is cross-sectional. The states were chosen purposively, so these are not national estimates. Camps exist in only three states. And people may enter camps partly because they were more affected, although adjusting for trauma addresses the most obvious form of that selection.",
 "Three implications. First, the post-displacement environment is an intervention target in its own right: treating individual trauma leaves the camp pathway untouched, and shelter, safety, livelihoods, and services act as mental health interventions in camps. Second, the clustering argues for delivering services by community, not only by screening individuals. Third, because the associations held across six zones that differ in conflict type, religion, language, and economy, we expect them to transfer to other violence-affected settings with similar displacement conditions. These are the estimates the Ministry needs to implement the Mental Health Act.\n\n[Handover, no pause] That is Dr. Abdalla's paper. I want to stay with one of her results, the flat trauma gradient in Borno, because that is where my own paper begins.",
]
assert len(NOTES) == len(order)
for s, n in zip(order, NOTES):
    set_notes(s, n)
pr.save("istss_salma_STROBE.pptx")
print("salma slides:", len(pr.slides))
