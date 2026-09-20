const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_16x9"; // 10 x 5.625
const F = "Avenir Book", RED = "FF0000", GRAY = "898989", DIM = "D9D9D9", BLK = "000000";
const W = 10, H = 5.625;

function base(notes){ const s = p.addSlide(); s.background = { color:"FFFFFF" }; if(notes) s.addNotes(notes); return s; }
function title(s, t){ s.addText(t, { x:0.6, y:0.45, w:8.8, h:0.7, fontFace:F, fontSize:28, color:BLK, isTextBox:true, margin:0 }); }
function body(s, lines, opts={}){ s.addText(lines.map((l,i)=>({ text:l.text, options:{ color:l.red?RED:(l.dim?DIM:BLK), breakLine:true, paraSpaceAfter:l.gap===false?2:14 }})), { x:0.6, y:opts.y||1.5, w:8.8, h:3.6, fontFace:F, fontSize:opts.size||20, color:BLK, isTextBox:true, margin:0, valign:"top" }); }
function big(s, t, notes){ s.addText(t, { x:0.8, y:2.2, w:8.4, h:1.2, fontFace:F, fontSize:30, color:BLK, isTextBox:true, margin:0, align:"center", valign:"middle" }); }
const SECTIONS = ["1. Background","2. Methods","3. Results","4. Discussion"];
function divider(cur, notes){ const s = base(notes);
  s.addText(SECTIONS.map((t,i)=>({ text:t, options:{ color:i===cur?RED:BLK, breakLine:true, paraSpaceAfter:18 }})),
    { x:3.4, y:1.6, w:4.0, h:2.6, fontFace:F, fontSize:24, isTextBox:true, margin:0 }); }

// 1 Title
let s = base("Thank the chair. One sentence: this talk asks whether trauma changes what everyday stress does to mental health, using population data from Nigeria.");
s.addText("Trauma Saturation and\nDifferential Stress Sensitivity", { x:0.8, y:1.7, w:8.4, h:1.5, fontFace:F, fontSize:34, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("Evidence from six Nigerian states", { x:0.8, y:3.15, w:8.4, h:0.5, fontFace:F, fontSize:18, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("Mohammed Abba-Aji  ·  Washington University in St. Louis  ·  ISTSS 2026", { x:0.8, y:3.85, w:8.4, h:0.4, fontFace:F, fontSize:14, color:GRAY, isTextBox:true, margin:0, align:"center" });

// 2 Divider
divider(0, "Roadmap: background, methods, results, discussion. We are here.");

// 3 Background
s = base("Two traditions. Additive models: trauma and daily stressors each add risk, so everyone benefits from stress reduction. Effect-modification models: trauma changes stress reactivity itself. Conflict settings are where the two make sharply different predictions, and where the evidence is thinnest. Our earlier work documented roughly one in five adults with probable PTSD across conflict-affected Nigeria.");
title(s, "Two views of trauma and daily stress");
body(s, [
 { text:"Additive: each stressor adds the same risk to everyone" },
 { text:"Effect modification: trauma changes stress sensitivity itself" },
 { text:"Conflict settings make these predictions diverge" },
 { text:"Nigeria: ~1 in 5 adults with probable PTSD in conflict-affected states" },
]);

// 4 Big statement
s = base("The question in one line. If trauma exposure modifies stress sensitivity, universal psychosocial programming is aiming at the wrong target for a large share of the population.");
big(s, "Does trauma change what stress does?");

// 5 Divider
divider(1, "Now the methods.");

// 6 Methods: sample
s = base("Survey of 1,729 adults (37 who declined the trauma items are excluded), January to March 2024. Six states: five conflict-affected — Benue, Borno, Enugu, Rivers, Sokoto — and Ogun as a non-conflict comparison, which anchors the low end of the trauma gradient. Stratified multi-stage cluster design: state strata, 572 community clusters, community and IDP-camp settings. Analyses account for the design throughout.");
title(s, "Sample");
body(s, [
 { text:"1,729 adults, January–March 2024" },
 { text:"Five conflict-affected states + Ogun (non-conflict comparison)" },
 { text:"Stratified multi-stage cluster design; 572 communities" },
 { text:"Community and displacement-camp settings" },
]);

// 7 Methods: measures & model
s = base("Outcomes: probable PTSD, PCL-5 at 38 and above; depression, PHQ-9 at 10; anxiety, GAD-7 at 10 — instruments validated in this population in our first study. Exposure: count of traumatic event types, zero to twelve, modeled as a restricted cubic spline so the shape of any saturation is estimated, not imposed by categories. Stressors: a 0-to-10 count of socioeconomic challenges. Poisson models give prevalence ratios; adjusted for age, gender, education, state; variances account for the cluster design. The test is the trauma-by-stressor interaction. We also estimate absolute prevalence differences, because targeting claims live on the absolute scale.");
title(s, "Measures and model");
body(s, [
 { text:"PCL-5 ≥ 38  ·  PHQ-9 ≥ 10  ·  GAD-7 ≥ 10 (locally validated)" },
 { text:"Trauma: 0–12 event types, restricted cubic spline" },
 { text:"Stressors: socioeconomic challenge count (0–10)" },
 { text:"Poisson prevalence ratios; adjusted; design-based variances" },
 { text:"Test: trauma × stressor interaction, both scales" },
], { size:18 });

// 8 Divider
divider(2, "Results in three steps: the gradient, the picture, the absolute numbers.");

// 9 Results: IRR table
s = base("Read one row aloud. Among adults with no trauma exposure, each additional stressor nearly doubles PTSD prevalence — IRR 1.97. Among adults with five or more event types, nothing — a null. Depression and anxiety do the same. The interaction is below 0.0001 for all three outcomes. The red row is the finding: stress sensitivity is concentrated where trauma exposure is lowest.");
title(s, "Per-stressor prevalence ratio, by trauma exposure");
{
 const rows = [
  [{text:"Trauma"},{text:"PTSD"},{text:"Depression"},{text:"Anxiety"}],
  [{text:"0 events"},{text:"1.97 (1.53–2.54)"},{text:"1.83 (1.46–2.30)"},{text:"1.71 (1.35–2.17)"}],
  [{text:"1–2"},{text:"1.26"},{text:"1.27"},{text:"1.15"}],
  [{text:"3–4"},{text:"1.03"},{text:"0.95"},{text:"0.86"}],
  [{text:"5+"},{text:"0.92 (0.83–1.03)"},{text:"0.99"},{text:"1.03"}],
  [{text:"Interaction p"},{text:"<0.0001"},{text:"<0.0001"},{text:"<0.0001"}],
 ].map((r,ri)=>r.map(c=>({ text:c.text, options:{ fontFace:F, fontSize:15, color: ri===1?RED:BLK, align: "left", valign:"middle" }})));
 s.addTable(rows, { x:0.6, y:1.5, w:8.8, colW:[2.0,2.4,2.2,2.2], border:{type:"none"}, rowH:0.45 });
}

// 10 Chart
s = base("The same result as a picture. Each line is a trauma level; the horizontal axis is the stressor count; the vertical axis is adjusted PTSD prevalence. The red line — no trauma exposure — climbs from 7 percent to 28 percent and keeps going. The five-event line starts near 40 percent and does not move. The gradient belongs to the unexposed; the burden belongs to the exposed.");
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

// 11 Absolute scale
s = base("Why this matters for programming: the absolute scale. Going from zero to four stressors adds 22 percentage points of PTSD prevalence among adults with no trauma exposure — from 7 to 28 percent. The same contrast among adults with five event types adds nothing, minus two and a half points with a confidence interval straddling zero, against a baseline near 40 percent. Depression: plus 24 versus plus 4. Anxiety: plus 18 versus minus 4. All three nulls at high exposure.");
title(s, "Four additional stressors, in percentage points");
s.addText([{ text:"+21.8", options:{ color:RED }}], { x:1.2, y:1.7, w:3.4, h:1.2, fontFace:F, fontSize:60, isTextBox:true, margin:0, align:"center" });
s.addText("no trauma exposure\n(95% CI 7.2–36.5)", { x:1.2, y:2.9, w:3.4, h:0.8, fontFace:F, fontSize:14, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("−2.5", { x:5.4, y:1.7, w:3.4, h:1.2, fontFace:F, fontSize:60, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("five or more events\n(95% CI −18.3 to +13.4)", { x:5.4, y:2.9, w:3.4, h:0.8, fontFace:F, fontSize:14, color:BLK, isTextBox:true, margin:0, align:"center" });
s.addText("Depression: +24.1 vs +3.5   ·   Anxiety: +17.8 vs −4.0", { x:0.6, y:4.2, w:8.8, h:0.5, fontFace:F, fontSize:16, color:BLK, isTextBox:true, margin:0, align:"center" });

// 12 Robustness
s = base("The result is not an artifact of any cutoff. PCL-5 at 33, PHQ-9 at 15, GAD-7 at 7, and the continuous symptom scores all show the interaction at p of 0.0002 or below. The categorical specification from earlier versions of this work agrees.");
title(s, "Robustness");
body(s, [
 { text:"Alternative thresholds (PCL-5≥33, PHQ-9≥15, GAD-7≥7): all p≤0.0002" },
 { text:"Continuous symptom scores: all p≤0.0001" },
 { text:"Categorical trauma specification: same pattern" },
]);

// 13 Big statement
s = base("The finding in one line. Pause on this slide.");
big(s, "The stress gradient lives among the least trauma-exposed.");

// 14 Divider
divider(3, "What this means, and what it cannot mean.");

// 15 Discussion
s = base("Implication: universal psychosocial programming aims stress reduction at people whose symptoms no longer track stress. Match the intervention to trauma history — stress-focused support where sensitivity is retained, trauma-focused therapies where exposure is extensive. Limits, stated plainly: cross-sectional data, so 'saturation' describes an association pattern, not a mechanism; recall of both events and stressors; few respondents above six events, so the extreme tail is unstable; and this is prevalence, not incidence.");
title(s, "What this means");
body(s, [
 { text:"Match intervention to trauma history, not one program for all" },
 { text:"Stress-focused support where sensitivity is retained" },
 { text:"Trauma-focused therapies where exposure is extensive" },
 { text:"Limits: cross-sectional; recall; sparse data above six events", gap:false },
]);

// 16 Close
s = base("Thank collaborators and the field teams in the five states and Ogun. Invite questions.");
s.addText("abbaaji@wustl.edu", { x:0.8, y:2.5, w:8.4, h:0.6, fontFace:F, fontSize:22, color:BLK, isTextBox:true, margin:0, align:"center" });

p.writeFile({ fileName:"istss_trauma_saturation.pptx" }).then(()=>console.log("done"));
