const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in

const F = "Avenir Book";
const BLACK = "000000", RED = "FF0000", GRAY = "898989", DIM = "D9D9D9";
const W = 10, H = 5.625;

function notes(slide, t) { slide.addNotes(t); }

function titleSlide() {
  const s = pres.addSlide();
  s.addText("Epidemiology Matters", { x: 0.8, y: 1.7, w: 8.4, h: 0.7, fontFace: F, fontSize: 34, color: BLACK, isTextBox: true, margin: 0 });
  s.addText("Lecture 1  ·  A pattern in a population", { x: 0.8, y: 2.45, w: 8.4, h: 0.5, fontFace: F, fontSize: 20, color: BLACK, isTextBox: true, margin: 0 });
  s.addText("Mohammed Abba-Aji", { x: 0.8, y: 3.4, w: 8.4, h: 0.4, fontFace: F, fontSize: 16, color: GRAY, isTextBox: true, margin: 0 });
  s.addText("Washington University in St. Louis  ·  School of Public Health", { x: 0.8, y: 3.8, w: 8.4, h: 0.4, fontFace: F, fontSize: 13, color: GRAY, isTextBox: true, margin: 0 });
  notes(s, "Welcome. Names, course number on the board. This course has one running example: a town called Farrlandia. By the end of today you will have caught your first spurious finding.");
}

function bigStatement(text, note, size) {
  const s = pres.addSlide();
  s.addText(text, { x: 0.9, y: 0, w: 8.2, h: H, fontFace: F, fontSize: size || 27, color: BLACK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  if (note) notes(s, note);
  return s;
}

const SECTIONS = ["1.  A puzzle", "2.  What epidemiology is", "3.  The seven steps", "4.  This course"];
function divider(current, note) {
  const s = pres.addSlide();
  const rows = SECTIONS.map((t, i) => ({
    text: t + (i < SECTIONS.length - 1 ? "\n" : ""),
    options: { color: i === current ? RED : BLACK, breakLine: true },
  }));
  s.addText(rows, { x: 3.0, y: 1.5, w: 5.0, h: 2.8, fontFace: F, fontSize: 20, isTextBox: true, margin: 0, lineSpacing: 40 });
  if (note) notes(s, note);
}

function content(title, lines, note, opts) {
  const s = pres.addSlide();
  const o = opts || {};
  s.addText(title, { x: 0.8, y: 0.55, w: 8.4, h: 0.6, fontFace: F, fontSize: 24, color: BLACK, isTextBox: true, margin: 0 });
  const runs = [];
  lines.forEach(function (ln, i) {
    if (typeof ln === "string") runs.push({ text: ln, options: { color: BLACK, breakLine: true } });
    else runs.push({ text: ln.t, options: { color: ln.red ? RED : (ln.dim ? DIM : BLACK), breakLine: true } });
  });
  s.addText(runs, { x: 0.8, y: o.bodyY || 1.6, w: 8.4, h: 3.4, fontFace: F, fontSize: o.size || 17, isTextBox: true, margin: 0, lineSpacing: o.ls || 30 });
  if (note) notes(s, note);
  return s;
}

function table2x2(title, cells, red, sub, note) {
  // cells: [[a,b],[c,d]] strings; red: matching booleans
  const s = pres.addSlide();
  s.addText(title, { x: 0.8, y: 0.55, w: 8.4, h: 0.6, fontFace: F, fontSize: 24, color: BLACK, isTextBox: true, margin: 0 });
  const border = { pt: 0.75, color: BLACK };
  const rows = [
    [
      { text: "", options: { border: [null, null, border, null] } },
      { text: "Heart attack", options: { bold: false, align: "center", border: [null, null, border, null] } },
      { text: "No heart attack", options: { align: "center", border: [null, null, border, null] } },
      { text: "Risk", options: { align: "center", border: [null, null, border, null] } },
    ],
    [
      { text: "Heavy coffee", options: {} },
      { text: cells[0][0], options: { align: "center", color: red ? RED : DIM } },
      { text: cells[0][1], options: { align: "center", color: red ? RED : DIM } },
      { text: cells[0][2], options: { align: "center", color: red ? RED : DIM } },
    ],
    [
      { text: "Little or none", options: {} },
      { text: cells[1][0], options: { align: "center", color: red ? RED : DIM } },
      { text: cells[1][1], options: { align: "center", color: red ? RED : DIM } },
      { text: cells[1][2], options: { align: "center", color: red ? RED : DIM } },
    ],
  ];
  s.addTable(rows, { x: 1.2, y: 1.7, w: 7.6, rowH: 0.55, fontFace: F, fontSize: 16, color: BLACK, valign: "middle", border: { pt: 0.5, color: "BBBBBB" } });
  if (sub) s.addText(sub.map(x => (typeof x === "string" ? { text: x, options: { color: BLACK, breakLine: true } } : { text: x.t, options: { color: x.red ? RED : BLACK, breakLine: true } })),
    { x: 1.2, y: 3.8, w: 7.6, h: 1.1, fontFace: F, fontSize: 16, isTextBox: true, margin: 0, lineSpacing: 27 });
  if (note) notes(s, note);
}

// ============ DECK ============
titleSlide();

bigStatement("Almost everything you believe about your health\nbegan as a pattern in a population.",
  "Let this sit. Coffee, drugs, air, vaccines: every health claim they trust arrived through somebody comparing groups of people. This course is about how that comparing is done well, and how it goes wrong.");

divider(0, "Four parts today. We start with a puzzle, not a definition.");

content("A question", [
  "Does drinking coffee cause heart attacks?",
  "",
  "You have seen the headlines in both directions.",
  "How would you actually find out?",
], "Take answers for two minutes. Someone will say experiment; hold that thought for week 8. Someone will say ask doctors; push on why that fails.");

content("240 people in Farrlandia", [
  "We followed 240 adults in an imagined town.",
  "For each: coffee habit, and whether they had a heart attack.",
  "",
  "epidemiologymatters.com  →  the opening story",
], "LIVE DEMO, about eight minutes. Open the site, play the coffee story to the first reveal only. Stop before the smoking split. Come back to slides.", { size: 17 });

table2x2("What we counted", [["?", "?", "?"], ["?", "?", "?"]], false, null,
  "The scaffold first. Ask: what four numbers do we need? Students name the cells before seeing them.");

table2x2("What we counted", [["35", "81", "30.2%"], ["11", "113", "8.9%"]], true,
  [{ t: "Risk ratio: 30.2 / 8.9  =  3.4", red: true }],
  "The same table, filled. Coffee drinkers had 3.4 times the risk. Pause. Ask the room: do we warn the public?");

content("One more question", [
  "Who drinks heavy coffee?",
  "",
  "In Farrlandia, a third of adults smoke.",
  "Smokers drink heavy coffee at 78%; non-smokers at 25%.",
  "Smoking, not coffee, drives heart attacks.",
], "Do not reveal the next table yet. Ask what they now suspect will happen if we look at smokers and non-smokers separately.");

content("Split the population", [
  { t: "Among smokers:        risk ratio  ?", dim: true },
  { t: "Among non-smokers:  risk ratio  ?", dim: true },
], "Scaffold again. Predictions first, out loud.", { size: 19, ls: 40, bodyY: 2.2 });

content("Split the population", [
  { t: "Among smokers:        risk ratio  1.3", red: true },
  { t: "Among non-smokers:  risk ratio  1.1", red: true },
], "The 3.4 is nearly gone in both groups. Same people, same counts, one extra question.", { size: 19, ls: 40, bodyY: 2.2 });

content("The 3.4 was never coffee", [
  "Smoking raised both coffee drinking and heart attacks.",
  "Compare like with like and the signal nearly vanishes.",
  "",
  "This has a name: confounding.",
  "We meet it properly in week ten.",
], "One extra question dissolved a finding that looked publishable. Everything in this course is machinery for asking that extra question on purpose rather than by luck.");

bigStatement("Epidemiology is the science of fair comparison.",
  "Our working definition for the semester. The formal one comes next.");

divider(1, "Part two. Now the definition can land, because they have seen the thing defined.");

content("What epidemiology is", [
  "The study of the distribution and determinants of",
  "health and disease in populations,",
  "and the application of what we learn.",
  "",
  "Distribution: who, where, when.",
  "Determinants: why.",
], "Standard definition, unpacked. Application is in the definition on purpose; this is the book's argument about consequence.");

content("Populations, not patients", [
  "The clinician asks: what is wrong with this person?",
  "The epidemiologist asks: why does this population",
  "have this pattern?",
  "",
  "Both questions matter. This course trains the second.",
], "For students from clinical backgrounds this is the reorientation. My own path ran through an HIV treatment centre before population work; one patient at a time was never going to explain the pattern in the queue outside.");

bigStatement("“The death rate is a fact; anything beyond this is an inference.”\n— William Farr, 1807–1883", 
  "Farr built vital statistics. Our town is named for him. The quote is the course in one line: counts are facts, and everything else we say is inference that can be done carefully or carelessly.", 23);

content("Inference is the job", [
  "Counts are facts.",
  "Risk ratios, causes, and forecasts are inferences.",
  "",
  "Inference fails in predictable ways.",
  "You watched one failure today. There is a catalogue.",
], "Preview the catalogue without naming it all: confounding, selection, measurement, chance. Each gets its weeks.");

divider(2, "Part three: the framework the whole book hangs on.");

content("Seven steps", [
  "1.  Define the population",
  "2.  Measure exposures and outcomes",
  "3.  Take a sample",
  "4.  Estimate associations",
  "5.  Evaluate causality",
  "6.  Assess interaction",
  "7.  Assess external validity",
], "Read all seven aloud, slowly. This list returns at the start of every lecture with our position marked in red.", { size: 16, ls: 27 });

content("Steps one to three", [
  "Define who counts, before anything else.",
  "Decide what to measure, and accept what that choice hides.",
  "Study a sample; claim it speaks for the population.",
  "",
  "Weeks two to five.",
], "Each line is a decision that can quietly wreck a study. Measurement's hidden politics is the Consequence Box thread.");

content("Steps four and five", [
  "Estimate the association between exposure and outcome.",
  "Then earn the causal claim, or decline to make it.",
  "",
  "Weeks six to ten.",
], "The coffee example lives here: we estimated 3.4 and the causal claim collapsed.");

content("Steps six and seven", [
  "Causes work together; measure how.",
  "Ask where else the answer travels.",
  "",
  "Weeks eleven to thirteen.",
], "Interaction and external validity, the two steps most curricula squeeze out. The book gives them full chapters and so do we.");

bigStatement("Every study you will read this semester\nmade these seven decisions.",
  "Reading papers becomes auditing decisions. That is the skill on the final.");

divider(3, "Last part: how the course runs.");

content("This course", [
  "Two sessions each week, 80 minutes each:",
  "lecture, then lab.",
  "",
  "Text: Epidemiology Matters, second edition.",
  "Tools: epidemiologymatters.com, free.",
], "Lab sessions are hands-on in the Farrlandia data. Laptops required Thursdays.");

content("Farrlandia", [
  "One imagined town of 10,000 residents.",
  "A census you can download: 30 variables, every method",
  "in the course testable against it.",
  "",
  "The coffee finding you dismantled today lives there too.",
], "Sell the payoff plainly: in real data you never know the answer; in Farrlandia you can check yours. The colliery, the clinic, and the closed factory are waiting in later weeks.");

content("What you will do", [
  "Read the assigned chapter before lecture.",
  "Analyze the census in lab:  [R / Stata — confirm software].",
  "Build one study across the semester, step by step.",
  "Exams:  [midterm and final — confirm format].",
], "Placeholders in brackets are for your syllabus decisions; fill before class.", { size: 16 });

content("Assessment", [
  "Lab analyses:            [ __ % ]",
  "Study design project:  [ __ % ]",
  "Midterm:                    [ __ % ]",
  "Final:                          [ __ % ]",
], "Fill from the syllabus. Grad section: the project plus two lab analyses are the D2 competency-one evidence.", { size: 17, ls: 32 });

content("Before Thursday", [
  "Play the coffee story yourself, to the end.",
  "Download the Farrlandia census.",
  "Read chapter one.",
  "[Software installation instructions — confirm]",
], "Thursday is the first lab: loading the census, computing a prevalence by hand and by software.");

const closing = pres.addSlide();
closing.addText("epidemiologymatters.com", { x: 0, y: 0, w: W, h: H, fontFace: F, fontSize: 22, color: BLACK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
notes(closing, "End on the site. Nothing else on this slide by design.");

pres.writeFile({ fileName: "EM-Lecture-01-A-Pattern-in-a-Population.pptx" }).then(() => console.log("written"));
