const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_16x9";
const F = "Avenir Book", RED = "FF0000", GRAY = "898989", BLK = "000000";

function base(notes){ const s = p.addSlide(); s.background = { color:"FFFFFF" }; if(notes) s.addNotes(notes); return s; }
function title(s, t){ s.addText(t, { x:0.6, y:0.45, w:8.8, h:0.7, fontFace:F, fontSize:28, color:BLK, isTextBox:true, margin:0 }); }
function body(s, lines, opts={}){ s.addText(lines.map(l=>({ text:l.text, options:{ color:l.red?RED:BLK, breakLine:true, paraSpaceAfter:l.gap===false?2:14 }})), { x:0.6, y:opts.y||1.5, w:8.8, h:3.6, fontFace:F, fontSize:opts.size||20, color:BLK, isTextBox:true, margin:0, valign:"top" }); }
function big(s, t){ s.addText(t, { x:0.8, y:2.2, w:8.4, h:1.2, fontFace:F, fontSize:30, color:BLK, isTextBox:true, margin:0, align:"center", valign:"middle" }); }
const SECTIONS = ["1. Background","2. Methods","3. Results","4. Discussion"];
function divider(cur, notes){ const s = base(notes);
  s.addText(SECTIONS.map((t,i)=>({ text:t, options:{ color:i===cur?RED:BLK, breakLine:true, paraSpaceAfter:18 }})),
    { x:3.4, y:1.6, w:4.0, h:2.6, fontFace:F, fontSize:24, isTextBox:true, margin:0 }); }

// 1 Title
let s = base("Thank the chair. One sentence: this talk asks whether trauma changes what everyday stress does to mental health, in the same population Salma just described.");
s.addText("When More Trauma Means Less Stress Sensitivity", { x:0.7, y:1.5, w:8.6, h:0.9, fontFace:F, fontSize:30, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("Evidence for a Trauma Saturation Effect Among\nViolence-Exposed Populations in Nigeria", { x:0.8, y:2.45, w:8.4, h:0.9, fontFace:F, fontSize:18, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("Mohammed Abba-Aji  ·  Washington University in St. Louis", { x:0.8, y:3.6, w:8.4, h:0.4, fontFace:F, fontSize:14, color:GRAY, isTextBox:true, margin:0, align:"center" });
s.addText("ISTSS 42nd Annual Meeting  ·  San Antonio, TX  ·  September 24, 2026", { x:0.8, y:4.05, w:8.4, h:0.4, fontFace:F, fontSize:12, color:GRAY, isTextBox:true, margin:0, align:"center" });

// 2 Disclosure
s = base("Read once, briefly: no financial relationships to disclose.");
title(s, "Financial disclosure");
body(s, [
 { text:"In the past 24 months, I, Mohammed Abba-Aji, have not had financial relationships with any ineligible companies." },
 { text:"No discussion of unapproved uses of pharmaceuticals or devices." },
], { size:18 });

// 3 Divider
divider(0, "Roadmap: background, methods, results, discussion.");

// 4 Background: the setting
s = base("Jaimie showed the instruments work here; Salma showed the burden at scale. The population carries two loads at once: traumatic events from overlapping conflicts, and grinding daily adversity — food insecurity, job loss, housing precarity. Humanitarian programming usually treats these as one additive pile of risk. Whether that is true decides who universal psychosocial programs actually help.");
title(s, "Two burdens, one population");
body(s, [
 { text:"Conflict-affected Nigerians carry traumatic exposure and daily socioeconomic adversity together" },
 { text:"Programming typically treats the two as additive: every stressor removed helps everyone equally" },
 { text:"If trauma modifies stress sensitivity, that assumption fails for a large share of the population" },
]);

// 5 Background: prior evidence
s = base("The literature offers three incompatible answers. Stress sensitization — Post's kindling work, and the child-adversity literature — says prior trauma amplifies reactivity to later stress, so gradients should be steepest among the most exposed. Stress inoculation says moderate exposure toughens, predicting the opposite. And the daily-stressors model in humanitarian settings — Miller and Rasmussen — says everyday adversity mediates much of conflict's effect but is largely silent on effect modification. Almost all the evidence behind these comes from high-income cohorts with far lower exposure ranges than ours. Nobody has tested the shape of the interaction in a population where exposure runs this high.");
title(s, "Three predictions in the literature");
body(s, [
 { text:"Stress sensitization: prior trauma amplifies reactivity, steepest gradients among the exposed" },
 { text:"Stress inoculation: moderate exposure protects against later stress" },
 { text:"Daily-stressors model: adversity mediates conflict's effect; silent on modification" },
 { text:"Nearly all evidence: high-income samples, narrow exposure ranges", gap:false },
]);

// 6 Big statement
s = base("The question in one line. Pause.");
big(s, "Does trauma change what stress does?");

// 7 Divider
divider(1, "Methods: the sample you have already met, then measures, then the model.");

// 8 Methods: sample
s = base("The MaRVIN sample Salma presented: 1,774 adults surveyed January to March 2024; 1,729 answered the trauma inventory and enter this analysis. Six states: five conflict-affected — Benue, Borno, Enugu, Rivers, Sokoto — plus Ogun as a non-conflict comparison, which anchors the low end of the trauma gradient. Stratified multi-stage cluster design, 565 community clusters, community and IDP-camp settings. All analyses honor the design: state strata, community clusters, linearized variances.");
title(s, "Sample");
body(s, [
 { text:"1,729 adults, January–March 2024 (of the 1,774 in the previous talk)" },
 { text:"Five conflict-affected states + Ogun (non-conflict comparison)" },
 { text:"Stratified multi-stage cluster design; 565 communities" },
 { text:"Community and displacement-camp settings" },
]);

// 9 Methods: measures
s = base("Outcomes use the instruments Jaimie validated: probable PTSD at PCL-5 38 and above; depression, PHQ-9 at 10; anxiety, GAD-7 at 10. Trauma exposure is a count of twelve event types — assaults, armed conflict, disasters, accidents; respondents who declined the inventory are excluded, not counted as unexposed. Stressors are a 0-to-10 count of socioeconomic challenges: job loss, rent difficulty, eviction, family disruption, isolation.");
title(s, "Measures");
body(s, [
 { text:"PCL-5 ≥ 38  ·  PHQ-9 ≥ 10  ·  GAD-7 ≥ 10 (validated in this population — paper 1)" },
 { text:"Trauma: count of 12 event types; refusals excluded, not zero" },
 { text:"Stressors: socioeconomic challenge count, 0–10" },
]);

// 10 Methods: model
s = base("The analytic choice that matters: trauma enters continuously, zero to twelve, as a restricted cubic spline, so the shape of any saturation is estimated from the data — the earlier categorical specification imposed it. Poisson models return prevalence ratios directly; adjusted for age, gender, education, state; variances honor the cluster design. The test is the trauma-by-stressor interaction, and we read it on two scales, because relative ratios answer etiology while absolute percentage points answer programming. Everything is prespecified with sensitivity analyses on thresholds and continuous scores.");
title(s, "Model");
body(s, [
 { text:"Trauma as a restricted cubic spline: the saturation shape is estimated, not assumed" },
 { text:"Poisson prevalence ratios; adjusted; design-based variances" },
 { text:"Test: trauma × stressor interaction — on the relative and the absolute scale" },
 { text:"Sensitivity: alternative thresholds, continuous scores, categorical specification", gap:false },
]);

// 11 Divider
divider(2, "Results in four steps: the burden, the gradient, the picture, the absolute numbers.");

// 12 Results: main effect
s = base("First the main effect, so the interaction has context. At zero stressors, adjusted PTSD prevalence climbs from 6.5 percent among the unexposed to 41 percent at five event types — a six-fold burden gradient. Trauma dominates the risk landscape here; that is not the news. The news is what happens to the stress gradient along the way.");
title(s, "The burden gradient");
body(s, [
 { text:"Adjusted PTSD prevalence at zero stressors:" },
 { text:"6.5% with no trauma exposure" },
 { text:"20% at three event types" },
 { text:"41% at five event types" },
 { text:"Trauma dominates the risk landscape — that is not the news", gap:false },
]);

// 13 Results: IRR table
s = base("Now the interaction. Read the red row: among adults with no trauma exposure, each additional stressor nearly doubles PTSD prevalence — ratio 1.97. Walk down the column: 1.26 at one to two events, null at three to four, null at five plus. Depression and anxiety show the same staircase. All three interactions below 0.0001. This is the opposite of sensitization: the gradient is steepest where exposure is lowest.");
title(s, "Per-stressor prevalence ratio, by trauma exposure");
{
 const rows = [
  [{text:"Trauma"},{text:"PTSD"},{text:"Depression"},{text:"Anxiety"}],
  [{text:"0 events"},{text:"1.97 (1.53–2.54)"},{text:"1.83 (1.46–2.30)"},{text:"1.71 (1.35–2.17)"}],
  [{text:"1–2"},{text:"1.26"},{text:"1.27"},{text:"1.15"}],
  [{text:"3–4"},{text:"1.03"},{text:"0.95"},{text:"0.86"}],
  [{text:"5+"},{text:"0.92 (0.83–1.03)"},{text:"0.99"},{text:"1.03"}],
  [{text:"Interaction p"},{text:"<0.0001"},{text:"<0.0001"},{text:"<0.0001"}],
 ].map((r,ri)=>r.map(c=>({ text:c.text, options:{ fontFace:F, fontSize:15, color: ri===1?RED:BLK, align:"left", valign:"middle" }})));
 s.addTable(rows, { x:0.6, y:1.5, w:8.8, colW:[2.0,2.4,2.2,2.2], border:{type:"none"}, rowH:0.45 });
}

// 14 Chart
s = base("The same result as a picture. Each line is a trauma level; horizontal axis is the stressor count; vertical is adjusted PTSD prevalence. The red line — no trauma exposure — climbs from 7 to 28 percent and keeps rising. The five-event line starts near 41 percent and does not move. The lines converge: the gradient belongs to the unexposed, the burden belongs to the exposed.");
title(s, "Adjusted PTSD prevalence");
s.addChart(p.ChartType.line, [
 { name:"No trauma", labels:["0","2","4","6"], values:[6.5,13.6,28.4,59.1] },
 { name:"1 event",   labels:["0","2","4","6"], values:[9.4,15.2,24.4,39.4] },
 { name:"3 events",  labels:["0","2","4","6"], values:[19.6,21.5,23.7,26.0] },
 { name:"5 events",  labels:["0","2","4","6"], values:[40.9,39.6,38.4,37.2] },
], { x:0.6, y:1.35, w:8.8, h:3.6,
 chartColors:[RED,"A6A6A6","737373",BLK], lineSize:2.5, lineDataSymbol:"none",
 showLegend:true, legendPos:"r", legendFontSize:12, legendFontFace:F,
 showTitle:false, showValue:false,
 catAxisTitle:"Socioeconomic stressors (count)", showCatAxisTitle:true, catAxisTitleFontSize:12, catAxisTitleColor:BLK,
 valAxisTitle:"Prevalence (%)", showValAxisTitle:true, valAxisTitleFontSize:12, valAxisTitleColor:BLK,
 catAxisLabelColor:BLK, valAxisLabelColor:BLK, catAxisLabelFontFace:F, valAxisLabelFontFace:F,
 valAxisMaxVal:60, valAxisMinVal:0,
 valGridLine:{ color:"E6E6E6", size:0.5 }, catGridLine:{ style:"none" } });

// 15 Absolute scale
s = base("Why this matters for programming: the absolute scale. Zero to four stressors adds 22 percentage points of PTSD prevalence among adults with no trauma exposure, 7 to 28 percent. The same contrast among adults with five event types adds nothing — minus two and a half points, interval straddling zero, against a baseline near 40 percent.");
title(s, "Four additional stressors, in percentage points");
s.addText([{ text:"+21.8", options:{ color:RED }}], { x:1.2, y:1.7, w:3.4, h:1.2, fontFace:F, fontSize:60, isTextBox:true, margin:0, align:"center" });
s.addText("no trauma exposure\n(95% CI 7.2–36.5)", { x:1.2, y:2.9, w:3.4, h:0.8, fontFace:F, fontSize:14, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("−2.5", { x:5.4, y:1.7, w:3.4, h:1.2, fontFace:F, fontSize:60, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("five or more events\n(95% CI −18.3 to +13.4)", { x:5.4, y:2.9, w:3.4, h:0.8, fontFace:F, fontSize:14, color:BLK, isTextBox:true, margin:0, align:"center" });

// 16 Results: dep & anx
s = base("Depression and anxiety, same test. Four stressors add 24 points of depression prevalence at zero trauma, 5 to 29 percent; at five events, plus three and a half, null, against 35 percent. Anxiety: plus 18 at zero trauma, minus four, null, at five. Three outcomes, one pattern. And it is not a cutoff artifact — alternative thresholds and the continuous symptom scores all reproduce the interaction at p of 0.0002 or below.");
title(s, "Depression and anxiety: the same pattern");
body(s, [
 { text:"Depression: +24.1 points at zero trauma (5%→29%); +3.5, null, at five events" },
 { text:"Anxiety: +17.8 points at zero trauma; −4.0, null, at five events" },
 { text:"Robust: alternative thresholds and continuous scores, all p ≤ 0.0002" },
]);

// 17 Big statement
s = base("The finding in one line. Pause on this slide.");
big(s, "The stress gradient lives among the least trauma-exposed.");

// 18 Divider
divider(3, "What this means, and what it cannot mean.");

// 19 Discussion: implications
s = base("Against sensitization, and beyond simple dose-response: symptom prevalence among the heavily exposed is high at every stressor level — saturated — while stress sensitivity is concentrated among those with limited exposure. For programming: universal stress-reduction aims at people whose symptoms no longer track stress. Match the intervention to trauma history. Stress-focused and livelihood support where sensitivity is retained — the majority, with limited exposure. Trauma-focused therapies — the treatments this society's trials support — where exposure is extensive, because for them the trauma load, not the stressor load, is the target.");
title(s, "What this means");
body(s, [
 { text:"Not sensitization: gradients flatten, not steepen, with exposure" },
 { text:"Universal stress-reduction targets people whose symptoms no longer track stress" },
 { text:"Stress-focused and livelihood support where sensitivity is retained" },
 { text:"Trauma-focused therapies where exposure is extensive" },
]);

// 20 Discussion: limits
s = base("Stated plainly. Cross-sectional data: saturation names an association pattern, not a mechanism — selection, recall, and ceiling processes could each contribute. Event counts are lifetime recall; stressors are current. Few respondents above six events, so the extreme tail is unstable. And prevalence, not incidence: we see who is symptomatic, not who became so. The longitudinal test — does a new stressor move symptoms differently by trauma history — is the next study.");
title(s, "Limits");
body(s, [
 { text:"Cross-sectional: a pattern of association, not a mechanism" },
 { text:"Lifetime event recall against current stressors" },
 { text:"Sparse data above six events" },
 { text:"Prevalence, not incidence — the longitudinal test is next", gap:false },
]);

// 21 Close
s = base("Thank the field teams across the six states, co-authors, and the symposium chair. Hand to Dr. Ojo, whose paper takes these findings to the ministry.");
s.addText("[your preferred email]", { x:0.8, y:2.5, w:8.4, h:0.6, fontFace:F, fontSize:22, color:BLK, isTextBox:true, margin:0, align:"center" });

p.writeFile({ fileName:"istss_trauma_saturation.pptx" }).then(()=>console.log("done"));
