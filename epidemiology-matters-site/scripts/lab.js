/* =====================================================
   Causal Thinking Lab — full simulator
   Simulates a data-generating process and computes
   crude and Mantel-Haenszel-adjusted risk ratios.
   ===================================================== */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function logistic(x) { return 1 / (1 + Math.exp(-x)); }

  // Slider definitions
  var SLIDERS = [
    { id: 'n', label: 'Sample size', min: 100, max: 2000, step: 100, def: 400, fmt: 'int' },
    { id: 'baseRisk', label: 'Baseline risk', min: 0.01, max: 0.50, step: 0.01, def: 0.10, fmt: 'pct' },
    { divider: 'EXPOSURE' },
    { id: 'expPrev', label: 'Prevalence', min: 0.10, max: 0.90, step: 0.01, def: 0.50, fmt: 'pct' },
    { id: 'trueRR', label: 'True causal RR', min: 0.3, max: 5.0, step: 0.1, def: 2.0, fmt: 'rr' },
    { divider: 'CONFOUNDER' },
    { id: 'confPrev', label: 'Prevalence', min: 0.0, max: 0.80, step: 0.01, def: 0.30, fmt: 'pct' },
    { id: 'confToExp', label: 'Strength → Exposure', min: 0, max: 1.5, step: 0.05, def: 0.0, fmt: 'dec2' },
    { id: 'confToOut', label: 'Strength → Outcome', min: 0, max: 2.0, step: 0.05, def: 0.0, fmt: 'dec2' },
    { divider: 'BIAS SOURCES' },
    { id: 'expMeasError', label: 'Meas. error (exposure)', min: 0, max: 1, step: 0.05, def: 0, fmt: 'pctnone' },
    { id: 'outMeasError', label: 'Meas. error (outcome)', min: 0, max: 1, step: 0.05, def: 0, fmt: 'pctnone' },
    { id: 'selectionBias', label: 'Selection bias', min: 0, max: 1, step: 0.05, def: 0, fmt: 'pctnone' }
  ];

  var PRESETS = {
    clean:       { baseRisk: 0.10, expPrev: 0.50, trueRR: 2.0, confPrev: 0.30, confToExp: 0,    confToOut: 0,   expMeasError: 0,   outMeasError: 0,   selectionBias: 0 },
    confounding: { baseRisk: 0.08, expPrev: 0.40, trueRR: 1.0, confPrev: 0.35, confToExp: 0.8,  confToOut: 0.9, expMeasError: 0,   outMeasError: 0,   selectionBias: 0 },
    simpson:     { baseRisk: 0.05, expPrev: 0.50, trueRR: 0.7, confPrev: 0.50, confToExp: 0.95, confToOut: 1.5, expMeasError: 0,   outMeasError: 0,   selectionBias: 0 },
    measurement: { baseRisk: 0.10, expPrev: 0.50, trueRR: 2.0, confPrev: 0.30, confToExp: 0,    confToOut: 0,   expMeasError: 0.7, outMeasError: 0.5, selectionBias: 0 },
    selection:   { baseRisk: 0.10, expPrev: 0.50, trueRR: 1.5, confPrev: 0.30, confToExp: 0,    confToOut: 0,   expMeasError: 0,   outMeasError: 0,   selectionBias: 0.8 }
  };

  var state = {};
  SLIDERS.forEach(function (s) { if (s.id) state[s.id] = s.def; });
  state.n = 400;
  state.plain = true;  // plain-language mode on by default

  var view = 'grid';
  var show22 = false;

  function fmtVal(s, v) {
    switch (s.fmt) {
      case 'int': return String(Math.round(v));
      case 'pct': return Math.round(v * 100) + '%';
      case 'rr': return v.toFixed(1);
      case 'dec2': return v.toFixed(2);
      case 'pctnone': return v === 0 ? 'None' : Math.round(v * 100) + '%';
    }
    return String(v);
  }

  // ---- Build controls ----
  var controlsEl = document.getElementById('controls');
  SLIDERS.forEach(function (s) {
    if (s.divider) {
      var d = document.createElement('div');
      d.className = 'ctrl-divider';
      d.textContent = s.divider;
      controlsEl.appendChild(d);
      return;
    }
    var row = document.createElement('div');
    row.className = 'slider-row';
    var lab = document.createElement('div');
    lab.className = 'slider-row__label';
    lab.innerHTML = '<span>' + s.label + '</span><span class="slider-row__val" id="val_' + s.id + '">' + fmtVal(s, s.def) + '</span>';
    var inp = document.createElement('input');
    inp.type = 'range'; inp.id = 'sl_' + s.id;
    inp.min = s.min; inp.max = s.max; inp.step = s.step; inp.value = s.def;
    inp.addEventListener('input', function () {
      state[s.id] = parseFloat(inp.value);
      document.getElementById('val_' + s.id).textContent = fmtVal(s, state[s.id]);
      clearActivePreset();
      run();
    });
    row.appendChild(lab); row.appendChild(inp);
    controlsEl.appendChild(row);
  });

  function syncControls() {
    SLIDERS.forEach(function (s) {
      if (!s.id) return;
      var inp = document.getElementById('sl_' + s.id);
      inp.value = state[s.id];
      document.getElementById('val_' + s.id).textContent = fmtVal(s, state[s.id]);
    });
  }

  // ---- Simulation ----
  // Returns array of {C, E (true), Eobs, D (true), Dobs, selected}
  function simulate() {
    var rng = mulberry32(20240558 + Math.round(state.expPrev * 100) + Math.round(state.confPrev * 100) * 7 +
      Math.round(state.confToExp * 100) * 13 + Math.round(state.confToOut * 100) * 17 +
      Math.round(state.trueRR * 10) * 19 + Math.round(state.baseRisk * 100) * 23 +
      Math.round(state.expMeasError * 100) * 29 + Math.round(state.outMeasError * 100) * 31 +
      Math.round(state.selectionBias * 100) * 37 + state.n * 41);
    var N = Math.round(state.n);
    var logRR = Math.log(state.trueRR);
    var people = [];
    for (var i = 0; i < N; i++) {
      var C = rng() < state.confPrev ? 1 : 0;
      // exposure: logistic on intercept tuned to expPrev + confToExp*C
      var expLogit = Math.log(state.expPrev / (1 - state.expPrev)) + state.confToExp * (C - state.confPrev);
      var E = rng() < logistic(expLogit) ? 1 : 0;
      // outcome: baseline + logRR*E + confToOut*C
      var b0 = Math.log(state.baseRisk / (1 - state.baseRisk));
      var pD = logistic(b0 + logRR * E + state.confToOut * C);
      var D = rng() < pD ? 1 : 0;
      // measurement error: flip observed exposure/outcome
      var Eobs = E;
      if (rng() < state.expMeasError) Eobs = 1 - E;
      var Dobs = D;
      if (rng() < state.outMeasError) Dobs = 1 - D;
      // selection: probability of being included depends on E and D (selection on collider)
      var selProb = 1;
      if (state.selectionBias > 0) {
        // exposed+diseased and unexposed+healthy over-selected
        var favored = (E === 1 && D === 1) || (E === 0 && D === 0);
        selProb = favored ? 1 : (1 - state.selectionBias);
      }
      var selected = rng() < selProb;
      people.push({ C: C, E: E, Eobs: Eobs, D: D, Dobs: Dobs, selected: selected });
    }
    return people;
  }

  function rr2x2(people, useObs) {
    var a = 0, b = 0, c = 0, d = 0; // a=Exp+Dis, b=Exp+Hlth, c=Unx+Dis, d=Unx+Hlth
    people.forEach(function (p) {
      if (!p.selected) return;
      var E = useObs ? p.Eobs : p.E;
      var D = useObs ? p.Dobs : p.D;
      if (E === 1 && D === 1) a++;
      else if (E === 1 && D === 0) b++;
      else if (E === 0 && D === 1) c++;
      else d++;
    });
    var riskE = (a + b) > 0 ? a / (a + b) : 0;
    var riskU = (c + d) > 0 ? c / (c + d) : 0;
    var rr = riskU > 0 ? riskE / riskU : (riskE > 0 ? Infinity : NaN);
    return { a: a, b: b, c: c, d: d, riskE: riskE, riskU: riskU, rr: rr, n: a + b + c + d };
  }

  // Mantel-Haenszel pooled RR across confounder strata
  function mhRR(people) {
    var strata = [0, 1];
    var num = 0, den = 0;
    strata.forEach(function (cv) {
      var sub = people.filter(function (p) { return p.selected && p.C === cv; });
      var a = 0, b = 0, c = 0, d = 0;
      sub.forEach(function (p) {
        if (p.Eobs === 1 && p.Dobs === 1) a++;
        else if (p.Eobs === 1 && p.Dobs === 0) b++;
        else if (p.Eobs === 0 && p.Dobs === 1) c++;
        else d++;
      });
      var n = a + b + c + d;
      if (n === 0) return;
      num += a * (c + d) / n;
      den += c * (a + b) / n;
    });
    return den > 0 ? num / den : NaN;
  }

  // ---- Rendering ----
  function svgPopGrid(people) {
    var shown = people.filter(function (p) { return p.selected; }).slice(0, 500);
    var cols = Math.ceil(Math.sqrt(shown.length * 1.6));
    var size = 9, gap = 3, step = size + gap;
    var rows = Math.ceil(shown.length / cols);
    var w = cols * step, h = rows * step;
    var svg = '<svg class="popdots" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">';
    shown.forEach(function (p, i) {
      var x = (i % cols) * step + size / 2;
      var y = Math.floor(i / cols) * step + size / 2;
      var fill = p.Dobs ? '#cb493c' : '#d9e0e6';
      var stroke = p.Eobs ? '#0a0a0a' : '#b8c2cc';
      svg += '<circle cx="' + x + '" cy="' + y + '" r="' + (size / 2 - 0.5) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>';
    });
    svg += '</svg>';
    return svg;
  }

  function svgStratified(people) {
    var present = people.filter(function (p) { return p.selected && p.C === 1; });
    var absent = people.filter(function (p) { return p.selected && p.C === 0; });
    function block(arr, title) {
      var shown = arr.slice(0, 250);
      var cols = Math.ceil(Math.sqrt(shown.length * 1.6)) || 1;
      var size = 8, gap = 3, step = size + gap;
      var rows = Math.ceil(shown.length / cols) || 1;
      var w = cols * step, h = rows * step;
      var s = '<div style="margin-bottom:var(--space-3);"><div style="font-family:var(--font-mono);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-mute);margin-bottom:6px;">' + title + ' (n=' + arr.length + ')</div>';
      s += '<svg class="popdots" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">';
      shown.forEach(function (p, i) {
        var x = (i % cols) * step + size / 2;
        var y = Math.floor(i / cols) * step + size / 2;
        var fill = p.Dobs ? '#cb493c' : '#d9e0e6';
        var stroke = p.Eobs ? '#0a0a0a' : '#b8c2cc';
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + (size / 2 - 0.5) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>';
      });
      s += '</svg></div>';
      return s;
    }
    return block(present, 'Confounder Present') + block(absent, 'Confounder Absent');
  }

  function svgDAG() {
    var ceW = Math.max(1, state.confToExp / 1.5 * 5);
    var coW = Math.max(1, state.confToOut / 2.0 * 5);
    var edW = Math.max(1, Math.abs(state.trueRR - 1) / 4 * 5);
    return '' +
      '<svg viewBox="0 0 360 240" style="width:100%;max-width:420px;height:auto;display:block;margin:0 auto;" font-family="var(--font-sub)">' +
      '<defs>' +
      '<marker id="ag" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#b8c2cc"/></marker>' +
      '<marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#cb493c"/></marker>' +
      '</defs>' +
      // edges
      '<line x1="160" y1="56" x2="70" y2="150" stroke="#b8c2cc" stroke-width="' + ceW + '" marker-end="url(#ag)"/>' +
      '<line x1="200" y1="56" x2="290" y2="150" stroke="#b8c2cc" stroke-width="' + coW + '" marker-end="url(#ag)"/>' +
      '<line x1="105" y1="180" x2="255" y2="180" stroke="#cb493c" stroke-width="' + edW + '" marker-end="url(#ar)"/>' +
      // nodes
      '<rect x="135" y="20" width="90" height="36" fill="#fafbfc" stroke="#b8c2cc"/><text x="180" y="43" text-anchor="middle" font-size="13" fill="#0a0a0a">Confounder</text>' +
      '<rect x="40" y="166" width="80" height="36" fill="#fafbfc" stroke="#cb493c"/><text x="80" y="189" text-anchor="middle" font-size="13" fill="#0a0a0a">Exposure</text>' +
      '<rect x="240" y="166" width="80" height="36" fill="#fafbfc" stroke="#cb493c"/><text x="280" y="189" text-anchor="middle" font-size="13" fill="#0a0a0a">Disease</text>' +
      '</svg>';
  }

  function interpret(crude, adj, trueRR) {
    return state.plain
      ? interpretPlain(crude, adj, trueRR)
      : interpretTech(crude, adj, trueRR);
  }

  function interpretTech(crude, adj, trueRR) {
    var biasMag = Math.abs(crude - adj);
    var crudeS = isFinite(crude) ? crude.toFixed(2) : '—';
    var anyBias = state.confToExp > 0 || state.confToOut > 0 || state.expMeasError > 0 || state.outMeasError > 0 || state.selectionBias > 0;
    if (!anyBias) {
      var ratioT = crude / trueRR;
      if (isFinite(crude) && ratioT > 0.85 && ratioT < 1.18) {
        return 'The crude estimate is ' + crudeS + ', close to the true causal RR of ' + trueRR.toFixed(2) + '. No bias source is active; the remaining gap is sampling variability.';
      }
      return 'The crude estimate is ' + crudeS + ', while the true causal RR is ' + trueRR.toFixed(2) + '. No bias source is active, so the gap is sampling variability alone: a sample of ' + Math.round(state.n) + ' can land this far from the truth by chance. Increase the sample size and the estimate settles near the true value.';
    }
    var dom = '';
    if (state.confToExp > 0 && state.confToOut > 0) dom = 'confounding';
    else if (state.expMeasError > 0 || state.outMeasError > 0) dom = 'measurement';
    else if (state.selectionBias > 0) dom = 'selection';
    if (dom === 'confounding') {
      return 'The crude estimate is ' + crudeS + ', but the true causal RR is ' + trueRR.toFixed(2) + '. The confounder affects both exposure and outcome, distorting the crude association. Stratifying on the confounder yields an adjusted RR of ' + (isFinite(adj) ? adj.toFixed(2) : '—') + ', closer to the truth.';
    }
    if (dom === 'measurement') {
      return 'Measurement error pulls the crude estimate (' + crudeS + ') toward the null relative to the true causal RR of ' + trueRR.toFixed(2) + '. Misclassification of exposure or outcome attenuates the observed association.';
    }
    if (dom === 'selection') {
      return 'Selection bias distorts the crude estimate (' + crudeS + ') because inclusion in the analysis depends on both exposure and outcome. The observed association no longer reflects the true causal RR of ' + trueRR.toFixed(2) + '.';
    }
    return 'The crude estimate is ' + crudeS + '. Adjustment changes the estimate by ' + biasMag.toFixed(2) + '.';
  }

  function xTimes(v) {
    if (!isFinite(v)) return '—';
    if (v >= 1) return v.toFixed(1) + '×';
    return v.toFixed(2) + '× (i.e. lower)';
  }

  function interpretPlain(crude, adj, trueRR) {
    var c = xTimes(crude);
    var a = xTimes(adj);
    var t = xTimes(trueRR);
    var anyBias = state.confToExp > 0 || state.confToOut > 0 || state.expMeasError > 0 || state.outMeasError > 0 || state.selectionBias > 0;
    if (!anyBias) {
      var ratioP = crude / trueRR;
      if (isFinite(crude) && ratioP > 0.85 && ratioP < 1.18) {
        return 'Nothing is distorting this picture. Exposed people have about <strong>' + c + '</strong> the risk, close to the real effect of <strong>' + t + '</strong>. The small gap is chance.';
      }
      return 'Nothing is distorting this picture, yet the number still misses: you see <strong>' + c + '</strong> while the real effect is <strong>' + t + '</strong>. That gap is the luck of the draw in a sample of ' + Math.round(state.n) + ' people. Raise the sample size and watch the estimate settle toward the truth.';
    }
    var dom = '';
    if (state.confToExp > 0 && state.confToOut > 0) dom = 'confounding';
    else if (state.expMeasError > 0 || state.outMeasError > 0) dom = 'measurement';
    else if (state.selectionBias > 0) dom = 'selection';
    if (dom === 'confounding') {
      return 'The first number misleads. At a glance the risk looks like <strong>' + c + '</strong>, but the real effect is <strong>' + t + '</strong>. A hidden third factor nudges both who gets exposed and who gets sick. Compare like with like and the estimate settles to about <strong>' + a + '</strong>, much closer to the truth.';
    }
    if (dom === 'measurement') {
      return 'Mismeasurement is hiding the effect. The true effect is about <strong>' + t + '</strong>, but mislabelling who is exposed or who is sick drags the number you see (<strong>' + c + '</strong>) toward no effect. Better measurement would show a stronger signal.';
    }
    if (dom === 'selection') {
      return 'We are only looking at a skewed slice of people, and that alone bends the answer. The real effect is <strong>' + t + '</strong>, but who ends up in the study depends on both exposure and health, so the <strong>' + c + '</strong> we observe reflects who we let in rather than what the exposure does.';
    }
    return 'Adjusting for the other factors shifts the answer from <strong>' + c + '</strong> to <strong>' + a + '</strong>.';
  }

  function run() {
    var people = simulate();
    var crude = rr2x2(people, true);
    var adj = mhRR(people);
    document.getElementById('crudeRR').textContent = isFinite(crude.rr) ? crude.rr.toFixed(2) : '—';
    document.getElementById('adjRR').textContent = isFinite(adj) ? adj.toFixed(2) : '—';
    document.getElementById('trueRRDisplay').textContent = state.trueRR.toFixed(2);

    // bias alert
    var biasEl = document.getElementById('biasAlert');
    if (isFinite(crude.rr) && isFinite(adj) && Math.abs(crude.rr - adj) > 0.1) {
      var diff = crude.rr - adj;
      var msg = state.plain
        ? 'The first number is misleading'
        : 'Bias detected: ' + (diff >= 0 ? '+' : '') + diff.toFixed(2);
      biasEl.innerHTML = '<div class="bias-alert">' + msg + '</div>';
    } else {
      biasEl.innerHTML = '';
    }

    // detail stats
    document.getElementById('detailStats').innerHTML =
      '<div class="row"><span>Risk (Exposed)</span><span>' + (crude.riskE * 100).toFixed(1) + '%</span></div>' +
      '<div class="row"><span>Risk (Unexposed)</span><span>' + (crude.riskU * 100).toFixed(1) + '%</span></div>' +
      '<div class="row"><span>Risk Difference</span><span>' + ((crude.riskE - crude.riskU) * 100).toFixed(1) + '%</span></div>' +
      '<div class="row"><span>n (selected)</span><span>' + crude.n + '</span></div>';

    // 2x2 table
    document.getElementById('table22').innerHTML =
      '<table class="twobytwo"><tr><th></th><th>Disease</th><th>Healthy</th></tr>' +
      '<tr><th>Exposed</th><td>' + crude.a + '</td><td>' + crude.b + '</td></tr>' +
      '<tr><th>Unexposed</th><td>' + crude.c + '</td><td>' + crude.d + '</td></tr></table>';

    // interpretation
    document.getElementById('labInterp').innerHTML = interpret(crude.rr, adj, state.trueRR);

    // viz
    var vizArea = document.getElementById('vizArea');
    if (view === 'grid') vizArea.innerHTML = svgPopGrid(people);
    else if (view === 'stratified') vizArea.innerHTML = svgStratified(people);
    else vizArea.innerHTML = svgDAG();
  }

  // ---- Tabs ----
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      view = btn.dataset.view;
      run();
    });
  });

  // ---- 2x2 toggle ----
  var toggleBtn = document.getElementById('toggle22');
  toggleBtn.addEventListener('click', function () {
    show22 = !show22;
    document.getElementById('table22').style.display = show22 ? 'block' : 'none';
    toggleBtn.textContent = show22 ? 'Hide 2×2 table' : 'Show 2×2 table';
  });

  // ---- Presets ----
  function clearActivePreset() {
    document.querySelectorAll('.preset-btn').forEach(function (b) { b.classList.remove('active'); });
  }
  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = PRESETS[btn.dataset.preset];
      Object.keys(p).forEach(function (k) { state[k] = p[k]; });
      clearActivePreset();
      btn.classList.add('active');
      syncControls();
      run();
    });
  });

  // ---- Plain-language / technical mode ----
  var LABELS = {
    plain: {
      crude: 'What you see', adj: 'Compared fairly', trueRR: 'The real answer',
      panel: 'Set up the town', estimates: 'The verdict'
    },
    tech: {
      crude: 'Crude RR', adj: 'Adjusted RR', trueRR: 'True Causal RR',
      panel: 'Build the World', estimates: 'Estimates'
    }
  };
  function applyModeLabels() {
    var L = state.plain ? LABELS.plain : LABELS.tech;
    var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
    set('crudeRRLabel', L.crude);
    set('adjRRLabel', L.adj);
    set('trueRRLabel', L.trueRR);
    var lp = document.querySelector('#leftPanel .lab-panel__label');
    if (lp) lp.textContent = L.panel;
    var rp = document.querySelector('#rightPanel .lab-panel__label');
    if (rp) rp.textContent = L.estimates;
  }
  (function wireMode() {
    var mp = document.getElementById('modePlain');
    var mt = document.getElementById('modeTech');
    var hint = document.getElementById('modeHint');
    if (!mp || !mt) return;
    function setMode(plain) {
      state.plain = plain;
      mp.classList.toggle('is-active', plain);
      mt.classList.toggle('is-active', !plain);
      mp.setAttribute('aria-pressed', String(plain));
      mt.setAttribute('aria-pressed', String(!plain));
      if (hint) hint.textContent = plain
        ? 'Jargon-free. Flip to Technical for the epidemiology terms.'
        : 'Full epidemiology terms: risk ratios, confounding, Mantel–Haenszel adjustment.';
      applyModeLabels();
      run();
    }
    mp.addEventListener('click', function () { setMode(true); });
    mt.addEventListener('click', function () { setMode(false); });
  })();

  // init
  applyModeLabels();
  syncControls();
  run();
})();
