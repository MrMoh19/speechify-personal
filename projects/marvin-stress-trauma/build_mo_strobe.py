from restructure import *

FIG = "/home/user/speechify-personal/projects/marvin-stress-trauma/"
pr = Presentation("mo_orig.pptx")
S = {i + 1: s for i, s in enumerate(pr.slides)}
L_TC = S[22].slide_layout
L_TO = S[12].slide_layout

# ---- Introduction
set_title(S[6], "Background")
for sh in list(S[6].shapes):
    if sh.shape_id not in (2, 8):
        remove_shape(sh)
set_bullets(shape_by_id(S[6], 8), [
    "Violence-exposed Nigerians carry two loads: traumatic events and daily socioeconomic stressors",
    "Most humanitarian programming assumes the two add, so stress reduction helps everyone equally",
    "Whether they add or interact decides who benefits from which intervention",
    "Three accounts in the literature predict different answers",
], size=18)
set_title(S[7], "Background: Building-Block Model")
set_title(S[8], "Background: Stress Sensitization")
set_title(S[9], "Rationale: Saturation, Never Formally Tested")
set_title(S[10], "Objectives and Hypotheses")

# ---- Methods
set_title(S[12], "Study Design, Setting, and Participants")
remove_shape(shape_with_text(S[12], "Adjusted models: N = 1,706"))
set_title(S[13], "Variables and Measurement")
set_run_text(shape_with_text(S[13], "Cut-offs validated"),
             "PCL-5 and PHQ-9 cut-offs from the validation study (paper 1); GAD-7 at the international ≥10, interpreted cautiously")
bias = new_content_slide(pr, L_TC, "Bias", [
    "Exposure misclassification: the 37 who declined the trauma items treated as missing, not unexposed; counts verified against item-level responses",
    "Confounding: all models adjusted for age, gender, education, and state",
    "Correlated exposures: stressor burden rises with trauma, so the interaction is tested formally with adjustment",
    "Artifacts: ratio-scale compression, cut-off choice, and imposed functional form each addressed by a prespecified analysis",
])
set_title(S[14], "Statistical Analysis: Spline Model")
set_title(S[15], "Statistical Analysis: Scales and Sensitivity")

# ---- Results
flow = flow_slide(pr, L_TO,
                  [("1,774", "adults interviewed across six states"),
                   ("1,729", "completed the trauma inventory and outcomes"),
                   ("1,706", "included in adjusted models (complete-case analysis)")],
                  ["45 excluded: 37 declined the trauma items; 8 missing outcome or sampling data",
                   "23 excluded: missing covariate data"])
set_title(S[17], "Descriptive Data: Exposures")
stress = new_title_only_slide(pr, L_TO, "Descriptive Data: Stressors by Trauma Exposure")
add_picture_fit(stress, FIG + "stressor_by_trauma.png")
set_title(S[18], "Outcome Data: PTSD by Trauma Exposure")
ch18 = [sh for sh in S[18].shapes if sh.has_chart][0].chart
cd = CategoryChartData()
cd.categories = list(ch18.plots[0].categories)
cd.add_series(ch18.series[0].name, (6.6, 19.5, 39.6))
ch18.replace_data(cd)
set_title(S[19], "Main Results: Per-Stressor Prevalence Ratios")
spline = new_title_only_slide(pr, L_TO, "Main Results: Spline Estimate")
add_picture_fit(spline, FIG + "spline_effect.png")

set_title(S[20], "Main Results: Absolute Scale")
# PTSD, five or more events: corrected point estimate -7.3 (CI -30.0 to +15.3); axis spans -20 to +40
x0, per = 6.345, 0.14365
dot, lab, whisk, capL, capR = (shape_by_id(S[20], i) for i in (432, 433, 429, 430, 431))
centre = x0 + (-7.3) * per
old_left = dot.left
dot.left = Inches(centre - 0.085)
lab.left = lab.left + (dot.left - old_left)
set_run_text(lab, "−7.3")
axis_min, hi = 3.47, x0 + 15.3 * per
whisk.left = Inches(axis_min)
whisk.width = Inches(hi - axis_min)
capR.left = Inches(hi)
remove_shape(capL)
note = S[20].shapes.add_textbox(Inches(axis_min - 0.02), Inches(3.49), Inches(1.2), Inches(0.25))
r = note.text_frame.paragraphs[0].add_run()
r.text = "◂ to −30.0"
r.font.size = Pt(9)
r.font.color.rgb = GREY

set_title(S[21], "Main Results: Prevalence Curves")
_lab = shape_with_text(S[21], "Prevalence (%) by stressor count")
_lab.top = Inches(1.62)
_chart = [sh for sh in S[21].shapes if sh.has_chart][0]
_chart.top = Inches(1.98)
_chart.height = Inches(4.18)
ch21 = [sh for sh in S[21].shapes if sh.has_chart][0].chart
cd = CategoryChartData()
cd.categories = list(ch21.plots[0].categories)
vals = [(6.6, 13.6, 28.3, 58.9), (9.5, 15.2, 24.5, 39.3), (19.5, 21.5, 23.6, 26.0), (39.6, 35.7, 32.2, 29.1)]
for ser, v in zip(ch21.series, vals):
    cd.add_series(ser.name, v)
ch21.replace_data(cd)

set_title(S[22], "Sensitivity Analyses")
body22 = shape_by_id(S[22], 3)
replace_in_shape(body22, "sits at ~40% prevalence", "sits at 30–40% prevalence")

# ---- Discussion
set_title(S[24], "Key Results: Hypotheses")
set_title(S[25], "Key Results: A Graded Pattern")
body25 = shape_by_id(S[25], 3)
p0 = body25.text_frame.paragraphs[0]
p0.runs[0].text = "The exposures do not simply add (H1), and the interaction runs toward saturation (H2)"
for r_ in p0.runs[1:]:
    r_._r.getparent().remove(r_._r)
set_title(S[28], "Limitations")
replace_in_shape(shape_by_id(S[28], 3), "casual", "causal")
set_title(S[26], "Interpretation: Candidate Mechanisms")
set_title(S[27], "Interpretation: Implications for Programming")
replace_in_shape(shape_with_text(S[27], "heavily exposed minority"), "~40% prevalence regardless of stressors", "30–40% prevalence at every stressor level")
set_title(S[30], "Generalisability and Conclusions")
body30 = shape_by_id(S[30], 3)
gp = copy.deepcopy(body30.text_frame.paragraphs[-1]._p)
body30.text_frame._txBody.append(gp)
last = body30.text_frame.paragraphs[-1]
last.runs[0].text = "Six states spanning five forms of violence and a non-conflict comparison; replication in other high-exposure settings is needed"
for r_ in last.runs[1:]:
    r_._r.getparent().remove(r_._r)

order = [S[1], S[2], S[6], S[7], S[8], S[9], S[10], S[12], S[13], bias, S[14], S[15],
         flow, S[17], stress, S[18], S[19], spline, S[20], S[21], S[22],
         S[24], S[25], S[28], S[26], S[27], S[30]]
reorder_and_prune(pr, order)
label_all(order, [(3, 7, "Introduction"), (8, 12, "Methods"), (13, 21, "Results"), (22, 27, "Discussion")])

NOTES = [
 "My paper uses the same survey and asks a different question. Dr. Abdalla showed that trauma and camp residence each raise the burden. I want to ask whether trauma changes what everyday stress does to people.",
 "I have no financial relationships to disclose.",
 "People in this population carry two kinds of load. One is the traumatic events: assault, armed attack, disaster. The other is the daily grind: losing a job, struggling to pay rent, family breakdown, isolation. Most humanitarian programming assumes the two simply add, so reducing stress helps everyone equally. Whether that is true decides who benefits from which intervention, and the literature offers three accounts that predict different answers.",
 "The first is the building-block model of Miller and Rasmussen. Trauma and daily stressors each add risk independently. Trauma raises the whole line; each stressor adds the same amount whoever you are. The implication is that stress reduction helps everyone equally.",
 "The second is stress sensitization, from Hammen and from McLaughlin's work on childhood adversity. Trauma lowers the threshold at which stress produces symptoms, so each added stressor does more harm among people with more trauma. If that is right, stress reduction does the most good for the most exposed.",
 "The third is less developed. Studies of Syrian and Burundian refugees found that stress sensitivity diminished among the most exposed: their symptoms were high and stopped tracking current stress. Nobody had formally tested the shape of this interaction, across several outcomes, in an African conflict setting, in a population where exposure runs this high. That is the gap this paper addresses.",
 "Our objective was to test whether trauma exposure modifies the association between socioeconomic stressors and PTSD, depression, and anxiety. We had two hypotheses. First, that the trauma-by-stressor interaction is real, meaning the two exposures do not simply add. Second, that the interaction is negative: stress sensitivity diminishes with extensive trauma, which is saturation, not sensitization.",
 "This is the survey you have just seen: a cross-sectional, population-based sample from six states, one per geopolitical zone, fielded between August and December 2025. Ogun matters here. It gives us people with little or no trauma exposure, which is where the stress gradient turns out to live.",
 "The outcomes are the same: PCL-5 at 38, PHQ-9 at 10, and GAD-7 at 10, read cautiously. Trauma is the count of twelve event types from the adapted Life Events Checklist. Daily stressors are a ten-item count developed for Nigeria, covering job loss, rent, eviction, family disruption, and isolation. All models adjust for age, gender, education, and state.",
 "We addressed bias on four fronts. The 37 people who declined the trauma items are treated as missing, not as unexposed, and we checked every count against the item-level answers. All models adjust for age, gender, education, and state. Stressor burden rises with trauma, so the interaction had to be tested formally, with adjustment. And each route to a statistical artifact, from ratio-scale compression to the choice of cut-off to an imposed functional form, has its own prespecified analysis.",
 "Two analytic choices carry the argument. The first concerns how we enter trauma. In the dissertation version we grouped people into bins: none, one to two, three to four, five or more. A sceptic can reasonably say the bins produced the pattern. So here trauma enters as a continuous count through a restricted cubic spline, a set of smooth curve segments joined at chosen points, called knots, at zero, two, and five events. The spline lets the data choose the shape: a steepening, no change, or a flattening. We did not decide in advance which.",
 "The second choice is to read the interaction on two scales. A ratio can shrink for purely arithmetic reasons when baseline risk is high, so we also report absolute differences in percentage points, which do not have that property. Claims about who should receive which intervention rest on absolute risk. We prespecified sensitivity analyses at other cut-points, on continuous symptom scores, and with the categorical version of trauma.",
 "Of the 1,774 adults interviewed, 1,729 completed the trauma inventory and the outcome measures; 37 declined the trauma items and 8 lacked outcome or sampling data. Adjusted models include 1,706 people with complete covariates. This is a complete-case analysis.",
 "Just over a quarter of people reported no traumatic event, about half reported one or two, 13 percent three or four, and 5.5 percent five or more. The average person reported about two current stressors.",
 "The two exposures are correlated. Mean stressor burden rises from about one at no trauma to about five at five or more events, which is why the interaction needs formal, adjusted testing. Note also the spread: the five-plus group has the widest stressor range in the sample, from zero to ten, so any null in that group is estimated over real variation, not a compressed range.",
 "First, the main effect, so the interaction has context. At zero stressors, adjusted PTSD prevalence rises from about 7 percent among people with no trauma to about 40 percent at five events. Trauma dominates the risk landscape. That part is expected. The question is what happens to the stress gradient along the way.",
 "This is the central result. Each marker is the prevalence ratio for one additional daily stressor, with its confidence interval; the dashed line at 1 means no added risk. Start on the left. Among adults with no traumatic events, each added stressor nearly doubles the prevalence of probable PTSD, a ratio of 1.97. Depression, at 1.83, and anxiety, at 1.71, move with it. Now read to the right. At one to two events the ratios fall to between 1.15 and 1.27. At three to four events the intervals sit on the line, and at five or more events all three outcomes are at the null. The interaction is below 0.0001 for all three outcomes. The stressor gradient is steepest where trauma is lowest, which is the opposite of what sensitization predicts.",
 "This is the spline itself: the per-stressor prevalence ratio as a continuous function of the trauma count, with its confidence band. The curve was free to rise, stay flat, or fall. It falls smoothly and crosses the null at about four events. The red markers are the categorical estimates, and the two approaches agree on the shape. The spline interaction is significant for all three outcomes: p of 0.003 for PTSD, 0.0001 for depression, and 0.003 for anxiety.",
 "A sceptic would say the ratio fades only because people with heavy trauma already have high prevalence. So here is the same comparison in percentage points. Going from zero to four stressors adds about 22 points of PTSD prevalence among people with no trauma exposure, 24 points of depression, and 18 points of anxiety. Among people with five or more events, the same four stressors add nothing measurable to any of the three. The fading appears in percentage points too, so it is not an artifact of the ratio scale.",
 "Here is the same result as prevalence. Each line is a level of trauma. The red line, no trauma exposure, rises from about 7 percent to 28 percent across four stressors and keeps climbing. Each step up in trauma rotates the line flatter, and at five or more events the line is high and does not rise with stress; if anything it drifts down. The gradient belongs to people with little trauma; the burden belongs to people with a lot. Depression and anxiety fan out the same way.",
 "We tried every route to an artifact we could think of. The pattern holds at alternative cut-points: PCL-5 at 33, PHQ-9 at 15, and GAD-7 at 7. It holds in continuous symptom scores, where there is no cut-point at all. The high-trauma group is not at a ceiling; its prevalence is between 30 and 40 percent, not near 100, and its confidence interval is narrow.",
 "To return to the objective: trauma does modify how daily stressors relate to all three outcomes. The interaction is significant for PTSD, depression, and anxiety, so the exposures do not simply add; that is hypothesis one. And the direction is negative: with no trauma, each stressor nearly doubles PTSD prevalence, and with five or more events it adds nothing; that is hypothesis two, saturation rather than sensitization.",
 "The change is graded, not a switch. Sensitivity is retained at one or two events, flattens at three or four, and is gone by five. One reading is that both older theories hold, at different levels of exposure.",
 "The limitations: the design is cross-sectional, so selection and reverse causation cannot be excluded; trauma is lifetime recall while stressors are current; data above six events are sparse, so we report predictions only to five; and these are screens, not diagnoses, although they are locally validated and the pattern holds in continuous scores.",
 "Several mechanisms could produce this pattern: allostatic exhaustion, in McEwen's sense; blunted cortisol and amygdala responses after chronic trauma, which Yehuda has documented; emotional numbing; and altered assumptions about the world, so that one more hardship no longer registers as a departure from expected danger. These data describe a pattern across people; they do not demonstrate a mechanism within a person.",
 "The practical implication is stratification. About four in five adults in this sample have fewer than three types of trauma and retain stress sensitivity. For them, stress management, livelihood support, Problem Management Plus, and community psychosocial support address something their symptoms respond to. The minority with extensive exposure carries high prevalence whatever their current stress. For them the treatments with evidence are trauma-focused: Narrative Exposure Therapy and culturally adapted Cognitive Processing Therapy. A brief trauma-history screen at program entry could route scarce specialist capacity to the people for whom stress reduction cannot substitute.",
 "Trauma changes what everyday stress does. The risk from each additional stressor falls from nearly double among people with no trauma to nothing among people with five or more events, for all three outcomes, on both scales, and in every sensitivity analysis. These data come from six states spanning five forms of violence and a peaceful comparison; replication in other high-exposure settings, and a longitudinal test of when saturation develops and whether it reverses with treatment, are the next steps. Universal programs built on simple dose-response assumptions do not fit these data; we should match the intervention to trauma history.\n\n[Handover] If need comes in two tiers, the service system has to be built in two tiers. That is a policy question, and Dr. Ojo is the person in Nigeria who has to answer it. Thank you.",
]
assert len(NOTES) == len(order), (len(NOTES), len(order))
for s, n in zip(order, NOTES):
    set_notes(s, n)
pr.save("istss_mohammed_STROBE.pptx")
print("mohammed slides:", len(pr.slides))
