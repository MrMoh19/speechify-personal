/* =====================================================
   The Trial Grounds — in silico experiments on the census
   Experiment 1: a randomized cessation trial, checked against
   the exact causal answer under the census's data-generating
   process. Experiment 2: an epidemic on the published contact
   network, with the direct effect a trial measures set against
   the herd protection only the simulated town reveals.
   Everything runs in the browser from the published files:
   ../farrlandia/census/farrlandia-census.csv
   ../farrlandia/census/farrlandia-contacts.csv
   ===================================================== */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return n.toLocaleString('en-US'); }
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function logistic(x) { return 1 / (1 + Math.exp(-x)); }

  // ---- the CVD equation, ported from farrlandia_dgp.py ----
  var SBP_SMOKING_SHIFT = 3;
  function cvdProb(r, smoking) {
    var sbp = r.sbp + SBP_SMOKING_SHIFT * (smoking - r.smoking);
    var l = -4.35 + 0.75 * smoking + 0.4 * r.poll + 0.030 * (r.age - 40)
      + 0.35 * r.diet + 0.3 * r.inact + (r.ses <= 2 ? 0.35 : 0)
      + 0.45 * r.alc + (r.female ? 0 : 0.4)
      + 0.020 * (sbp - 120) + 0.03 * (r.bmi - 26.5) + 0.65 * r.famhx;
    return logistic(l);
  }

  // ---------- census loading ----------
  var CENSUS_URL = '../farrlandia/census/farrlandia-census.csv';
  var CONTACTS_URL = '../farrlandia/census/farrlandia-contacts.csv';
  var censusPromise = null;

  function loadCensus() {
    if (!censusPromise) {
      censusPromise = fetch(CENSUS_URL).then(function (r) {
        if (!r.ok) throw new Error('census fetch ' + r.status);
        return r.text();
      }).then(function (text) {
        var lines = text.trim().split(/\r?\n/);
        var head = lines[0].split(',');
        var col = {};
        head.forEach(function (h, i) { col[h] = i; });
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
          var f = lines[i].split(',');
          rows.push({
            id: +f[col.id],
            age: +f[col.age],
            female: f[col.sex] === 'female' ? 1 : 0,
            district: f[col.district],
            ses: +f[col.ses],
            smoking: +f[col.smoking],
            poll: +f[col.air_pollution],
            diet: +f[col.poor_diet],
            inact: +f[col.physical_inactivity],
            alc: +f[col.heavy_alcohol],
            sbp: +f[col.systolic_bp],
            bmi: +f[col.bmi],
            famhx: +f[col.family_history_cvd],
            cvd: +f[col.cvd],
          });
        }
        return rows;
      });
    }
    return censusPromise;
  }

  /* =====================================================
     Experiment 1 — randomized cessation trial
     ===================================================== */
  var A = {
    rows: null, smokers: null, pairs: null,
    crude: 0, truth: 0,
    estimates: [],
    rng: mulberry32(20280701),
  };

  function setupA(rows) {
    A.rows = rows;
    A.smokers = rows.filter(function (r) { return r.smoking === 1; });
    var non = rows.filter(function (r) { return r.smoking === 0; });
    var r1 = A.smokers.reduce(function (s, r) { return s + r.cvd; }, 0) / A.smokers.length;
    var r0 = non.reduce(function (s, r) { return s + r.cvd; }, 0) / non.length;
    A.crude = r1 / r0;
    A.pairs = A.smokers.map(function (r) { return [cvdProb(r, 1), cvdProb(r, 0)]; });
    var s1 = 0, s0 = 0;
    A.pairs.forEach(function (p) { s1 += p[0]; s0 += p[1]; });
    A.truth = s0 / s1;

    $('aSmokers').textContent = fmt(A.smokers.length);
    $('aCrude').textContent = A.crude.toFixed(2);
    $('aTruth').textContent = A.truth.toFixed(2);
    $('aIntro').innerHTML = 'The census, read as collected, says smokers carry <strong>'
      + A.crude.toFixed(2) + '&times;</strong> the heart-disease risk of non-smokers. '
      + 'The generator’s own equations say the true effect of quitting, for these '
      + fmt(A.smokers.length) + ' smokers, is a risk ratio of <strong>'
      + A.truth.toFixed(2) + '</strong>. Run the trial and watch which number the '
      + 'randomized design finds.';
    ['aRun1', 'aRun25', 'aRun100', 'aReset'].forEach(function (id) { $(id).disabled = false; });
    drawA();
  }

  function runTrialsA(k) {
    var n = A.smokers.length, half = n >> 1;
    for (var t = 0; t < k; t++) {
      var order = new Array(n);
      for (var i = 0; i < n; i++) order[i] = i;
      for (i = n - 1; i > 0; i--) {
        var j = Math.floor(A.rng() * (i + 1));
        var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
      }
      var a = 0, c = 0;
      for (i = 0; i < n; i++) {
        var p = A.pairs[order[i]];
        if (i < half) { if (A.rng() < p[1]) a++; }       // quits
        else { if (A.rng() < p[0]) c++; }                // keeps smoking
      }
      A.estimates.push((a / half) / (c / (n - half)));
    }
    drawA();
  }

  function drawA() {
    var W = 640, H = 190, padL = 16, padR = 16, top = 36, bot = 36;
    var lo = 0.25, hi = 4;
    function X(v) {
      v = Math.max(lo, Math.min(hi, v));
      return padL + (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * (W - padL - padR);
    }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tg-chart" role="img" aria-label="Trial estimates on a log risk-ratio axis">';
    // axis
    s += '<line x1="' + padL + '" y1="' + (H - bot) + '" x2="' + (W - padR) + '" y2="' + (H - bot) + '" stroke="#0a0a0a" stroke-width="1.2"/>';
    [0.25, 0.5, 1, 2, 4].forEach(function (v) {
      var x = X(v);
      s += '<line x1="' + x + '" y1="' + (H - bot) + '" x2="' + x + '" y2="' + (H - bot + 5) + '" stroke="#0a0a0a"/>' +
        '<text x="' + x + '" y="' + (H - bot + 18) + '" text-anchor="middle" class="tg-tick">' + v + '</text>';
    });
    s += '<text x="' + (W - padR) + '" y="' + (H - 6) + '" text-anchor="end" class="tg-tick">risk ratio, log scale</text>';
    // no-effect line
    s += '<line x1="' + X(1) + '" y1="' + top + '" x2="' + X(1) + '" y2="' + (H - bot) + '" stroke="#b8c2cc" stroke-dasharray="3 4"/>';
    if (A.pairs) {
      // truth line (the one red element)
      s += '<line x1="' + X(A.truth) + '" y1="' + (top - 14) + '" x2="' + X(A.truth) + '" y2="' + (H - bot) + '" stroke="#cb493c" stroke-width="1.6"/>' +
        '<text x="' + X(A.truth) + '" y="' + (top - 20) + '" text-anchor="middle" class="tg-lab" fill="#cb493c">exact answer ' + A.truth.toFixed(2) + '</text>';
      // crude marker
      s += '<path d="M ' + X(A.crude) + ' ' + (top - 6) + ' l 5 8 l -10 0 Z" fill="#0a0a0a"/>' +
        '<text x="' + X(A.crude) + '" y="' + (top - 10) + '" text-anchor="middle" class="tg-lab">raw census ' + A.crude.toFixed(2) + '</text>';
    }
    // estimate dots (render the last 300)
    var start = Math.max(0, A.estimates.length - 300);
    for (var i = start; i < A.estimates.length; i++) {
      var jit = ((i * 2654435761) >>> 0) % 1000 / 1000;
      var y = top + 8 + jit * (H - bot - top - 18);
      s += '<circle cx="' + X(A.estimates[i]) + '" cy="' + y + '" r="2.6" fill="#b8c2cc" fill-opacity="0.75"/>';
    }
    if (A.estimates.length) {
      var mean = A.estimates.reduce(function (x, y) { return x + y; }, 0) / A.estimates.length;
      s += '<path d="M ' + X(mean) + ' ' + (H - bot) + ' l 6 9 l -12 0 Z" fill="#0a0a0a"/>' +
        '<text x="' + X(mean) + '" y="' + (H - bot + 32) + '" text-anchor="middle" class="tg-lab">mean of your trials ' + mean.toFixed(2) + '</text>';
    }
    s += '</svg>';
    $('aChart').innerHTML = s;
    if (A.estimates.length) {
      var sorted = A.estimates.slice().sort(function (x, y) { return x - y; });
      var mid = sorted[Math.floor(sorted.length / 2)];
      $('aRead').innerHTML = '<strong>' + fmt(A.estimates.length) + '</strong> trial' +
        (A.estimates.length > 1 ? 's' : '') + ' run. Median estimate <strong>' + mid.toFixed(2) +
        '</strong>, against an exact answer of ' + A.truth.toFixed(2) +
        ' and a raw observational ratio of ' + A.crude.toFixed(2) +
        '. Each dot is one complete randomized trial of ' + fmt(A.smokers.length) + ' smokers.';
    } else {
      $('aRead').textContent = '';
    }
  }

  /* =====================================================
     Experiment 2 — epidemic on the published contact network
     ===================================================== */
  var B = {
    nbrs: null, snow: null, n: 0,
    rng: mulberry32(20280702),
    cover: 0.40,
    runs: [],        // {base, pol, rr}
    lastCurves: null,
    loading: false,
  };
  var BETA = { household: 0.055, workplace: 0.014, community: 0.007 };
  var INF_DAYS = 7, T_DAYS = 150, N_SEEDS = 10, VAX_EFF = 0.70;

  function loadNetwork() {
    return loadCensus().then(function (rows) {
      if (B.nbrs) return;
      B.n = rows.length;
      B.snow = [];
      var idx = {};
      rows.forEach(function (r, i) {
        idx[r.id] = i;
        if (r.district === 'Snow') B.snow.push(i);
      });
      return fetch(CONTACTS_URL).then(function (r) {
        if (!r.ok) throw new Error('contacts fetch ' + r.status);
        return r.text();
      }).then(function (text) {
        var lines = text.trim().split(/\r?\n/);
        var nbrs = new Array(B.n);
        for (var i = 0; i < B.n; i++) nbrs[i] = [];
        for (i = 1; i < lines.length; i++) {
          var f = lines[i].split(',');
          var a = idx[+f[0]], b = idx[+f[1]], beta = BETA[f[2]];
          nbrs[a].push(b, beta);
          nbrs[b].push(a, beta);
        }
        B.nbrs = nbrs;
      });
    });
  }

  function runEpidemic(vaxFlag) {
    var n = B.n, nbrs = B.nbrs, rng = B.rng;
    var sus = new Uint8Array(n); sus.fill(1);
    var daysLeft = new Uint8Array(n);
    var infectious = [];
    // seed in Snow
    var pool = B.snow.slice();
    for (var k = 0; k < N_SEEDS; k++) {
      var pick = k + Math.floor(rng() * (pool.length - k));
      var tmp = pool[k]; pool[k] = pool[pick]; pool[pick] = tmp;
      var s0 = pool[k];
      sus[s0] = 0; daysLeft[s0] = INF_DAYS; infectious.push(s0);
    }
    var cases = infectious.length, vaxCases = 0, curve = [];
    for (var d = 0; d < T_DAYS && infectious.length; d++) {
      var fresh = [];
      for (var ii = 0; ii < infectious.length; ii++) {
        var adj = nbrs[infectious[ii]];
        for (var e = 0; e < adj.length; e += 2) {
          var j = adj[e];
          if (sus[j]) {
            var p = vaxFlag && vaxFlag[j] ? adj[e + 1] * (1 - VAX_EFF) : adj[e + 1];
            if (rng() < p) {
              sus[j] = 0; fresh.push(j);
              cases++;
              if (vaxFlag && vaxFlag[j]) vaxCases++;
            }
          }
        }
      }
      var still = [];
      for (ii = 0; ii < infectious.length; ii++) {
        var v = infectious[ii];
        if (--daysLeft[v] > 0) still.push(v);
      }
      for (ii = 0; ii < fresh.length; ii++) { daysLeft[fresh[ii]] = INF_DAYS; still.push(fresh[ii]); }
      infectious = still;
      curve.push(fresh.length);
    }
    return { cases: cases, vaxCases: vaxCases, curve: curve };
  }

  function runPairB() {
    var base = runEpidemic(null);
    var nVax = Math.round(B.cover * B.n);
    var vaxFlag = new Uint8Array(B.n);
    // partial Fisher-Yates over indices
    var ids = new Int32Array(B.n);
    for (var i = 0; i < B.n; i++) ids[i] = i;
    for (i = 0; i < nVax; i++) {
      var pick = i + Math.floor(B.rng() * (B.n - i));
      var t = ids[i]; ids[i] = ids[pick]; ids[pick] = t;
      vaxFlag[ids[i]] = 1;
    }
    var pol = runEpidemic(vaxFlag);
    var arV = nVax ? pol.vaxCases / nVax : 0;
    var arU = (pol.cases - pol.vaxCases) / (B.n - nVax);
    var rr = (nVax && arU > 0) ? arV / arU : null;
    B.runs.push({ base: base.cases, pol: pol.cases, rr: rr });
    B.lastCurves = [base.curve, pol.curve];
    drawB();
  }

  function drawB() {
    var runs = B.runs;
    if (!runs.length) { $('bChart').innerHTML = ''; $('bRead').textContent = ''; return; }
    var mean = function (f) {
      var xs = runs.map(f).filter(function (v) { return v !== null && !isNaN(v); });
      return xs.length ? xs.reduce(function (a, b) { return a + b; }, 0) / xs.length : null;
    };
    var base = mean(function (r) { return r.base; });
    var pol = mean(function (r) { return r.pol; });
    var rr = mean(function (r) { return r.rr; });
    var projected = rr === null ? base : base * (1 - B.cover * (1 - rr));
    $('bBase').textContent = fmt(Math.round(base));
    $('bRR').textContent = rr === null ? '–' : rr.toFixed(2);
    $('bProj').textContent = fmt(Math.round(projected));
    $('bPol').textContent = fmt(Math.round(pol));
    var herd = Math.round((base - pol) - (base - projected));
    $('bHerd').textContent = fmt(herd);

    // curves of the most recent pair
    var c0 = B.lastCurves[0], c1 = B.lastCurves[1];
    var days = Math.max(c0.length, c1.length);
    var peak = Math.max(1, Math.max.apply(null, c0.concat(c1)));
    var W = 640, H = 200, padL = 40, padR = 12, top = 16, bot = 28;
    function X(d) { return padL + d / Math.max(1, days - 1) * (W - padL - padR); }
    function Y(v) { return top + (1 - v / peak) * (H - top - bot); }
    function line(c) {
      var pts = [];
      for (var d = 0; d < days; d++) pts.push(X(d).toFixed(1) + ',' + Y(c[d] || 0).toFixed(1));
      return pts.join(' ');
    }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tg-chart" role="img" aria-label="Daily new cases, with and without vaccination">';
    s += '<line x1="' + padL + '" y1="' + (H - bot) + '" x2="' + (W - padR) + '" y2="' + (H - bot) + '" stroke="#0a0a0a" stroke-width="1.2"/>';
    s += '<text x="' + padL + '" y="' + (H - 8) + '" class="tg-tick">day 1</text>';
    s += '<text x="' + (W - padR) + '" y="' + (H - 8) + '" text-anchor="end" class="tg-tick">day ' + days + '</text>';
    s += '<text x="' + (padL - 6) + '" y="' + (top + 10) + '" text-anchor="end" class="tg-tick">' + fmt(peak) + '</text>';
    s += '<polyline points="' + line(c0) + '" fill="none" stroke="#b8c2cc" stroke-width="1.8"/>';
    s += '<polyline points="' + line(c1) + '" fill="none" stroke="#cb493c" stroke-width="1.8"/>';
    s += '</svg>';
    $('bChart').innerHTML = s;
    $('bLegend').innerHTML =
      '<span class="tg-sw" style="background:#b8c2cc"></span> nobody vaccinated&nbsp;&nbsp;&nbsp;' +
      '<span class="tg-sw" style="background:#cb493c"></span> ' + Math.round(B.cover * 100) + '% vaccinated &middot; latest run, daily new cases';
    if (rr === null) {
      $('bRead').innerHTML = 'With nobody vaccinated, the two towns run the same course: about ' +
        fmt(Math.round(base)) + ' cases. Move the coverage slider and run again.';
    } else {
      $('bRead').innerHTML = 'Across <strong>' + runs.length + '</strong> paired run' + (runs.length > 1 ? 's' : '') +
        ': the embedded trial measures RR <strong>' + rr.toFixed(2) + '</strong> (about ' +
        Math.round(100 * (1 - rr)) + '% direct protection). Projecting that direct effect alone promises ' +
        fmt(Math.round(base - projected)) + ' cases averted; the simulated town actually averts <strong>' +
        fmt(Math.round(base - pol)) + '</strong>. The extra <strong>' + fmt(herd) +
        '</strong> cases are herd protection, invisible to the trial because both of its arms share one epidemic.';
    }
  }

  /* ---------- wiring ---------- */
  function init() {
    $('aStatus').textContent = 'Loading the census (1.2 MB)…';
    loadCensus().then(function (rows) {
      $('aStatus').textContent = '';
      setupA(rows);
    }).catch(function (e) {
      $('aStatus').textContent = 'The census could not be loaded. Reload the page to try again.';
    });

    $('aRun1').addEventListener('click', function () { runTrialsA(1); });
    $('aRun25').addEventListener('click', function () { runTrialsA(25); });
    $('aRun100').addEventListener('click', function () { runTrialsA(100); });
    $('aReset').addEventListener('click', function () { A.estimates = []; A.rng = mulberry32(20280701); drawA(); });

    var slider = $('bCover');
    slider.addEventListener('input', function () {
      B.cover = +slider.value / 100;
      $('bCoverLab').textContent = slider.value + '%';
      B.runs = []; B.lastCurves = null;
      drawB();
      ['bBase', 'bRR', 'bProj', 'bPol', 'bHerd'].forEach(function (id) { $(id).textContent = '–'; });
      $('bLegend').innerHTML = '';
    });

    $('bRun').addEventListener('click', function () {
      var btn = $('bRun');
      btn.disabled = true;
      var go = function () {
        setTimeout(function () {       // let the status paint first
          try { runPairB(); } finally {
            btn.disabled = false;
            $('bStatus').textContent = '';
          }
        }, 30);
      };
      if (B.nbrs) {
        $('bStatus').textContent = 'Running two epidemics…';
        go();
      } else if (!B.loading) {
        B.loading = true;
        $('bStatus').textContent = 'Loading the contact network (2 MB)…';
        loadNetwork().then(function () {
          $('bStatus').textContent = 'Running two epidemics…';
          go();
        }).catch(function () {
          B.loading = false;
          btn.disabled = false;
          $('bStatus').textContent = 'The contact network could not be loaded. Try again.';
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
