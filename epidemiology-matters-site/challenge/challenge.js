/* The Farrlandia Challenge — level engine.
   Data: window.__CHALLENGE__ (generated; see epidemiology-matters-data/). */
(function () {
  'use strict';
  var D = window.__CHALLENGE__;
  if (!D) return;

  // ---------- derived figures ----------
  var pump = D.suspects[0];
  var pumpAR = pump.expCases / pump.expN;
  var muniAR = pump.unexpCases / pump.unexpN;
  var pumpRR = pumpAR / muniAR;
  var snow = D.districts[0];
  var snowAR = 100 * snow.cases / snow.pop;
  var peakDay = D.curve.indexOf(Math.max.apply(null, D.curve)) + 1;
  var sesLow = D.pumpBySes.low;
  var lowRR = (sesLow.pumpCases / sesLow.pumpN) / (sesLow.muniCases / sesLow.muniN);
  var pumpEarly = pump.expCases - D.pumpLate;

  // ---------- state ----------
  var KEY = 'em-challenge-v1';
  var state = { scores: {}, done: [] };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved && saved.scores) state = saved; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function totalScore() { var t = 0; Object.keys(state.scores).forEach(function (k) { t += state.scores[k]; }); return t; }

  // ---------- helpers ----------
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d; }
  function fmtPct(x) { return (100 * x).toFixed(1) + '%'; }

  function curveSVG(values, highlight) {
    var w = 760, h = 230, pad = 34;
    var max = Math.max.apply(null, values);
    var bw = (w - pad - 10) / values.length;
    var bars = values.map(function (v, i) {
      var bh = v / max * (h - pad - 20);
      var x = pad + i * bw, y = h - pad - bh;
      var red = highlight && (i + 1) === highlight;
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw - 1.5).toFixed(1) +
        '" height="' + bh.toFixed(1) + '" fill="' + (red ? '#cb493c' : '#d9e0e6') + '"/>';
    }).join('');
    var ticks = '';
    for (var t = 7; t <= values.length; t += 7) {
      ticks += '<text x="' + (pad + (t - 0.5) * bw).toFixed(1) + '" y="' + (h - pad + 16) +
        '" font-size="10" font-family="JetBrains Mono,monospace" fill="#5b6066" text-anchor="middle">' + t + '</text>';
    }
    return '<svg class="ch-curve" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Epidemic curve, cases by day of onset">' +
      '<line x1="' + pad + '" y1="' + (h - pad) + '" x2="' + (w - 8) + '" y2="' + (h - pad) + '" stroke="#0a0a0a" stroke-width="1"/>' +
      bars + ticks +
      '<text x="' + ((w + pad) / 2) + '" y="' + (h - 4) + '" font-size="10" font-family="JetBrains Mono,monospace" letter-spacing="2" fill="#5b6066" text-anchor="middle">DAY OF ONSET</text></svg>';
  }

  function districtTable() {
    var rows = D.districts.map(function (d) {
      return '<tr><td>' + d.name + '</td><td>' + d.pop.toLocaleString() + '</td><td>' + d.cases + '</td><td>?</td></tr>';
    }).join('');
    return '<table class="ch-table"><thead><tr><th>District</th><th>Population</th><th>Cases</th><th>Attack rate</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function suspectsTable() {
    var rows = D.suspects.map(function (s) {
      return '<tr><td>' + s.label + '</td><td>' + s.expCases + ' / ' + s.expN.toLocaleString() + '</td><td>' +
        s.unexpCases + ' / ' + s.unexpN.toLocaleString() + '</td><td>?</td></tr>';
    }).join('');
    return '<table class="ch-table"><thead><tr><th>Exposure</th><th>Cases / exposed</th><th>Cases / unexposed</th><th>Risk ratio</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function stratTable() {
    function row(label, g) {
      return '<tr><td>' + label + '</td><td>' + g.pumpCases + ' / ' + g.pumpN.toLocaleString() + '</td><td>' +
        g.muniCases + ' / ' + g.muniN.toLocaleString() + '</td><td>?</td></tr>';
    }
    return '<table class="ch-table"><thead><tr><th>Stratum</th><th>Cases / pump users</th><th>Cases / municipal</th><th>Risk ratio</th></tr></thead><tbody>' +
      row('Low SES (1–2)', D.pumpBySes.low) + row('Higher SES (3–5)', D.pumpBySes.high) + '</tbody></table>';
  }

  // ---------- level definitions ----------
  var LEVELS = [
    {
      id: 1, name: 'The alarm', skill: 'Describe: time',
      memo: '<p>Day 42. Since the first report, clinics across Farrlandia have logged <strong>' + D.totalCases + ' cases</strong> of acute gastrointestinal illness; ' + D.severe + ' were severe. The Ministry has opened an investigation and assigned it to you.</p><p>Every investigation starts the same way: put the cases in time.</p>',
      panel: function () { return curveSVG(D.curve); },
      questions: [
        { type: 'num', text: 'On which day of the outbreak did new cases peak?', answer: peakDay, tol: 0,
          hint: 'Find the tallest bar; count the days along the axis.',
          ok: 'Day ' + peakDay + ', with ' + Math.max.apply(null, D.curve) + ' new cases.' },
        { type: 'choice', text: 'What does the shape of this curve suggest?',
          options: ['A single wave from one common source', 'A steady endemic background', 'Repeated waves from person-to-person spread'],
          answer: 0, hint: 'One rise, one peak, one fall.',
          ok: 'One rise and one fall: the signature of a common source.' }
      ]
    },
    {
      id: 2, name: 'Person, place, time', skill: 'Describe: place',
      memo: '<p>The cases have addresses. Farrlandia has five districts and a census, so you can do what a clinician cannot: divide cases by the people at risk.</p>',
      panel: districtTable,
      questions: [
        { type: 'num', text: 'What is the attack rate in Snow, as a percentage to one decimal?', answer: Math.round(snowAR * 10) / 10, tol: 0.3,
          hint: 'Cases in Snow divided by the population of Snow, times 100.',
          ok: fmtPct(snow.cases / snow.pop) + ' in Snow, against roughly 3% everywhere else.' },
        { type: 'choice', text: 'Where does the outbreak live?',
          options: ['Snow', 'Nightingale', 'Hill', 'Spread evenly across Farrlandia'],
          answer: 0, hint: 'Compare attack rates, not case counts.',
          ok: 'Snow. One district in five holds most of the outbreak.' }
      ]
    },
    {
      id: 3, name: 'The suspects', skill: 'Estimate associations',
      memo: '<p>Four exposures are on your desk, each proposed by someone certain of it. The census gives you the exposed and unexposed populations; the case files give you the rest.</p><p>Compute before you accuse.</p>',
      panel: suspectsTable,
      questions: [
        { type: 'num', text: 'What is the risk ratio for drinking from the Snow Pump? (One decimal is fine.)', answer: Math.round(pumpRR * 10) / 10, tol: 2,
          hint: 'Attack rate among pump users divided by attack rate among everyone else.',
          ok: 'About ' + pumpRR.toFixed(1) + '. ' + fmtPct(pumpAR) + ' of pump users fell ill, against ' + fmtPct(muniAR) + ' of everyone else.' },
        { type: 'choice', text: 'Who is your prime suspect?',
          options: ['The Snow Pump', 'Factory work', 'Poverty', 'Air pollution'],
          answer: 0, hint: 'Three of these are strong associations. Only one is an order of magnitude stronger.',
          ok: 'The pump, at a risk ratio near ' + pumpRR.toFixed(0) + '. The factory association is real but modest, and you are about to find out why it exists at all.' }
      ]
    },
    {
      id: 4, name: 'The trap', skill: 'Evaluate causality',
      memo: '<p>Before you file the accusation, a colleague reminds you of last year. The census showed pump users with a third more heart disease, and adjustment acquitted the pump: its users were simply poorer. The same trap may be open at your feet.</p><p>So compare like with like. Split the population by socioeconomic position and compute the pump risk ratio inside each stratum.</p>',
      panel: stratTable,
      questions: [
        { type: 'num', text: 'What is the pump risk ratio within the low-SES stratum alone?', answer: Math.round(lowRR * 10) / 10, tol: 3,
          hint: 'Within low SES only: pump attack rate over municipal attack rate.',
          ok: 'About ' + lowRR.toFixed(1) + ' among low-SES residents, and the higher-SES stratum tells the same story.' },
        { type: 'choice', text: 'Your conclusion?',
          options: ['The association survives adjustment: the pump is the likely source', 'Confounded by poverty again: the pump is innocent', 'The data cannot distinguish the two'],
          answer: 0, hint: 'Last year the stratified risk ratios collapsed toward 1. Look at what they do now.',
          ok: 'It survives. Last year adjustment dissolved the association; this year it does not. Same pump, same method, opposite verdict: that is the method working.' }
      ]
    },
    {
      id: 5, name: 'The intervention', skill: 'Counterfactual thinking',
      memo: '<p>On your recommendation the Ministry sealed the Snow Pump at the end of day 9 and posted a boil-water notice across Snow.</p><p>Of the ' + pump.expCases + ' pump-user cases in total, ' + pumpEarly + ' fell ill before day 10.</p>',
      panel: function () { return curveSVG(D.curve, peakDay); },
      questions: [
        { type: 'num', text: 'How many pump-user cases had their onset on day 10 or later?', answer: D.pumpLate, tol: 0,
          hint: 'Total pump-user cases minus those with onset before day 10.',
          ok: D.pumpLate + ' cases, and the curve did not peak until day ' + peakDay + ', five days after the pump closed.' },
        { type: 'choice', text: 'How many of those ' + D.pumpLate + ' late cases did sealing the pump actually prevent?',
          options: ['Only infections acquired after day 9; most late cases were already incubating', 'Nearly all of them', 'None; sealing was pointless'],
          answer: 0, hint: 'Onset follows exposure after an incubation period. When were these people exposed?',
          ok: 'Onset lags exposure. Most late cases drank contaminated water before day 10 and were already incubating when the pump closed. Sealing it was still right: it ended new exposure.' }
      ]
    },
    {
      id: 6, name: 'The report', skill: 'Synthesis',
      memo: '<p>The Ministry wants your report. Five questions, no tables: this round is from memory and judgement.</p>',
      panel: function () { return ''; },
      questions: [
        { type: 'choice', text: 'The study you just ran most resembles a:',
          options: ['Retrospective cohort study', 'Randomized trial', 'Case series', 'Ecological comparison'],
          answer: 0, hint: 'You had exposure and outcome for every resident, looking backward.',
          ok: 'A retrospective cohort: full population, exposure and outcome on everyone.' },
        { type: 'choice', text: 'Factory work showed a risk ratio above 4. Why?',
          options: ['Factory workers live in Snow and drink from the pump', 'Factory dust causes gastrointestinal illness', 'Chance'],
          answer: 0, hint: 'Think about where the factories are.',
          ok: 'Residence and water source do the work. The factory was a confounded bystander.' },
        { type: 'choice', text: 'Last year the pump was associated with heart disease; this year with the outbreak. What separated the two verdicts?',
          options: ['Stratification: one association vanished on adjustment, the other survived', 'Sample size', 'Last year used the wrong measure of association'],
          answer: 0, hint: 'The method was identical both times. The results were not.',
          ok: 'The comparison, fairly made, acquitted the pump once and convicted it once.' },
        { type: 'choice', text: 'Cases kept appearing for weeks after the pump closed. The best explanation:',
          options: ['Incubation: infections acquired before closure surfaced afterward', 'The boil-water notice caused panic reporting', 'The pump was not the source after all'],
          answer: 0, hint: 'Level five is still fresh.',
          ok: 'Exposure stopped on day 9; disease kept its own calendar.' },
        { type: 'choice', text: 'Your final line for the Ministry:',
          options: ['A common-source outbreak, vehicle the Snow Pump; sealed day 9; surveillance to continue through two incubation periods', 'An airborne outbreak centred on the factories of Snow', 'An endemic rise explained by poverty'],
          answer: 0, hint: 'Say what happened, what was done, and what to watch.',
          ok: 'Filed. The Ministry accepts your report.' }
      ]
    }
  ];

  // ---------- engine ----------
  var home = document.getElementById('chHome');
  var stage = document.getElementById('chStage');
  var mapEl = document.getElementById('chMap');

  function rankFor(score) {
    if (score >= 560) return 'Chief Epidemiologist · Farr Medal';
    if (score >= 480) return 'Senior Epidemiologist';
    if (score >= 380) return 'Field Investigator';
    return 'Trainee Investigator';
  }

  function renderMap() {
    var html = '';
    LEVELS.forEach(function (L, i) {
      var done = state.done.indexOf(L.id) > -1;
      var open = done || i === 0 || state.done.indexOf(LEVELS[i - 1].id) > -1;
      var cls = done ? 'is-done' : (open ? 'is-open' : 'is-locked');
      html += '<div class="ch-level ' + cls + '">' +
        '<span class="ch-level__num">' + (done ? '✓' : L.id) + '</span>' +
        '<span class="ch-level__name">' + L.name + '</span>' +
        '<span class="ch-level__meta">' + L.skill + (done ? ' · ' + state.scores[L.id] + ' pts' : '') + '</span>' +
        (open ? '<button class="btn btn--signal" data-level="' + L.id + '">' + (done ? 'Replay' : 'Start') + '</button>' : '<span class="ch-level__meta">locked</span>') +
        '</div>';
    });
    var total = totalScore();
    if (state.done.length) {
      html += '<div class="ch-level"><span class="ch-level__num"></span><span class="ch-level__name">Score so far</span><span class="ch-level__meta">' + total + ' / 600 · ' + rankFor(total) + '</span>' +
        (state.done.length === LEVELS.length ? '<button class="btn" id="chCert">Certificate</button>' : '') + '</div>';
    }
    mapEl.innerHTML = html;
    mapEl.querySelectorAll('[data-level]').forEach(function (b) {
      b.addEventListener('click', function () { playLevel(parseInt(b.dataset.level, 10)); });
    });
    var cert = document.getElementById('chCert');
    if (cert) cert.addEventListener('click', showCertificate);
  }

  function playLevel(id) {
    var L = LEVELS.filter(function (x) { return x.id === id; })[0];
    var score = 100, qIndex = 0, hintUsed = false;
    home.classList.add('is-off');
    stage.classList.add('is-on');

    function renderQ() {
      var Q = L.questions[qIndex];
      var head = '<div class="ch-hud"><span>Level ' + L.id + ' · ' + L.name + ' · question ' + (qIndex + 1) + ' of ' + L.questions.length + '</span><span class="score">' + score + ' pts at stake</span></div>' +
        '<div class="memo"><span class="memo__tag">Field memo</span>' + L.memo + '</div>' +
        (typeof L.panel === 'function' ? L.panel() : '');
      var qh = '<div class="ch-q"><div class="ch-q__text">' + Q.text + '</div>';
      if (Q.type === 'num') {
        qh += '<div class="ch-input-row"><input class="ch-num" type="number" step="any" id="chAns" aria-label="Your answer" />' +
          '<button class="btn btn--signal" id="chGo">Check</button>' +
          '<button class="ch-hint" id="chHint">Hint (−20)</button></div>';
      } else {
        qh += Q.options.map(function (o, i) { return '<button class="ch-choice" data-i="' + i + '">' + o + '</button>'; }).join('') +
          '<button class="ch-hint" id="chHint">Hint (−20)</button>';
      }
      qh += '<div class="ch-hint-text" id="chHintText">' + Q.hint + '</div><div class="ch-feedback" id="chFb"></div><div class="ch-next"></div></div>';
      stage.innerHTML = head + qh;

      var fb = document.getElementById('chFb');
      var hintBtn = document.getElementById('chHint');
      hintBtn.addEventListener('click', function () {
        if (!hintUsed) { score = Math.max(40, score - 20); hintUsed = true; }
        document.getElementById('chHintText').classList.add('is-on');
        renderHud();
      });
      function renderHud() {
        stage.querySelector('.ch-hud .score').textContent = score + ' pts at stake';
      }
      function advance(okText) {
        fb.className = 'ch-feedback ok';
        fb.textContent = okText;
        var next = stage.querySelector('.ch-next');
        var last = qIndex === L.questions.length - 1;
        next.innerHTML = '<button class="btn btn--signal" id="chNext">' + (last ? 'Complete level' : 'Next question') + ' →</button>';
        document.getElementById('chNext').addEventListener('click', function () {
          if (last) {
            state.scores[L.id] = score;
            if (state.done.indexOf(L.id) === -1) state.done.push(L.id);
            save();
            backHome();
          } else { qIndex += 1; hintUsed = false; renderQ(); }
        });
      }
      function wrong(msg) {
        score = Math.max(40, score - 15);
        renderHud();
        fb.className = 'ch-feedback no';
        fb.textContent = msg || 'Not yet. Check the arithmetic and try again.';
      }
      if (Q.type === 'num') {
        var go = document.getElementById('chGo');
        var input = document.getElementById('chAns');
        function checkNum() {
          var v = parseFloat(input.value);
          if (isNaN(v)) { fb.className = 'ch-feedback no'; fb.textContent = 'Enter a number.'; return; }
          if (Math.abs(v - Q.answer) <= Q.tol) advance(Q.ok);
          else wrong();
        }
        go.addEventListener('click', checkNum);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkNum(); });
        input.focus();
      } else {
        stage.querySelectorAll('.ch-choice').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var i = parseInt(btn.dataset.i, 10);
            if (i === Q.answer) {
              btn.classList.add('is-right');
              stage.querySelectorAll('.ch-choice').forEach(function (b) { b.disabled = true; });
              advance(Q.ok);
            } else { btn.classList.add('is-wrong'); btn.disabled = true; wrong(); }
          });
        });
      }
      window.scrollTo({ top: 0 });
    }

    renderQ();
  }

  function backHome() {
    stage.classList.remove('is-on');
    stage.innerHTML = '';
    home.classList.remove('is-off');
    renderMap();
    window.scrollTo({ top: 0 });
  }

  function showCertificate() {
    var total = totalScore();
    home.classList.add('is-off');
    stage.classList.add('is-on');
    stage.innerHTML =
      '<div class="cert"><p class="mono">Farrlandia Ministry of Health · Field Epidemiology Service</p>' +
      '<h2>Certificate of Investigation</h2>' +
      '<p>This certifies that</p>' +
      '<input id="certName" placeholder="your name" aria-label="Your name" />' +
      '<p>completed the investigation of the Snow Pump outbreak,<br/>all six levels, with a score of <strong>' + total + ' / 600</strong>.</p>' +
      '<h2 class="rank">' + rankFor(total) + '</h2>' +
      '<p class="mono">' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ' · epidemiologymatters.com/challenge</p></div>' +
      '<div class="ch-next no-print"><button class="btn btn--signal" onclick="window.print()">Print</button> ' +
      '<button class="btn" id="chBack">Back to levels</button></div>';
    document.getElementById('chBack').addEventListener('click', backHome);
  }

  renderMap();

  // mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navlinks');
  if (toggle && links) toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();
