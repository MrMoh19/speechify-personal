/* =====================================================
   Epidemiology Matters — The town opening + Investigation No. 1
   Draws the homepage crowd from the census sample (farr-data.js)
   and runs the first guided investigation on the same residents.
   Requires: figure.js (EpiFigure), farr-data.js (__FARR_RAW__).
   ===================================================== */
(function () {
  'use strict';
  if (!window.__FARR_RAW__ || !window.EpiFigure) return;

  var R = window.__FARR_RAW__;
  // Columns: 0 id, 1 age, 2 female, 3 dist, 4 ses, 5 smoking, 6 poll,
  //          7 diet, 8 inact, 9 alc, 10 iso, 11 cvd, 12 dep, 13 lc, 14 py
  var DISTRICTS = ['', 'Snow', 'Nightingale', 'Hill', 'Doll', 'Rose'];
  var N_SAMPLE = R.length;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hasDx(r) { return r[11] === 1 || r[12] === 1 || r[13] === 1; }
  function dxList(r) {
    var d = [];
    if (r[11]) d.push('heart disease');
    if (r[12]) d.push('depression');
    if (r[13]) d.push('lung cancer');
    return d;
  }
  function pct1(a, b) { return (a / b * 100).toFixed(1); }

  // ---------- The three residents the site follows ----------
  var PEOPLE = [
    {
      id: 97199, name: 'Samuel Okonkwo', first: 'Samuel',
      line: 'Smoker. Heart disease on record.',
      story: 'Samuel has smoked since his twenties. Last year the district surgeon entered heart disease in his record.'
    },
    {
      id: 36024, name: 'Margaret Croft', first: 'Margaret',
      line: 'Smoker. Nothing on record.',
      story: 'Margaret has smoked for longer than Samuel has. Her record shows no disease at all.'
    },
    {
      id: 35931, name: 'Amina Yusuf', first: 'Amina',
      line: 'Never smoked. Heart disease on record.',
      story: 'Amina never smoked. Her record lists heart disease, and the depression that often travels with it.'
    }
  ];
  PEOPLE.forEach(function (p) {
    p.rowIdx = -1;
    for (var i = 0; i < R.length; i++) { if (R[i][0] === p.id) { p.rowIdx = i; break; } }
  });
  var personByRow = {};
  PEOPLE.forEach(function (p) { if (p.rowIdx >= 0) personByRow[p.rowIdx] = p; });

  /* =====================================================
     1. THE CROWD — explorable population in the opening screen
     ===================================================== */
  var crowdEl = document.getElementById('townCrowd');
  var vizEl = crowdEl ? crowdEl.closest('.town__viz') : null;
  var capEl = document.getElementById('townCap');
  var card = null;           // floating resident card
  var pinnedIdx = null;      // row index pinned by click/tap
  var slotByRow = {};        // rowIdx -> button element

  function residentLabel(r) {
    var who = personByRow[R.indexOf(r)];
    var dx = dxList(r);
    return (who ? who.name : 'Resident ' + r[0]) + ', age ' + r[1] + ', ' +
      DISTRICTS[r[3]] + ' district, ' +
      (dx.length ? dx.join(' and ') + ' on record' : 'nothing on record');
  }

  function buildCard() {
    card = document.createElement('div');
    card.className = 'res-card';
    card.setAttribute('role', 'status');
    card.hidden = true;
    vizEl.appendChild(card);
  }

  function fillCard(rowIdx) {
    var r = R[rowIdx];
    var who = personByRow[rowIdx];
    var dx = dxList(r);
    var html = '';
    html += '<div class="res-card__name">' + (who ? who.name : 'Resident No. ' + r[0]) + '</div>';
    html += '<div class="res-card__meta">' + DISTRICTS[r[3]] + ' district &middot; age ' + r[1] +
      ' &middot; ' + (r[2] === 1 ? 'woman' : 'man') + '</div>';
    html += '<dl class="res-card__facts">';
    html += '<div><dt>Smokes</dt><dd>' + (r[5] ? 'yes' : 'no') + '</dd></div>';
    html += '<div><dt>Income band</dt><dd>' + r[4] + ' of 5</dd></div>';
    html += '<div><dt>On record</dt><dd>' + (dx.length ? dx.join(', ') : 'nothing') + '</dd></div>';
    html += '</dl>';
    if (who) {
      html += '<p class="res-card__story">' + who.story + '</p>';
      html += '<div class="res-card__foot">Census row ' + r[0] + ' &middot; one of three residents this site follows</div>';
    } else {
      html += '<div class="res-card__foot">Census row ' + r[0] + '</div>';
    }
    card.innerHTML = html;
  }

  function placeCard(btn) {
    var vb = vizEl.getBoundingClientRect();
    var fb = btn.getBoundingClientRect();
    card.hidden = false; // must be visible to measure
    var cw = card.offsetWidth, chh = card.offsetHeight;
    var x = fb.left - vb.left + fb.width / 2 - cw / 2;
    x = Math.max(4, Math.min(x, vb.width - cw - 4));
    var y = fb.top - vb.top - chh - 10;
    if (y < 2) y = fb.top - vb.top + fb.height + 10;
    card.style.left = x + 'px';
    card.style.top = y + 'px';
  }

  var hideTimer = null;
  function showCard(rowIdx, btn) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    fillCard(rowIdx);
    placeCard(btn);
  }
  function hideCardSoon() {
    if (pinnedIdx !== null) return;
    hideTimer = setTimeout(function () { card.hidden = true; }, 120);
  }

  function renderCrowd() {
    if (!crowdEl) return;
    crowdEl.innerHTML = '';
    slotByRow = {};
    pinnedIdx = null;
    if (card) card.hidden = true;

    var w = crowdEl.clientWidth || 560;
    var figW = 20, gap = 7;
    var cols = Math.max(8, Math.floor((w + gap) / (figW + gap)));
    var rows = (w <= 560) ? 8 : 10;
    var N = Math.min(cols * rows, R.length);

    // Residents 0..N-1 in census-sample order, with the three named
    // residents swapped to fixed, spread-out slots so their tags read well.
    var order = [];
    for (var i = 0; i < N; i++) order.push(i);
    var slots = [
      Math.floor(cols * 1.5),
      Math.floor(cols * (rows / 2) + cols * 0.72),
      Math.floor(cols * (rows - 2) + cols * 0.25)
    ];
    PEOPLE.forEach(function (p, k) {
      if (p.rowIdx < 0) return;
      var slot = Math.min(slots[k], N - 1);
      var cur = order.indexOf(p.rowIdx);
      if (cur >= 0) { order[cur] = order[slot]; }
      order[slot] = p.rowIdx;
    });

    var frag = document.createDocumentFragment();
    order.forEach(function (rowIdx, pos) {
      var r = R[rowIdx];
      var who = personByRow[rowIdx];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'crowd__fig' + (hasDx(r) ? ' is-sick' : '') + (who ? ' is-named' : '');
      b.setAttribute('aria-label', residentLabel(r));
      b.dataset.row = rowIdx;
      var f = window.EpiFigure.figure({ signal: hasDx(r) });
      b.appendChild(f);
      if (who) {
        var tag = document.createElement('span');
        tag.className = 'crowd__tag';
        tag.textContent = who.first;
        b.appendChild(tag);
      }
      if (!reduceMotion) {
        b.style.opacity = '0';
        b.style.transition = 'opacity 420ms ease';
        setTimeout(function () { b.style.opacity = '1'; }, Math.floor(pos / cols) * 55 + (pos % cols) * 4);
      }
      b.addEventListener('mouseenter', function () { showCard(rowIdx, b); });
      b.addEventListener('focus', function () { showCard(rowIdx, b); });
      b.addEventListener('mouseleave', hideCardSoon);
      b.addEventListener('blur', hideCardSoon);
      b.addEventListener('click', function () {
        if (pinnedIdx === rowIdx) { pinnedIdx = null; card.hidden = true; }
        else { pinnedIdx = rowIdx; showCard(rowIdx, b); }
      });
      slotByRow[rowIdx] = b;
      frag.appendChild(b);
    });
    crowdEl.appendChild(frag);

    if (capEl) {
      var sick = order.filter(function (ri) { return hasDx(R[ri]); }).length;
      capEl.textContent = N + ' of the 1,000 sampled residents, drawn straight from the census. ' +
        'The ' + sick + ' in red have at least one diagnosis on record. Touch a figure to read a person.';
    }
  }

  // Dismiss a pinned card when tapping elsewhere
  document.addEventListener('click', function (e) {
    if (pinnedIdx !== null && card && !card.contains(e.target) &&
        !(e.target.closest && e.target.closest('.crowd__fig'))) {
      pinnedIdx = null; card.hidden = true;
    }
  });

  // ---------- The three field cards under the hero ----------
  function renderFieldCards() {
    var host = document.getElementById('townCards');
    if (!host) return;
    PEOPLE.forEach(function (p) {
      if (p.rowIdx < 0) return;
      var r = R[p.rowIdx];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fieldcard';
      b.innerHTML =
        '<span class="fieldcard__name">' + p.name + '</span>' +
        '<span class="fieldcard__meta">' + r[1] + ' &middot; ' + DISTRICTS[r[3]] + ' district</span>' +
        '<span class="fieldcard__line">' + p.line + '</span>' +
        '<span class="fieldcard__hint">Find ' + p.first + ' in the crowd</span>';
      b.addEventListener('click', function () {
        var btn = slotByRow[p.rowIdx];
        if (!btn) return;
        btn.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        setTimeout(function () {
          pinnedIdx = p.rowIdx;
          showCard(p.rowIdx, btn);
          btn.classList.remove('is-flash');
          void btn.offsetWidth; // restart animation
          btn.classList.add('is-flash');
        }, reduceMotion ? 0 : 420);
      });
      host.appendChild(b);
    });
  }

  if (crowdEl && vizEl) {
    buildCard();
    renderCrowd();
    renderFieldCards();
    var rsTimer = null;
    window.addEventListener('resize', function () {
      if (rsTimer) clearTimeout(rsTimer);
      rsTimer = setTimeout(renderCrowd, 250);
    });
  }

  /* =====================================================
     2. INVESTIGATION No. 1 — count, measure, compare, report
     ===================================================== */
  var inv = document.getElementById('inv');
  if (!inv) return;

  var OUTCOMES = {
    cvd: { col: 11, label: 'heart disease', title: 'Heart disease' },
    dep: { col: 12, label: 'depression', title: 'Depression' },
    lc:  { col: 13, label: 'lung cancer', title: 'Lung cancer' }
  };
  var state = { outcome: null, split: null };

  function count(f) { var c = 0; for (var i = 0; i < R.length; i++) if (f(R[i])) c++; return c; }

  function grid100(host, redCount) {
    host.innerHTML = '';
    var reds = [];
    for (var i = 0; i < redCount; i++) reds.push(Math.min(99, Math.round(i * 100 / Math.max(redCount, 1)) ));
    var set = {};
    reds.forEach(function (x) { while (set[x]) x = (x + 1) % 100; set[x] = true; });
    var idx = Object.keys(set).map(Number);
    window.EpiFigure.pedaGrid(host, 100, idx);
  }

  // ---------- Step scaffolding ----------
  function stepEl(num, kicker, title) {
    var li = document.createElement('li');
    li.className = 'inv-step' + (num > 1 ? ' is-locked' : '');
    li.id = 'invStep' + num;
    li.innerHTML =
      '<div class="inv-step__head">' +
        '<span class="inv-step__num">' + num + '</span>' +
        '<div><p class="inv-step__kicker">' + kicker + '</p>' +
        '<h3 class="inv-step__title">' + title + '</h3></div>' +
      '</div>' +
      '<div class="inv-step__body"></div>';
    return li;
  }
  function body(li) { return li.querySelector('.inv-step__body'); }
  function unlock(num) {
    var li = document.getElementById('invStep' + num);
    if (!li || !li.classList.contains('is-locked')) return;
    li.classList.remove('is-locked');
    setTimeout(function () {
      li.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, 60);
  }

  // ---------- Step 1: count ----------
  var s1 = stepEl(1, 'Step 1 · Count', 'Start with who lives here');
  var b1 = body(s1);
  var distRows = '';
  var maxD = 0;
  var distCounts = [0, 0, 0, 0, 0, 0];
  R.forEach(function (r) { distCounts[r[3]]++; });
  for (var d = 1; d <= 5; d++) maxD = Math.max(maxD, distCounts[d]);
  for (d = 1; d <= 5; d++) {
    distRows += '<div class="inv-bar"><span class="inv-bar__lab">' + DISTRICTS[d] + '</span>' +
      '<span class="inv-bar__track"><span class="inv-bar__fill" style="width:' + (distCounts[d] / maxD * 100) + '%"></span></span>' +
      '<span class="inv-bar__val">' + distCounts[d] + '</span></div>';
  }
  var women = count(function (r) { return r[2] === 1; });
  b1.innerHTML =
    '<p class="inv-copy">An investigation begins with a denominator: how many people could fall ill at all. The census sample holds 1,000 residents across five districts. ' +
    women + ' are women, ' + (N_SAMPLE - women) + ' are men, and ages run from 18 to 79.</p>' +
    '<div class="inv-stage">' + distRows + '</div>' +
    '<p class="inv-copy inv-q">You get one week of house calls. What do you write down at each door first?</p>' +
    '<div class="inv-choices">' +
      '<button type="button" class="inv-choice" data-fb="The roster first. Every rate you will ever report is cases over people, and this is the people half.">Who lives in the household</button>' +
      '<button type="button" class="inv-choice" data-fb="You will need that count soon. It only becomes a rate once you know how many people could have been sick, so the roster comes first.">Who in the household is sick</button>' +
      '<button type="button" class="inv-choice" data-fb="Exposures feel like answers, and they will matter. They mean little until you know who is here at all, so the roster comes first.">What the household is exposed to</button>' +
    '</div>' +
    '<p class="inv-feedback" role="status"></p>';
  var fb1 = b1.querySelector('.inv-feedback');
  b1.querySelectorAll('.inv-choice').forEach(function (btn) {
    btn.addEventListener('click', function () {
      b1.querySelectorAll('.inv-choice').forEach(function (x) { x.classList.remove('is-picked'); });
      btn.classList.add('is-picked');
      fb1.textContent = btn.dataset.fb;
      unlock(2);
    });
  });

  // ---------- Step 2: measure ----------
  var s2 = stepEl(2, 'Step 2 · Measure', 'Choose what counts as sick');
  var b2 = body(s2);
  b2.innerHTML =
    '<p class="inv-copy">The red figures at the top of the page lump three diagnoses into one word, sick. A study cannot. It names one outcome and states exactly how a case will be found. Choose a first outcome for the record.</p>' +
    '<div class="inv-chips" id="chipOutcome">' +
      '<button type="button" class="inv-chip" data-k="cvd" aria-pressed="false">Heart disease</button>' +
      '<button type="button" class="inv-chip" data-k="dep" aria-pressed="false">Depression</button>' +
      '<button type="button" class="inv-chip" data-k="lc" aria-pressed="false">Lung cancer</button>' +
    '</div>' +
    '<div class="inv-stage" id="stage2" hidden>' +
      '<div class="inv-grid100" id="grid2" aria-hidden="true"></div>' +
      '<p class="inv-readout" id="read2"></p>' +
      '<p class="inv-note" id="note2"></p>' +
    '</div>';
  var NOTES2 = {
    cvd: 'Hospital records find these cases reliably. They say nothing about anyone who never reached a hospital.',
    dep: 'These are clinic diagnoses. A screening questionnaire would find more cases, and partly different people. The count depends on the instrument you choose.',
    lc: 'With an outcome this rare, small groups give unsteady numbers. That is about to matter.'
  };
  function renderStep2() {
    var o = OUTCOMES[state.outcome];
    var cases = count(function (r) { return r[o.col] === 1; });
    document.getElementById('stage2').hidden = false;
    grid100(document.getElementById('grid2'), Math.max(1, Math.round(cases / N_SAMPLE * 100)));
    document.getElementById('read2').innerHTML =
      '<strong>' + cases + ' of the 1,000 sampled residents</strong> have ' + o.label +
      ' on record: ' + pct1(cases, N_SAMPLE) + ' per 100. The grid shows the town per hundred residents.';
    document.getElementById('note2').textContent = NOTES2[state.outcome];
  }
  b2.querySelectorAll('#chipOutcome .inv-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.outcome = chip.dataset.k;
      b2.querySelectorAll('.inv-chip').forEach(function (x) {
        x.classList.toggle('is-on', x === chip);
        x.setAttribute('aria-pressed', String(x === chip));
      });
      renderStep2();
      unlock(3);
      if (state.split) { renderStep3(); renderStep4(); }
    });
  });

  // ---------- Step 3: compare ----------
  var s3 = stepEl(3, 'Step 3 · Compare', 'Divide the town and look again');
  var b3 = body(s3);
  b3.innerHTML =
    '<p class="inv-copy">A count becomes evidence when you split the population and ask whether the outcome follows the split. Choose a dividing line.</p>' +
    '<div class="inv-chips" id="chipSplit">' +
      '<button type="button" class="inv-chip" data-k="smoking" aria-pressed="false">Smokers and non-smokers</button>' +
      '<button type="button" class="inv-chip" data-k="district" aria-pressed="false">District against district</button>' +
      '<button type="button" class="inv-chip" data-k="ses" aria-pressed="false">Lower and higher income</button>' +
    '</div>' +
    '<div class="inv-stage" id="stage3" hidden></div>';

  function twoGroupStage(gaLabel, gbLabel, expA, outcomeCol) {
    var a = count(function (r) { return expA(r) && r[outcomeCol] === 1; });
    var nA = count(expA);
    var c = count(function (r) { return !expA(r) && r[outcomeCol] === 1; });
    var nB = N_SAMPLE - nA;
    var rA = a / nA, rB = c / nB;
    var rr = (rA / rB);
    state._rA = rA; state._rB = rB;
    return {
      a: a, nA: nA, c: c, nB: nB, rA: rA, rB: rB, rr: rr,
      html:
        '<div class="inv-duo">' +
          '<div><p class="inv-duo__lab">' + gaLabel + ' &middot; n = ' + nA + '</p>' +
            '<div class="inv-grid100 inv-grid100--sm" data-g="a" aria-hidden="true"></div>' +
            '<p class="inv-duo__val">' + pct1(a, nA) + ' per 100 (' + a + ' cases)</p></div>' +
          '<div><p class="inv-duo__lab">' + gbLabel + ' &middot; n = ' + nB + '</p>' +
            '<div class="inv-grid100 inv-grid100--sm" data-g="b" aria-hidden="true"></div>' +
            '<p class="inv-duo__val">' + pct1(c, nB) + ' per 100 (' + c + ' cases)</p></div>' +
        '</div>'
    };
  }

  function renderStep3() {
    if (!state.outcome || !state.split) return;
    var o = OUTCOMES[state.outcome];
    var st = document.getElementById('stage3');
    st.hidden = false;
    var html = '', readout = '', note = '';

    if (state.split === 'district') {
      var best = null, worst = null;
      var rows = '';
      var rates = [];
      for (var d = 1; d <= 5; d++) {
        var n = distCounts[d];
        var cs = count(function (r) { return r[3] === d && r[o.col] === 1; });
        rates.push({ d: d, rate: cs / n, cs: cs, n: n });
      }
      var maxR = Math.max.apply(null, rates.map(function (x) { return x.rate; }));
      rates.forEach(function (x) {
        if (!best || x.rate > best.rate) best = x;
        if (!worst || x.rate < worst.rate) worst = x;
        rows += '<div class="inv-bar"><span class="inv-bar__lab">' + DISTRICTS[x.d] + '</span>' +
          '<span class="inv-bar__track"><span class="inv-bar__fill" style="width:' + (maxR ? x.rate / maxR * 100 : 0) + '%"></span></span>' +
          '<span class="inv-bar__val">' + pct1(x.cs, x.n) + ' per 100</span></div>';
      });
      html = rows;
      readout = 'The highest district is <strong>' + DISTRICTS[best.d] + '</strong> at ' + pct1(best.cs, best.n) +
        ' per 100 and the lowest is <strong>' + DISTRICTS[worst.d] + '</strong> at ' + pct1(worst.cs, worst.n) +
        ' per 100: a ratio of ' + (worst.rate > 0 ? (best.rate / worst.rate).toFixed(1) : '&infin;') + '.';
      note = 'An address carries income, work, and air along with it, so this split holds more than one difference at once.';
      state.comparison = { kind: 'district', hi: DISTRICTS[best.d], lo: DISTRICTS[worst.d], rr: worst.rate > 0 ? best.rate / worst.rate : null, rHi: pct1(best.cs, best.n), rLo: pct1(worst.cs, worst.n) };
    } else {
      var g = (state.split === 'smoking')
        ? twoGroupStage('Smokers', 'Non-smokers', function (r) { return r[5] === 1; }, o.col)
        : twoGroupStage('Income bands 1–2', 'Income bands 3–5', function (r) { return r[4] <= 2; }, o.col);
      html = g.html;
      readout = 'Risk ratio: <strong>' + g.rr.toFixed(1) + '</strong>. ' +
        (state.split === 'smoking'
          ? 'Smokers in the sample carry ' + g.rr.toFixed(1) + ' times the risk of ' + o.label + ' that non-smokers carry.'
          : 'Residents in the lower income bands carry ' + g.rr.toFixed(1) + ' times the risk of ' + o.label + ' that better-off residents carry.');
      if (g.rr > 0.85 && g.rr < 1.18) {
        note = 'Nearly no difference between the groups. A fair comparison can come back empty, and that result belongs in the record too.';
      } else if (state.split === 'smoking') {
        note = 'Smokers differ from non-smokers in more ways than cigarettes, so the split holds more than one difference at once.';
      } else {
        note = 'Income travels with diet, housing, work, and care, so the split holds more than one difference at once.';
      }
      if (state.split === 'smoking' && state.outcome === 'cvd') {
        note += ' Samuel and Margaret both stand on the smokers’ side of this split; Amina stands opposite. One resident on each side is ill. The ratio speaks about the groups, not about any one of the three.';
      }
      state.comparison = { kind: state.split, rr: g.rr, rA: pct1(g.a, g.nA), rB: pct1(g.c, g.nB) };
    }
    st.innerHTML = html +
      '<p class="inv-readout">' + readout + '</p>' +
      '<p class="inv-note">' + note + '</p>';
    st.querySelectorAll('.inv-grid100').forEach(function (gEl) {
      var which = gEl.dataset.g;
      var rate = which === 'a' ? state._rA : state._rB;
      grid100(gEl, Math.max(rate > 0 ? 1 : 0, Math.round(rate * 100)));
    });
  }

  b3.querySelectorAll('#chipSplit .inv-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.split = chip.dataset.k;
      b3.querySelectorAll('.inv-chip').forEach(function (x) {
        x.classList.toggle('is-on', x === chip);
        x.setAttribute('aria-pressed', String(x === chip));
      });
      renderStep3();
      unlock(4);
      renderStep4();
    });
  });

  // ---------- Step 4: report ----------
  var s4 = stepEl(4, 'Step 4 · Report', 'Write the finding, and its limits');
  var b4 = body(s4);
  b4.innerHTML =
    '<div class="inv-verdict" id="verdict"></div>' +
    '<p class="inv-copy" id="limits"></p>' +
    '<p class="inv-copy">Margaret smoked and is well. Amina never smoked and is not. A risk ratio speaks about groups; it promises nothing about one person. Holding both facts at once is the discipline this site teaches.</p>' +
    '<div class="cta-row">' +
      '<a class="btn btn--signal" href="#hook">Next investigation: the coffee question <span class="arrow"></span></a>' +
      '<a class="btn" href="lab/index.html">Open the Causal Lab</a>' +
      '<a class="btn" href="farrlandia/census/index.html">Download the census</a>' +
    '</div>';

  function renderStep4() {
    if (!state.outcome || !state.comparison) return;
    var o = OUTCOMES[state.outcome];
    var cmp = state.comparison;
    var v = '';
    if (cmp.kind === 'district') {
      v = 'In the Farrlandia sample, residents of ' + cmp.hi + ' carry ' +
        (cmp.rr ? cmp.rr.toFixed(1) : 'many') + ' times the risk of ' + o.label +
        ' that residents of ' + cmp.lo + ' carry: ' + cmp.rHi + ' against ' + cmp.rLo + ' per 100.';
    } else if (cmp.kind === 'smoking') {
      v = 'In the Farrlandia sample, smokers carry ' + cmp.rr.toFixed(1) + ' times the risk of ' +
        o.label + ' that non-smokers carry: ' + cmp.rA + ' against ' + cmp.rB + ' per 100.';
    } else {
      v = 'In the Farrlandia sample, residents in the lower income bands carry ' + cmp.rr.toFixed(1) +
        ' times the risk of ' + o.label + ' that better-off residents carry: ' + cmp.rA + ' against ' + cmp.rB + ' per 100.';
    }
    document.getElementById('verdict').textContent = v;
    document.getElementById('limits').textContent =
      'That sentence describes the town as the census found it. It does not yet say the exposure put the risk there: the groups may differ in more ways than the one you split on, and the measure finds some people more easily than others. The next investigation takes up the first of those problems with a cup of coffee.';
  }

  inv.appendChild(s1);
  inv.appendChild(s2);
  inv.appendChild(s3);
  inv.appendChild(s4);
})();
