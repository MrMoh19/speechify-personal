// Tuning harness for the Farrlandia data-generating process.
// Goal prevalences (seed 42, N=1000):
//   CVD 6.8%, Depression 10.8%, Lung Cancer 3.9%, Any Disease 19.3%
//   Smoking 26.0%, Air Poll 39.6%, Poor Diet 34.6%, Isolated 19.9%

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function logistic(x) { return 1 / (1 + Math.exp(-x)); }

const DISTRICTS = ["", "Snow", "Nightingale", "Hill", "Doll", "Rose"];

function generate() {
  const rng = mulberry32(42);
  const rows = [];
  for (let i = 0; i < 1000; i++) {
    const id = 1000 + Math.floor(rng() * 9000);
    const age = 18 + Math.floor(rng() * 62); // 18..79
    const sex = rng() < 0.51 ? 1 : 0; // 1=Female
    const dist = 1 + Math.floor(rng() * 5);
    // SES 1..5, district influences a bit
    let sesRaw = rng() + (dist === 4 || dist === 5 ? 0.18 : 0) - (dist === 1 ? 0.12 : 0);
    let ses = Math.max(1, Math.min(5, Math.round(1 + sesRaw * 4)));
    const lowSES = ses <= 2;

    // Exposures (logistic on SES / age)
    const smoking = rng() < logistic(-1.15 + (lowSES ? 0.7 : 0) - (ses >= 4 ? 0.5 : 0) + (age > 45 ? 0.2 : 0)) ? 1 : 0;
    const poll = rng() < logistic(-0.82 + (dist === 1 || dist === 3 ? 0.6 : 0) + (lowSES ? 0.4 : 0)) ? 1 : 0;
    const diet = rng() < logistic(-0.75 + (lowSES ? 0.7 : 0) - (ses >= 4 ? 0.3 : 0)) ? 1 : 0;
    const inact = rng() < logistic(-0.6 + (lowSES ? 0.5 : 0) + (age > 55 ? 0.4 : 0)) ? 1 : 0;
    const alc = rng() < logistic(-1.5 + (sex === 0 ? 0.4 : 0) + (age < 40 ? 0.3 : 0)) ? 1 : 0;
    const iso = rng() < logistic(-1.65 + (lowSES ? 0.5 : 0) + (age > 65 ? 0.6 : 0)) ? 1 : 0;

    // Outcomes
    // CVD: smoking, pollution, age, diet, inactivity, low SES
    const cvdL = -4.25 + 0.9 * smoking + 0.6 * poll + 0.035 * (age - 40) + 0.5 * diet + 0.4 * inact + (lowSES ? 0.4 : 0);
    const cvd = rng() < logistic(cvdL) ? 1 : 0;
    // Depression: isolation, low SES, sex(female higher), alcohol, age(younger)
    const depL = -2.85 + 1.0 * iso + 0.5 * (lowSES ? 1 : 0) + 0.4 * sex + 0.3 * alc - 0.012 * (age - 40);
    const dep = rng() < logistic(depL) ? 1 : 0;
    // Lung cancer: smoking dominant, pollution, age
    const lcL = -5.15 + 2.2 * smoking + 0.5 * poll + 0.045 * (age - 40);
    const lc = rng() < logistic(lcL) ? 1 : 0;

    const py = +(rng() * 6 + 4).toFixed(1); // 4.0 .. 10.0

    rows.push([id, age, sex, dist, ses, smoking, poll, diet, inact, alc, iso, cvd, dep, lc, py]);
  }
  return rows;
}

const rows = generate();
const N = rows.length;
const sum = (idx) => rows.reduce((a, r) => a + r[idx], 0);
const pct = (idx) => (sum(idx) / N * 100).toFixed(1);
const anyDis = rows.filter(r => r[11] || r[12] || r[13]).length;

console.log("N", N);
console.log("CVD", pct(11), "(target 6.8)");
console.log("Depression", pct(12), "(target 10.8)");
console.log("Lung Cancer", pct(13), "(target 3.9)");
console.log("Any Disease", (anyDis / N * 100).toFixed(1), "(target 19.3)");
console.log("Smoking", pct(5), "(target 26.0)");
console.log("Air Poll", pct(6), "(target 39.6)");
console.log("Poor Diet", pct(7), "(target 34.6)");
console.log("Inact", pct(8));
console.log("Alcohol", pct(9));
console.log("Isolated", pct(10), "(target 19.9)");

// RR check: smoking -> lung cancer
function rr(expIdx, outIdx) {
  const e1 = rows.filter(r => r[expIdx] === 1);
  const e0 = rows.filter(r => r[expIdx] === 0);
  const r1 = e1.filter(r => r[outIdx] === 1).length / e1.length;
  const r0 = e0.filter(r => r[outIdx] === 1).length / e0.length;
  return (r1 / r0).toFixed(2);
}
console.log("RR smoking->LC", rr(5, 13));
console.log("RR smoking->CVD", rr(5, 11));
console.log("RR iso->dep", rr(10, 12));
