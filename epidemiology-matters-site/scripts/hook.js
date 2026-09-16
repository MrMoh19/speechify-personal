/* =====================================================
   Epidemiology Matters — Playable hero hook
   "Does coffee cause heart attacks? You decide."
   A 60-second guided reveal of confounding, in plain language.
   No epi vocabulary required. Self-contained.
   ===================================================== */
(function () {
  'use strict';

  var root = document.getElementById('hook');
  if (!root) return;

  // ---- The tiny synthetic world -------------------------------------------
  // 240 people. Smoking is the hidden cause of BOTH heavy coffee drinking AND
  // heart attacks. Coffee itself does nothing. This is confounding, dramatized.
  var N = 240;
  var people = [];
  (function build() {
    // deterministic pseudo-random so the picture is stable across reloads
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var i = 0; i < N; i++) {
      var smoker = rnd() < 0.34;                       // 34% smoke
      // Smokers drink heavy coffee 78% of the time; non-smokers 25%.
      var coffee = rnd() < (smoker ? 0.78 : 0.25);
      // Heart attack risk driven by smoking ONLY. Coffee adds nothing.
      var baseRisk = smoker ? 0.42 : 0.07;
      var attack = rnd() < baseRisk;
      people.push({ i: i, smoker: smoker, coffee: coffee, attack: attack });
    }
  })();

  function pct(n, d) { return d === 0 ? 0 : Math.round((n / d) * 100); }
  function count(pred) { var c = 0; for (var i = 0; i < N; i++) if (pred(people[i])) c++; return c; }

  // Risk among heavy coffee drinkers vs light, ignoring smoking
  var coffeeAttack = count(function (p) { return p.coffee && p.attack; });
  var coffeeTotal = count(function (p) { return p.coffee; });
  var noCoffeeAttack = count(function (p) { return !p.coffee && p.attack; });
  var noCoffeeTotal = count(function (p) { return !p.coffee; });
  var riskCoffee = pct(coffeeAttack, coffeeTotal);
  var riskNoCoffee = pct(noCoffeeAttack, noCoffeeTotal);

  // Risk within smokers only, and within non-smokers only (the reveal)
  var smk = people.filter(function (p) { return p.smoker; });
  var non = people.filter(function (p) { return !p.smoker; });
  function riskBy(arr, coffeeVal) {
    var t = arr.filter(function (p) { return p.coffee === coffeeVal; });
    var a = t.filter(function (p) { return p.attack; });
    return pct(a.length, t.length);
  }
  var smkCoffeeRisk = riskBy(smk, true);
  var smkNoCoffeeRisk = riskBy(smk, false);
  var nonCoffeeRisk = riskBy(non, true);
  var nonNoCoffeeRisk = riskBy(non, false);

  // ---- Figure sprite (matches brand stick figure) -------------------------
  function figSVG() {
    return '<svg viewBox="0 0 48 96" aria-hidden="true">' +
      '<circle cx="24" cy="9" r="7"/>' +
      '<path d="M 14 19 L 19 17 L 29 17 L 34 19 L 39 30 L 41 48 L 37 49 L 35 30 L 33 50 L 31 92 L 27 92 L 25 58 L 23 58 L 21 92 L 17 92 L 15 50 L 13 30 L 11 49 L 7 48 L 9 30 Z"/></svg>';
  }

  // ---- Build the population grid ------------------------------------------
  var gridWrap = root.querySelector('#hookGrid');
  var cells = [];
  for (var i = 0; i < N; i++) {
    var c = document.createElement('span');
    c.className = 'hook-fig';
    c.innerHTML = figSVG();
    c.dataset.i = i;
    gridWrap.appendChild(c);
    cells.push(c);
  }

  function paint(mode) {
    for (var i = 0; i < N; i++) {
      var p = people[i], el = cells[i];
      el.className = 'hook-fig';
      if (mode === 'coffee') {
        // color by coffee habit
        if (p.coffee) el.classList.add('is-coffee');
      } else if (mode === 'attack-naive') {
        // heavy coffee drinkers who had an attack glow red
        if (p.coffee && p.attack) el.classList.add('is-attack');
        else if (p.coffee) el.classList.add('is-coffee-soft');
      } else if (mode === 'smoke') {
        if (p.smoker) el.classList.add('is-smoker');
      } else if (mode === 'truth') {
        if (p.smoker && p.attack) el.classList.add('is-attack');
        else if (p.smoker) el.classList.add('is-smoker');
        else if (p.attack) el.classList.add('is-attack-mild');
      }
    }
  }

  // ---- The scripted steps -------------------------------------------------
  var steps = [
    {
      eyebrow: 'The claim',
      title: 'Does coffee cause heart attacks?',
      body: 'Here are ' + N + ' people from the town of Farrlandia. Some are heavy coffee drinkers. Let\u2019s find out.',
      mode: 'coffee',
      legend: [['is-coffee', 'Heavy coffee drinker'], ['plain', 'Light / no coffee']],
      cta: 'Look at who had a heart attack',
      choice: null
    },
    {
      eyebrow: 'The suspicious pattern',
      title: 'Coffee drinkers really do have more heart attacks',
      body: 'Among heavy coffee drinkers, <strong>' + riskCoffee + '%</strong> had a heart attack. Among everyone else, only <strong>' + riskNoCoffee + '%</strong> did. That\u2019s a big gap. So \u2014 case closed?',
      mode: 'attack-naive',
      legend: [['is-attack', 'Coffee drinker, had attack'], ['is-coffee-soft', 'Coffee drinker, no attack'], ['plain', 'Everyone else']],
      cta: null,
      choice: {
        prompt: 'What\u2019s your verdict?',
        options: [
          { label: 'Coffee is the culprit', reveal: 'wrong' },
          { label: 'Something else is going on', reveal: 'right' }
        ]
      }
    },
    {
      eyebrow: 'The hidden third thing',
      title: 'Meet the smokers',
      body: 'Watch what happens when we color the same people by whether they smoke. Notice anything? Smokers are almost all the same people who drink heavy coffee \u2014 and smoking is the real driver of heart attacks.',
      mode: 'smoke',
      legend: [['is-smoker', 'Smoker'], ['plain', 'Non-smoker']],
      cta: 'Separate the smokers from the non-smokers',
      choice: null
    },
    {
      eyebrow: 'The reveal',
      title: 'Coffee did nothing. Smoking did everything.',
      body: 'Split the town in two. Among <strong>smokers</strong>, coffee drinkers and non-drinkers have almost the same risk (' + smkCoffeeRisk + '% vs ' + smkNoCoffeeRisk + '%). Among <strong>non-smokers</strong>, same story (' + nonCoffeeRisk + '% vs ' + nonNoCoffeeRisk + '%). Once you account for smoking, coffee\u2019s \u201Ceffect\u201D vanishes.',
      mode: 'truth',
      legend: [['is-smoker', 'Smoker'], ['is-attack', 'Smoker, had attack'], ['is-attack-mild', 'Non-smoker, had attack'], ['plain', 'Non-smoker, no attack']],
      cta: null,
      choice: null,
      finale: true
    }
  ];

  var step = 0;
  var elEyebrow = root.querySelector('#hookEyebrow');
  var elTitle = root.querySelector('#hookTitle');
  var elBody = root.querySelector('#hookBody');
  var elLegend = root.querySelector('#hookLegend');
  var elAction = root.querySelector('#hookAction');
  var elProgress = root.querySelector('#hookProgress');
  var elSplit = root.querySelector('#hookSplit');

  // progress dots
  for (var s = 0; s < steps.length; s++) {
    var d = document.createElement('span');
    d.className = 'hook-dot';
    elProgress.appendChild(d);
  }
  var dots = elProgress.querySelectorAll('.hook-dot');

  function legendHTML(items) {
    return items.map(function (it) {
      return '<span class="hook-leg"><i class="hook-sw ' + it[0] + '"></i>' + it[1] + '</span>';
    }).join('');
  }

  function render() {
    var st = steps[step];
    elEyebrow.textContent = st.eyebrow;
    elTitle.innerHTML = st.title;
    elBody.innerHTML = st.body;
    elLegend.innerHTML = legendHTML(st.legend);
    for (var k = 0; k < dots.length; k++) {
      dots[k].classList.toggle('is-on', k <= step);
    }

    // split-view: on the final step, show two mini-grids side by side
    elSplit.classList.toggle('show', !!st.finale);

    paint(st.mode);
    if (st.finale) buildSplit();

    // action zone
    elAction.innerHTML = '';
    if (st.choice) {
      var wrap = document.createElement('div');
      wrap.className = 'hook-choice';
      var q = document.createElement('p');
      q.className = 'hook-choice__q';
      q.textContent = st.choice.prompt;
      wrap.appendChild(q);
      var row = document.createElement('div');
      row.className = 'hook-choice__row';
      st.choice.options.forEach(function (opt) {
        var b = document.createElement('button');
        b.className = 'hook-choice__btn';
        b.textContent = opt.label;
        b.addEventListener('click', function () {
          var msg = document.createElement('p');
          msg.className = 'hook-choice__fb ' + (opt.reveal === 'right' ? 'good' : 'oops');
          msg.innerHTML = opt.reveal === 'right'
            ? 'Good instinct. A gap this big almost always has something hiding behind it. Let\u2019s find it.'
            : 'That\u2019s the trap most headlines fall into. The gap is real \u2014 but the cause might not be coffee. Keep going.';
          row.querySelectorAll('.hook-choice__btn').forEach(function (x) { x.disabled = true; x.classList.add('done'); });
          b.classList.add('picked');
          wrap.appendChild(msg);
          var next = mkNext('Reveal the hidden cause');
          wrap.appendChild(next);
        });
        row.appendChild(b);
      });
      wrap.appendChild(row);
      elAction.appendChild(wrap);
    } else if (st.cta) {
      elAction.appendChild(mkNext(st.cta));
    } else if (st.finale) {
      var done = document.createElement('div');
      done.className = 'hook-finale';
      done.innerHTML =
        '<p class="hook-finale__lead">You just did epidemiology.</p>' +
        '<p class="hook-finale__sub">That hidden third thing has a name: a <strong>confounder</strong>. Spotting it is the difference between a scary headline and the truth. There are five more traps like this waiting for you.</p>' +
        '<div class="hook-finale__row">' +
          '<a class="btn btn--signal" href="lab/index.html">Play the Causal Lab <span class="arrow"></span></a>' +
          '<a class="btn" href="farrlandia/index.html">Meet all of Farrlandia</a>' +
          '<button class="hook-replay" id="hookReplay">Replay from the top</button>' +
        '</div>';
      elAction.appendChild(done);
      var rp = done.querySelector('#hookReplay');
      rp.addEventListener('click', function () { step = 0; render(); scrollHookIntoView(); });
    }
  }

  function mkNext(label) {
    var b = document.createElement('button');
    b.className = 'btn btn--signal hook-next';
    b.innerHTML = label + ' <span class="arrow"></span>';
    b.addEventListener('click', function () {
      if (step < steps.length - 1) { step++; render(); scrollHookIntoView(); }
    });
    return b;
  }

  function scrollHookIntoView() {
    // keep the stage in view on small screens without yanking on desktop
    if (window.innerWidth < 760) {
      var top = root.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  // ---- Split view (two towns, smokers vs non) -----------------------------
  var splitBuilt = false;
  function buildSplit() {
    if (splitBuilt) return;
    splitBuilt = true;
    var left = elSplit.querySelector('#splitSmk');
    var right = elSplit.querySelector('#splitNon');
    function fill(container, arr) {
      arr.forEach(function (p) {
        var c = document.createElement('span');
        c.className = 'hook-fig sm' + (p.attack ? ' is-attack' : (p.smoker ? ' is-smoker' : ''));
        c.innerHTML = figSVG();
        container.appendChild(c);
      });
    }
    fill(left, smk);
    fill(right, non);
    left.parentElement.querySelector('.hook-split__stat').innerHTML =
      'Coffee ' + smkCoffeeRisk + '% &middot; No coffee ' + smkNoCoffeeRisk + '%';
    right.parentElement.querySelector('.hook-split__stat').innerHTML =
      'Coffee ' + nonCoffeeRisk + '% &middot; No coffee ' + nonNoCoffeeRisk + '%';
  }

  render();
})();
