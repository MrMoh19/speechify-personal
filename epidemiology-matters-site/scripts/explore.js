/* =====================================================
   Interactive Companion (/explore) — four sub-tools
   ===================================================== */
(function () {
  'use strict';

  // ---------- Hero lattice + population graphic ----------
  if (window.EpiFigure) {
    var lat = document.getElementById('hero-lattice');
    if (lat) EpiFigure.lattice(lat, { rows: 11, cols: 16, tilt: 15, figW: 56, gapX: 0.55, gapY: 0.25, signal: [4, 9], opacity: 0.28 });
    var heroPop = document.getElementById('hero-pop-grid');
    if (heroPop) {
      var diseased = new Set([3, 7, 12, 18, 21, 26, 33, 39, 41, 47, 52, 58, 63, 69, 74, 78, 83, 88, 91, 96]);
      for (var i = 0; i < 100; i++) {
        var f = EpiFigure.figure({ signal: diseased.has(i) });
        f.style.color = diseased.has(i) ? 'var(--signal)' : 'var(--pop-grey)';
        heroPop.appendChild(f);
      }
    }
  }

  /* ============================================================
     TOOL 1 — Disease in a Population (Prevalence sim)
     ============================================================ */
  (function prevalenceSim() {
    var simD = document.getElementById('simD');
    var simE = document.getElementById('simE');
    if (!simD) return;
    var vizEl = document.getElementById('simViz');
    var statsEl = document.getElementById('simStats');

    function render() {
      var D = parseInt(simD.value, 10);
      var E = parseInt(simE.value, 10);
      document.getElementById('simD_val').textContent = D;
      document.getElementById('simE_val').textContent = E;

      // Assign 100 people: first D are diseased (spread), then exposure among all.
      // Disease distributed proportionally between exposed and unexposed groups.
      var dExposed = Math.round(D * E / 100);
      var dUnexposed = D - dExposed;
      // build categories for 100 dots: index layout 10x10
      var cats = [];
      // exposed group = E people; among them dExposed diseased
      for (var i = 0; i < 100; i++) {
        var exposed = i < E;
        cats.push({ exposed: exposed, diseased: false });
      }
      // assign diseased: dExposed within exposed indices, dUnexposed within unexposed
      var ex = 0, un = 0;
      for (var j = 0; j < 100; j++) {
        if (cats[j].exposed && ex < dExposed) { cats[j].diseased = true; ex++; }
        else if (!cats[j].exposed && un < dUnexposed) { cats[j].diseased = true; un++; }
      }

      // SVG grid 10x10
      var cols = 10, size = 15, gap = 13, step = size + gap;
      var w = cols * step, h = cols * step;
      var svg = '<svg class="popdots" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">';
      cats.forEach(function (p, idx) {
        var x = (idx % cols) * step + size / 2;
        var y = Math.floor(idx / cols) * step + size / 2;
        var fill;
        if (p.diseased) fill = '#cb493c';
        else if (p.exposed) fill = '#7fa090';
        else fill = '#b8c2cc';
        svg += '<circle cx="' + x + '" cy="' + y + '" r="' + (size / 2) + '" fill="' + fill + '"/>';
      });
      svg += '</svg>';
      vizEl.innerHTML = svg;

      // Stats
      var prev = D;
      var riskE = E > 0 ? (dExposed / E * 100) : 0;
      var riskU = (100 - E) > 0 ? (dUnexposed / (100 - E) * 100) : 0;
      var rr = riskU > 0 ? (riskE / riskU) : (riskE > 0 ? Infinity : 0);
      var rd = riskE - riskU;
      statsEl.innerHTML =
        card(prev.toFixed(0) + '%', 'Prevalence') +
        card(riskE.toFixed(1) + '%', 'Risk (Exposed)') +
        card(riskU.toFixed(1) + '%', 'Risk (Unexposed)') +
        card(isFinite(rr) ? rr.toFixed(2) : '—', 'Risk Ratio', 'is-signal') +
        card(rd.toFixed(1) + '%', 'Risk Difference', 'is-sage');
    }
    function card(num, label, cls) {
      return '<div class="stat"><div class="stat__num ' + (cls || '') + '">' + num + '</div><div class="stat__label">' + label + '</div></div>';
    }
    simD.addEventListener('input', render);
    simE.addEventListener('input', render);
    render();
  })();

  /* ============================================================
     TOOL 2 — Sufficient-Component Cause Model
     ============================================================ */
  (function componentCause() {
    var container = document.getElementById('personCause');
    if (!container) return;

    var CAUSES = [
      { key: 'obesity', label: 'Obesity', color: '#cb493c' },
      { key: 'noprev', label: 'No preventive care', color: '#5b7b6a' },
      { key: 'famhist', label: 'Family history', color: '#6b7db3' },
      { key: 'smoking', label: 'Smoking', color: '#c4a35a' },
      { key: 'sedentary', label: 'Sedentary lifestyle', color: '#9b6b9e' }
    ];
    // Sufficient causes (pathways)
    var SUFFICIENT = [
      ['obesity', 'noprev', 'famhist'],
      ['obesity', 'famhist', 'smoking'],
      ['noprev', 'smoking', 'sedentary']
    ];

    // legend
    var legendEl = document.getElementById('marbleLegend');
    legendEl.innerHTML = CAUSES.map(function (c) {
      return '<span><span class="dot" style="background:' + c.color + ';"></span>' + c.label + '</span>';
    }).join('');

    var people = [
      { name: 'Person 1', causes: {} },
      { name: 'Person 2', causes: {} },
      { name: 'Person 3', causes: {} }
    ];

    function hasDisease(causes) {
      return SUFFICIENT.some(function (set) {
        return set.every(function (k) { return causes[k]; });
      });
    }

    function render() {
      container.innerHTML = '';
      people.forEach(function (person, pi) {
        var diseased = hasDisease(person.causes);
        var el = document.createElement('div');
        el.className = 'person';
        // figure
        var figWrap = document.createElement('div');
        figWrap.className = 'person__fig';
        if (window.EpiFigure) {
          var fig = EpiFigure.figure({ signal: diseased });
          fig.style.color = diseased ? 'var(--signal)' : 'var(--pop-grey-deep)';
          figWrap.appendChild(fig);
        }
        el.appendChild(figWrap);
        // name
        var nm = document.createElement('div');
        nm.className = 'person__name'; nm.textContent = person.name;
        el.appendChild(nm);
        // cause dots
        var dots = document.createElement('div');
        dots.className = 'cause-dots';
        CAUSES.forEach(function (c) {
          var dot = document.createElement('button');
          dot.className = 'cause-dot' + (person.causes[c.key] ? ' on' : '');
          dot.style.background = c.color;
          dot.style.color = c.color;
          dot.setAttribute('aria-label', c.label + (person.causes[c.key] ? ' (present)' : ' (absent)'));
          dot.addEventListener('click', function () {
            person.causes[c.key] = !person.causes[c.key];
            render();
          });
          dots.appendChild(dot);
        });
        el.appendChild(dots);
        // present causes list
        var list = document.createElement('div');
        list.className = 'person__causes';
        var present = CAUSES.filter(function (c) { return person.causes[c.key]; }).map(function (c) { return c.label; });
        list.textContent = present.length ? present.join(', ') : 'No causes present';
        el.appendChild(list);
        // status
        var status = document.createElement('div');
        status.className = 'person__status ' + (diseased ? 'diseased' : 'healthy');
        status.innerHTML = diseased ? '\u26A0 Diseased' : 'Healthy';
        el.appendChild(status);
        container.appendChild(el);
      });

      // explanation
      var nDiseased = people.filter(function (p) { return hasDisease(p.causes); }).length;
      var exp = document.getElementById('mExp');
      if (nDiseased === 0) {
        exp.innerHTML = 'No one is diseased yet. Click the colored dots beneath each person to add component causes. Disease occurs when all causes in a sufficient cause are present in the same individual.';
      } else {
        exp.innerHTML = '<strong>' + nDiseased + ' of 3 Farrlandians has disease.</strong> Their component causes completed a sufficient cause. Notice that different people can get the same disease through different causal pathways.';
      }
    }
    render();
  })();

  /* ============================================================
     TOOL 3 — Seven Steps accordion
     ============================================================ */
  (function sevenSteps() {
    var grid = document.getElementById('sGrid');
    if (!grid) return;
    var STEPS = [
      { n: 1, title: 'Define the population of interest', chap: 'Chapter 2',
        body: 'Whose health are we studying? Populations are defined by eligibility criteria. They can be dynamic or stationary.',
        key: 'We study collections of eligible person-time, not just people.' },
      { n: 2, title: 'Measure exposures and health indicators', chap: 'Chapter 3',
        body: 'Health indicators can be binary, ordinal, or continuous. Measurement validity and reliability determine the quality of everything that follows.',
        key: 'Validity is capturing what we intend. Reliability is consistency. One without the other is insufficient.' },
      { n: 3, title: 'Take a sample', chap: 'Chapters 4–5',
        body: 'Representative samples describe populations. Purposive samples maximize comparability. Study designs emerge from the logic of sampling.',
        key: 'Study designs are not labels to memorize. They follow from how we take a sample to answer our question.' },
      { n: 4, title: 'Estimate measures of association', chap: 'Chapter 6',
        body: 'Risk ratios, odds ratios, rate ratios, and risk differences each quantify the exposure-outcome relationship differently.',
        key: 'A point estimate without a confidence interval is a claim without a warranty.' },
      { n: 5, title: 'Evaluate whether the association is causal', chap: 'Chapters 7–10',
        body: 'Non-comparability arises through chance, measurement error, selection, and confounding. We address it through randomization, matching, stratification, and causal diagrams.',
        key: 'A cause is one marble in a jar. Disease occurs only when a sufficient cause is filled.' },
      { n: 6, title: 'Assess causes working together', chap: 'Chapter 11',
        body: 'When two exposures are component causes in the same sufficient cause, they interact. Interaction depends on scale — additive vs. multiplicative.',
        key: 'If two causes share a jar, addressing only one may be less effective than expected.' },
      { n: 7, title: 'Assess whether results matter beyond the study sample', chap: 'Chapter 12',
        body: 'External validity depends on the distribution of component causes across populations. This is where the consequentialist argument is tested.',
        key: 'There is not one causal effect for all populations. The effect is shaped by context.' }
    ];
    STEPS.forEach(function (s) {
      var item = document.createElement('div');
      item.className = 'acc-item';
      item.innerHTML =
        '<button class="acc-head" aria-expanded="false">' +
          '<span class="acc-head__num">' + s.n + '</span>' +
          '<span class="acc-head__title">' + s.title + '</span>' +
          '<span class="acc-head__chap">' + s.chap + '</span>' +
          '<span class="acc-head__plus">+</span>' +
        '</button>' +
        '<div class="acc-body">' +
          '<p>' + s.body + '</p>' +
          '<p class="key"><strong>Key concept:</strong> ' + s.key + '</p>' +
        '</div>';
      var btn = item.querySelector('.acc-head');
      btn.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.querySelector('.acc-head__plus').textContent = open ? '–' : '+';
      });
      grid.appendChild(item);
    });
  })();

  /* ============================================================
     TOOL 4 — Study Design Builder (7-step wizard)
     ============================================================ */
  (function studyBuilder() {
    var dotsEl = document.getElementById('builderDots');
    var bodyEl = document.getElementById('builderBody');
    var navEl = document.getElementById('builderNav');
    if (!bodyEl) return;

    var STEPS = [
      { q: 'What population?', hint: 'Define by geography, time, or characteristics.', type: 'text', placeholder: 'e.g., Adults 18–65 in St. Louis County', label: 'Population' },
      { q: 'What health indicator?', hint: 'What outcome to understand or prevent?', type: 'text', placeholder: 'e.g., New Type 2 diabetes diagnoses', label: 'Health Indicator' },
      { q: 'What exposure?', hint: 'The factor whose causal effect you want to estimate.', type: 'text', placeholder: 'e.g., Proximity to fast food outlets', label: 'Exposure' },
      { q: 'What study design?', hint: 'Each answers a different question.', type: 'options', options: ['Cross-sectional: snapshot at one time', 'Cohort: follow forward in time', 'Case-control: compare exposure histories'], label: 'Study Design' },
      { q: 'Sources of non-comparability?', hint: 'Factors differing between groups that could cause the outcome.', type: 'textarea', placeholder: 'e.g., Income, physical activity, healthcare access', label: 'Threats' },
      { q: 'How to address non-comparability?', hint: 'Primary strategy.', type: 'options', options: ['Randomization', 'Matching', 'Stratification', 'Statistical adjustment'], label: 'Strategy' },
      { q: 'Who else does this matter for?', hint: 'Where would the result hold? Where might it not?', type: 'textarea', placeholder: 'e.g., May not apply in rural populations...', label: 'External Validity' }
    ];
    var answers = new Array(STEPS.length).fill('');
    var current = 0;
    var done = false;

    function renderDots() {
      dotsEl.innerHTML = '';
      for (var i = 0; i < STEPS.length; i++) {
        var d = document.createElement('div');
        d.className = 'd' + (i === current && !done ? ' active' : '') + (i < current || done ? ' done' : '');
        dotsEl.appendChild(d);
      }
    }

    function renderStep() {
      renderDots();
      if (done) { renderSummary(); return; }
      var s = STEPS[current];
      var html = '<div class="builder__q">' + s.q + '</div><div class="builder__hint">' + s.hint + '</div>';
      if (s.type === 'text') {
        html += '<input type="text" id="bInput" placeholder="' + s.placeholder + '" value="' + escapeAttr(answers[current]) + '" />';
      } else if (s.type === 'textarea') {
        html += '<textarea id="bInput" placeholder="' + s.placeholder + '">' + escapeHtml(answers[current]) + '</textarea>';
      } else if (s.type === 'options') {
        html += '<div class="builder__opts" id="bOpts">';
        s.options.forEach(function (opt) {
          html += '<button class="builder__opt' + (answers[current] === opt ? ' sel' : '') + '" data-opt="' + escapeAttr(opt) + '">' + opt + '</button>';
        });
        html += '</div>';
      }
      bodyEl.innerHTML = html;

      if (s.type === 'options') {
        bodyEl.querySelectorAll('.builder__opt').forEach(function (b) {
          b.addEventListener('click', function () {
            answers[current] = b.dataset.opt;
            bodyEl.querySelectorAll('.builder__opt').forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
          });
        });
      } else {
        var inp = document.getElementById('bInput');
        inp.addEventListener('input', function () { answers[current] = inp.value; });
      }

      navEl.innerHTML = '';
      if (current > 0) {
        var back = mkBtn('Back', 'btn');
        back.addEventListener('click', function () { current--; renderStep(); });
        navEl.appendChild(back);
      } else { navEl.appendChild(document.createElement('span')); }
      var next = mkBtn(current === STEPS.length - 1 ? 'See Your Study' : 'Next', 'btn btn--signal');
      next.addEventListener('click', function () {
        if (current === STEPS.length - 1) { done = true; renderStep(); }
        else { current++; renderStep(); }
      });
      navEl.appendChild(next);
    }

    function renderSummary() {
      var html = '<div class="builder__summary"><h3>Your Study of Consequence</h3><dl>';
      STEPS.forEach(function (s, i) {
        html += '<div class="summary-row"><dt>' + s.label + '</dt><dd>' + (answers[i] ? escapeHtml(answers[i]) : '<span class="muted">—</span>') + '</dd></div>';
      });
      html += '</dl></div>';
      bodyEl.innerHTML = html;
      navEl.innerHTML = '';
      var reset = mkBtn('Start Over', 'btn');
      reset.addEventListener('click', function () {
        answers = new Array(STEPS.length).fill(''); current = 0; done = false; renderStep();
      });
      navEl.appendChild(document.createElement('span'));
      navEl.appendChild(reset);
    }

    function mkBtn(txt, cls) { var b = document.createElement('button'); b.className = cls; b.textContent = txt; return b; }
    function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

    renderStep();
  })();

  /* ---------- Mobile nav + smooth scroll ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (links) links.classList.remove('is-open');
    });
  });
})();
