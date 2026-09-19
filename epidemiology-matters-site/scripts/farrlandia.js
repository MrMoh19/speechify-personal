/* ============================================================
   Farrlandia — The People of Farrlandia
   A 1,000-person simple random sample of the 10,000-person Farrlandia Census (see scripts/farr-data.js).
   Columns: [id, age, sex, dist, ses, smoke, poll, diet, inact, alc, iso, cvd, dep, lc, py]
   ============================================================ */
(function () {
  'use strict';

  // ---- Embedded dataset (RAW injected below) ----
  var RAW = window.__FARR_RAW__ || [];

  var DISTRICTS = ['', 'Snow', 'Nightingale', 'Hill', 'Doll', 'Rose'];

  // Column indices
  var C = { id: 0, age: 1, sex: 2, dist: 3, ses: 4, smoking: 5, air_pollution: 6,
            poor_diet: 7, physical_inactivity: 8, heavy_alcohol: 9, social_isolation: 10,
            cvd: 11, depression: 12, lung_cancer: 13, py: 14 };

  // Build person objects with derived fields
  var PEOPLE = RAW.map(function (r) {
    var p = {
      id: r[0], age: r[1], sex: r[2], dist: r[3], ses: r[4],
      smoking: r[5], air_pollution: r[6], poor_diet: r[7],
      physical_inactivity: r[8], heavy_alcohol: r[9], social_isolation: r[10],
      cvd: r[11], depression: r[12], lung_cancer: r[13], py: r[14]
    };
    p.any_disease = (p.cvd || p.depression || p.lung_cancer) ? 1 : 0;
    p.sex_label = p.sex === 1 ? 'Female' : 'Male';
    p.district_label = DISTRICTS[p.dist] || '';
    p.ses_group = p.ses <= 2 ? 'Low' : (p.ses === 3 ? 'Mid' : 'High');
    return p;
  });

  // ---- State ----
  var state = {
    colorBy: 'disease',
    exposure: '',
    outcome: 'any_disease',
    stratify: '',
    filters: [], // array of filter keys
    plain: true  // plain-language mode on by default
  };

  var FILTER_LABELS = {
    sex_1: 'Female', sex_0: 'Male', ses_low: 'Low SES', ses_high: 'High SES',
    smoke_1: 'Smokers', smoke_0: 'Non-smokers', poll_1: 'High Pollution',
    age_young: 'Age <45', age_old: 'Age 45+'
  };

  function passesFilter(p, key) {
    switch (key) {
      case 'sex_1': return p.sex === 1;
      case 'sex_0': return p.sex === 0;
      case 'ses_low': return p.ses <= 2;
      case 'ses_high': return p.ses >= 4;
      case 'smoke_1': return p.smoking === 1;
      case 'smoke_0': return p.smoking === 0;
      case 'poll_1': return p.air_pollution === 1;
      case 'age_young': return p.age < 45;
      case 'age_old': return p.age >= 45;
      default: return true;
    }
  }

  function filtered() {
    return PEOPLE.filter(function (p) {
      return state.filters.every(function (f) { return passesFilter(p, f); });
    });
  }

  // ---- Color logic ----
  var SES_COLORS = { 1: '#a8362a', 2: '#cb493c', 3: '#c4a35a', 4: '#7d9a86', 5: '#5b7b6a' };
  var DIST_COLORS = { 1: '#cb493c', 2: '#6b7db3', 3: '#c4a35a', 4: '#5b7b6a', 5: '#9b6b9e' };

  function colorFor(p) {
    var grey = 'var(--pop-grey-deep)';
    var signal = 'var(--signal)';
    switch (state.colorBy) {
      case 'disease': return p.any_disease ? signal : grey;
      case 'cvd': return p.cvd ? signal : grey;
      case 'depression': return p.depression ? signal : grey;
      case 'lung_cancer': return p.lung_cancer ? signal : grey;
      case 'smoking': return p.smoking ? signal : grey;
      case 'ses': return SES_COLORS[p.ses] || grey;
      case 'district': return DIST_COLORS[p.dist] || grey;
      default: return grey;
    }
  }

  function legendItems() {
    switch (state.colorBy) {
      case 'disease': return [['var(--signal)', 'Has disease'], ['var(--pop-grey-deep)', 'No disease']];
      case 'cvd': return [['var(--signal)', 'CVD'], ['var(--pop-grey-deep)', 'No CVD']];
      case 'depression': return [['var(--signal)', 'Depression'], ['var(--pop-grey-deep)', 'No depression']];
      case 'lung_cancer': return [['var(--signal)', 'Lung cancer'], ['var(--pop-grey-deep)', 'No lung cancer']];
      case 'smoking': return [['var(--signal)', 'Smoker'], ['var(--pop-grey-deep)', 'Non-smoker']];
      case 'ses': return [['#a8362a', 'SES 1'], ['#cb493c', 'SES 2'], ['#c4a35a', 'SES 3'], ['#7d9a86', 'SES 4'], ['#5b7b6a', 'SES 5']];
      case 'district': return [['#cb493c', 'Snow'], ['#6b7db3', 'Nightingale'], ['#c4a35a', 'Hill'], ['#5b7b6a', 'Doll'], ['#9b6b9e', 'Rose']];
      default: return [];
    }
  }

  // ---- Stats helpers ----
  function pct(n, d) { return d === 0 ? '0.0' : (n / d * 100).toFixed(1); }

  function prevalence(rows, field) {
    var n = rows.filter(function (p) { return p[field] === 1; }).length;
    return { n: n, total: rows.length, pct: pct(n, rows.length) };
  }

  function twoBytwo(rows, exp, out) {
    var a = 0, b = 0, c = 0, d = 0;
    rows.forEach(function (p) {
      var e = p[exp] === 1, o = p[out] === 1;
      if (e && o) a++; else if (e && !o) b++; else if (!e && o) c++; else d++;
    });
    var re = (a + b) === 0 ? 0 : a / (a + b);
    var ru = (c + d) === 0 ? 0 : c / (c + d);
    var rr = ru === 0 ? null : re / ru;
    var rd = re - ru;
    return { a: a, b: b, c: c, d: d, re: re, ru: ru, rr: rr, rd: rd };
  }

  // ---- Rendering: population dot grid (SVG) ----
  function renderPop() {
    var rows = filtered();
    var container = document.getElementById('popContainer');
    var cols = 40;
    var cell = 9, r = 3.4;
    var rowsN = Math.ceil(rows.length / cols);
    var w = cols * cell;
    var h = rowsN * cell;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('class', 'popdots');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Population of ' + rows.length + ' Farrlandians');

    rows.forEach(function (p, i) {
      var cx = (i % cols) * cell + cell / 2;
      var cy = Math.floor(i / cols) * cell + cell / 2;
      var dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
      dot.setAttribute('r', r);
      dot.setAttribute('fill', colorFor(p));
      dot.setAttribute('class', 'farr-dot');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', 'Farrlandian ' + p.id + ', click for profile');
      dot.addEventListener('mouseenter', function (ev) { showTip(ev, p); });
      dot.addEventListener('mousemove', function (ev) { moveTip(ev); });
      dot.addEventListener('mouseleave', hideTip);
      dot.addEventListener('click', function () { openProfile(p); });
      dot.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openProfile(p); }
      });
      svg.appendChild(dot);
    });
    container.innerHTML = '';
    container.appendChild(svg);

    document.getElementById('popCount').textContent = 'Showing ' + rows.length + ' Farrlandians';

    // legend
    var legend = document.getElementById('popLegend');
    legend.innerHTML = legendItems().map(function (it) {
      return '<span><span class="dot" style="background:' + it[0] + ';"></span>' + it[1] + '</span>';
    }).join('');
  }

  // ---- Tooltip ----
  var tip = document.getElementById('tooltip');
  function showTip(ev, p) {
    var dis = [];
    if (p.cvd) dis.push('CVD');
    if (p.depression) dis.push('Depression');
    if (p.lung_cancer) dis.push('Lung Cancer');
    var exps = [];
    if (p.smoking) exps.push('Smoking');
    if (p.air_pollution) exps.push('Air Pollution');
    if (p.poor_diet) exps.push('Poor Diet');
    if (p.physical_inactivity) exps.push('Inactivity');
    if (p.heavy_alcohol) exps.push('Heavy Alcohol');
    if (p.social_isolation) exps.push('Social Isolation');
    tip.innerHTML =
      '<strong>Farrlandian #' + p.id + '</strong><br>' +
      p.age + 'y · ' + p.sex_label + ' · ' + p.district_label + '<br>' +
      'SES ' + p.ses + ' (' + p.ses_group + ')<br>' +
      'Exposures: ' + (exps.length ? exps.join(', ') : 'none') + '<br>' +
      'Disease: ' + (dis.length ? dis.join(', ') : 'none');
    tip.classList.add('show');
    moveTip(ev);
  }
  function moveTip(ev) {
    var x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + 250 > window.innerWidth) x = ev.clientX - 254;
    if (y + 120 > window.innerHeight) y = ev.clientY - 120;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideTip() { tip.classList.remove('show'); }

  // ---- Individual profiles ----
  // Deterministic name from id so the same person always reads the same.
  var FIRST_F = ['Amara','Bisi','Clara','Dara','Efe','Fatima','Grace','Hauwa','Ivy','Joy','Kemi','Lola','Maryam','Nadia','Ola','Priya','Rita','Sade','Tara','Uche','Vera','Wura','Yara','Zara'];
  var FIRST_M = ['Ade','Bala','Chidi','Dele','Emeka','Femi','Gabe','Hakim','Ike','Jide','Kunle','Leke','Musa','Nnamdi','Obi','Paul','Rashid','Sam','Tunde','Umar','Victor','Wale','Yusuf','Zed'];
  var SURNAMES = ['Abari','Bello','Cole','Dauda','Eze','Ford','Gana','Hart','Ibe','Jalo','Kano','Lawal','Musa','Ndu','Okon','Pane','Quist','Reed','Sanni','Taiwo','Udo','Vance','Waziri','Yaro'];
  var JOBS = ['market trader','schoolteacher','nurse','farmer','shopkeeper','bus driver','tailor','clerk','carpenter','student','retiree','electrician','cook','pharmacist','mechanic','accountant','builder','cleaner'];

  function nameFor(p) {
    var pool = p.sex === 1 ? FIRST_F : FIRST_M;
    var first = pool[p.id % pool.length];
    var last = SURNAMES[(p.id * 7 + 3) % SURNAMES.length];
    return first + ' ' + last;
  }
  function jobFor(p) { return JOBS[(p.id * 5 + 1) % JOBS.length]; }

  // Brand stick-figure SVG, tinted by disease status
  function figureSvg(p) {
    var fill = p.any_disease ? 'var(--signal)' : 'var(--pop-grey-deep)';
    return '<svg viewBox="0 0 48 96" width="46" height="92" aria-hidden="true">' +
      '<circle cx="24" cy="9" r="7" fill="' + fill + '"/>' +
      '<path d="M 14 19 L 19 17 L 29 17 L 34 19 L 39 30 L 41 48 L 37 49 L 35 30 L 33 50 L 31 92 L 27 92 L 25 58 L 23 58 L 21 92 L 17 92 L 15 50 L 13 30 L 11 49 L 7 48 L 9 30 Z" fill="' + fill + '"/></svg>';
  }

  function listExposures(p) {
    var e = [];
    if (p.smoking) e.push('smokes');
    if (p.air_pollution) e.push('lives with heavy air pollution');
    if (p.poor_diet) e.push('has a poor diet');
    if (p.physical_inactivity) e.push('is physically inactive');
    if (p.heavy_alcohol) e.push('drinks heavily');
    if (p.social_isolation) e.push('is socially isolated');
    return e;
  }
  function listDiseases(p) {
    var d = [];
    if (p.cvd) d.push('heart disease');
    if (p.depression) d.push('depression');
    if (p.lung_cancer) d.push('lung cancer');
    return d;
  }

  function narrative(p) {
    var name = nameFor(p).split(' ')[0];
    var exps = listExposures(p);
    var dis = listDiseases(p);
    var s = name + ' is ' + p.age + ', ' + (p.sex === 1 ? 'a woman' : 'a man') +
      ' living in the ' + p.district_label + ' district and working as a ' + jobFor(p) + '. ';
    s += 'Their household is ' + (p.ses <= 2 ? 'among the least well-off in town' :
      (p.ses >= 4 ? 'comfortably off' : 'middle-income')) + '. ';
    if (exps.length) {
      s += name + ' ' + (exps.length === 1 ? exps[0] : exps.slice(0, -1).join(', ') + ' and ' + exps[exps.length - 1]) + '. ';
    } else {
      s += name + ' has none of the risk habits we track. ';
    }
    if (dis.length) {
      s += 'Health-wise, they live with ' + (dis.length === 1 ? dis[0] : dis.slice(0, -1).join(', ') + ' and ' + dis[dis.length - 1]) + '.';
    } else {
      s += 'So far, they have none of the diseases we track.';
    }
    return s;
  }

  function chip(label, value) {
    return '<div class="pf-attr"><span class="pf-attr__k">' + label + '</span><span class="pf-attr__v">' + value + '</span></div>';
  }

  var profileEl = document.getElementById('profile');
  var profileScrim = document.getElementById('profileScrim');
  var profileBody = document.getElementById('profileBody');

  function openProfile(p) {
    hideTip();
    var exps = listExposures(p);
    var dis = listDiseases(p);
    var expTech = [];
    if (p.smoking) expTech.push('Smoking');
    if (p.air_pollution) expTech.push('Air pollution');
    if (p.poor_diet) expTech.push('Poor diet');
    if (p.physical_inactivity) expTech.push('Physical inactivity');
    if (p.heavy_alcohol) expTech.push('Heavy alcohol');
    if (p.social_isolation) expTech.push('Social isolation');
    var disTech = [];
    if (p.cvd) disTech.push('CVD');
    if (p.depression) disTech.push('Depression');
    if (p.lung_cancer) disTech.push('Lung cancer');

    var head = '<div class="pf-head"><div class="pf-fig">' + figureSvg(p) + '</div>' +
      '<div><div class="pf-name">' + nameFor(p) + '</div>' +
      '<div class="pf-id">Farrlandian #' + p.id + '</div></div></div>';

    var body;
    if (state.plain) {
      body = '<p class="pf-story">' + narrative(p) + '</p>';
    } else {
      body = '<div class="pf-grid">' +
        chip('Age', p.age) +
        chip('Sex', p.sex_label) +
        chip('District', p.district_label) +
        chip('SES', p.ses + ' (' + p.ses_group + ')') +
        chip('Person-years', p.py) +
        chip('Exposures', expTech.length ? expTech.join(', ') : 'none') +
        chip('Outcomes', disTech.length ? disTech.join(', ') : 'none') +
        '</div>';
    }
    profileBody.innerHTML = head + body;
    profileEl.classList.add('show');
    profileEl.setAttribute('aria-hidden', 'false');
    profileScrim.classList.add('show');
    document.getElementById('profileClose').focus();
  }

  function closeProfile() {
    profileEl.classList.remove('show');
    profileEl.setAttribute('aria-hidden', 'true');
    profileScrim.classList.remove('show');
  }

  // ---- CSV download ----
  function downloadCsv() {
    var rows = filtered();
    var cols = ['id','age','sex','district','ses','smoking','air_pollution','poor_diet',
      'physical_inactivity','heavy_alcohol','social_isolation','cvd','depression','lung_cancer','person_years'];
    var lines = [cols.join(',')];
    rows.forEach(function (p) {
      lines.push([p.id, p.age, p.sex, p.district_label, p.ses, p.smoking, p.air_pollution,
        p.poor_diet, p.physical_inactivity, p.heavy_alcohol, p.social_isolation,
        p.cvd, p.depression, p.lung_cancer, p.py].join(','));
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'farrlandia_' + rows.length + '_people.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---- Rendering: stats panel ----
  function block(title, lines) {
    return '<div class="stat-block"><h4>' + title + '</h4>' +
      lines.map(function (l) {
        return '<div class="line"><span>' + l[0] + '</span><span' + (l[2] ? ' class="' + l[2] + '"' : '') + '>' + l[1] + '</span></div>';
      }).join('') + '</div>';
  }

  function renderStats() {
    var rows = filtered();
    var html = '';

    // 1. Disease prevalence
    html += block('Disease Prevalence', [
      ['CVD', prevalence(rows, 'cvd').pct + '%'],
      ['Depression', prevalence(rows, 'depression').pct + '%'],
      ['Lung Cancer', prevalence(rows, 'lung_cancer').pct + '%'],
      ['Any Disease', prevalence(rows, 'any_disease').pct + '%']
    ]);

    // 2. Exposure prevalence
    html += block('Exposure Prevalence', [
      ['Smoking', prevalence(rows, 'smoking').pct + '%'],
      ['Air Poll.', prevalence(rows, 'air_pollution').pct + '%'],
      ['Poor Diet', prevalence(rows, 'poor_diet').pct + '%'],
      ['Isolated', prevalence(rows, 'social_isolation').pct + '%']
    ]);

    // 3 + 4. Crude estimates + 2x2 (only when exposure selected)
    if (state.exposure) {
      var t = twoBytwo(rows, state.exposure, state.outcome);
      html += block('Crude Estimates', [
        ['Risk Ratio', t.rr === null ? '—' : t.rr.toFixed(2), 'v-signal'],
        ['Risk Difference', (t.rd * 100).toFixed(1) + '%'],
        ['Risk (Exposed)', (t.re * 100).toFixed(1) + '%'],
        ['Risk (Unexposed)', (t.ru * 100).toFixed(1) + '%']
      ]);

      html += '<div class="stat-block"><h4>2×2 Table</h4>' +
        '<table class="twobytwo"><thead><tr><th></th><th>Disease+</th><th>Disease−</th></tr></thead><tbody>' +
        '<tr><th>Exposed</th><td>' + t.a + '</td><td>' + t.b + '</td></tr>' +
        '<tr><th>Unexposed</th><td>' + t.c + '</td><td>' + t.d + '</td></tr>' +
        '</tbody></table></div>';
    }

    // 5. Stratified estimates
    if (state.stratify && state.exposure) {
      html += renderStratified(rows);
    }

    document.getElementById('statsPanel').innerHTML = html;
  }

  function strataKeys(field) {
    switch (field) {
      case 'ses_group': return [['Low', function (p) { return p.ses <= 2; }], ['High', function (p) { return p.ses >= 4; }]];
      case 'sex': return [['Female', function (p) { return p.sex === 1; }], ['Male', function (p) { return p.sex === 0; }]];
      case 'smoking': return [['Smokers', function (p) { return p.smoking === 1; }], ['Non-smokers', function (p) { return p.smoking === 0; }]];
      case 'district_group': return [
        ['Snow', function (p) { return p.dist === 1; }],
        ['Nightingale', function (p) { return p.dist === 2; }],
        ['Hill', function (p) { return p.dist === 3; }],
        ['Doll', function (p) { return p.dist === 4; }],
        ['Rose', function (p) { return p.dist === 5; }]
      ];
      default: return [];
    }
  }

  function renderStratified(rows) {
    var keys = strataKeys(state.stratify);
    var lines = [];
    // Mantel-Haenszel pooled RR
    var mhNum = 0, mhDen = 0;
    keys.forEach(function (k) {
      var sub = rows.filter(k[1]);
      var t = twoBytwo(sub, state.exposure, state.outcome);
      lines.push([k[0] + ' (n=' + sub.length + ')', t.rr === null ? '—' : t.rr.toFixed(2)]);
      var n = sub.length;
      if (n > 0) {
        mhNum += (t.a * (t.c + t.d)) / n;
        mhDen += (t.c * (t.a + t.b)) / n;
      }
    });
    var mh = mhDen === 0 ? null : mhNum / mhDen;
    lines.push(['MH Pooled RR', mh === null ? '—' : mh.toFixed(2), 'v-signal']);
    return block('Stratified Estimates', lines);
  }

  // ---- Interpretation ----
  var EXP_NAMES = {
    smoking: 'smoking', air_pollution: 'air pollution', poor_diet: 'poor diet',
    physical_inactivity: 'physical inactivity', heavy_alcohol: 'heavy alcohol', social_isolation: 'social isolation'
  };
  var OUT_NAMES = { any_disease: 'any disease', cvd: 'CVD', depression: 'depression', lung_cancer: 'lung cancer' };

  function renderInterp() {
    var panel = document.getElementById('interpPanel');
    if (!state.exposure) { panel.style.display = 'none'; return; }
    panel.style.display = '';
    var rows = filtered();
    var t = twoBytwo(rows, state.exposure, state.outcome);
    var rrTxt = t.rr === null ? 'undefined' : t.rr.toFixed(2);
    var reP = (t.re * 100).toFixed(1);
    var ruP = (t.ru * 100).toFixed(1);

    // Pooled MH (used by both modes when stratifying)
    var mh = null;
    if (state.stratify) {
      var keys = strataKeys(state.stratify);
      var mhNum = 0, mhDen = 0;
      keys.forEach(function (k) {
        var sub = rows.filter(k[1]);
        var st = twoBytwo(sub, state.exposure, state.outcome);
        var n = sub.length;
        if (n > 0) { mhNum += (st.a * (st.c + st.d)) / n; mhDen += (st.c * (st.a + st.b)) / n; }
      });
      mh = mhDen === 0 ? null : mhNum / mhDen;
    }
    var mhTxt = mh === null ? 'undefined' : mh.toFixed(2);

    var html;
    if (state.plain) {
      var times = t.rr === null ? '' : (t.rr >= 1 ? t.rr.toFixed(1) + ' times' : (1 / t.rr).toFixed(1) + ' times lower');
      html = 'Out of every 100 people who ' + PLAIN_EXP[state.exposure] + ', about <strong>' + reP +
        '</strong> have ' + PLAIN_OUT[state.outcome] + '. Among people who don’t, it’s about <strong>' + ruP + '</strong>. ';
      if (t.rr !== null) {
        html += (t.rr >= 1 ? 'That’s roughly <strong>' + t.rr.toFixed(1) + ' times</strong> the risk.'
                           : 'That’s actually <strong>lower</strong> risk.');
      }
      if (state.stratify) {
        html += ' But watch what happens when we compare like with like. After grouping people by ' +
          PLAIN_STRAT[state.stratify] + ', the fairer overall comparison drops to about <strong>' + mhTxt +
          ' times</strong>. If that number is much closer to 1 than the first one, the original gap was mostly an illusion — something else was doing the work.';
      }
    } else {
      html = 'Among these Farrlandians, the crude risk ratio for ' + OUT_NAMES[state.outcome] +
        ' comparing those with ' + EXP_NAMES[state.exposure] + ' to those without is <strong>' + rrTxt + '</strong>. ' +
        'The risk in the exposed group is <strong>' + reP + '%</strong> versus <strong>' +
        ruP + '%</strong> in the unexposed.';
      if (state.stratify) {
        html += ' After stratifying by ' + state.stratify.replace('_group', '').replace('_', ' ') +
          ', the Mantel–Haenszel pooled risk ratio is <strong>' + mhTxt + '</strong>. ' +
          'Compare the crude and adjusted estimates to judge whether confounding is at work.';
      }
    }
    document.getElementById('interpText').innerHTML = html;
  }

  var PLAIN_EXP = {
    smoking: 'smoke', air_pollution: 'live with heavy air pollution', poor_diet: 'eat a poor diet',
    physical_inactivity: 'rarely exercise', heavy_alcohol: 'drink heavily', social_isolation: 'are socially isolated'
  };
  var PLAIN_OUT = { any_disease: 'a disease', cvd: 'heart disease', depression: 'depression', lung_cancer: 'lung cancer' };
  var PLAIN_STRAT = {
    ses_group: 'how well-off they are', sex: 'sex', smoking: 'whether they smoke', district_group: 'neighbourhood'
  };

  // ---- Top stats bar ----
  function renderTopStats() {
    var el = document.getElementById('topStats');
    var n = PEOPLE.length;
    var stats = [
      [n.toLocaleString(), 'Farrlandians', false],
      [prevalence(PEOPLE, 'cvd').pct + '%', 'CVD', true],
      [prevalence(PEOPLE, 'depression').pct + '%', 'Depression', true],
      [prevalence(PEOPLE, 'lung_cancer').pct + '%', 'Lung Cancer', true],
      [prevalence(PEOPLE, 'smoking').pct + '%', 'Smoking', true]
    ];
    el.innerHTML = stats.map(function (s) {
      return '<div class="ts"><div class="ts__num' + (s[2] ? ' is-signal' : '') + '">' + s[0] +
        '</div><div class="ts__label">' + s[1] + '</div></div>';
    }).join('');
  }

  // ---- Filter tags ----
  function renderFilterTags() {
    var el = document.getElementById('filterTags');
    el.innerHTML = state.filters.map(function (f, i) {
      return '<span class="filter-tag">' + FILTER_LABELS[f] +
        ' <button type="button" data-i="' + i + '" aria-label="Remove filter">×</button></span>';
    }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        state.filters.splice(parseInt(b.getAttribute('data-i'), 10), 1);
        renderAll();
      });
    });
  }

  function renderAll() {
    renderPop();
    renderStats();
    renderInterp();
    renderFilterTags();
  }

  // ---- Wire up controls ----
  function init() {
    if (!PEOPLE.length) return;
    renderTopStats();

    document.getElementById('colorBy').addEventListener('change', function (e) {
      state.colorBy = e.target.value; renderPop();
    });
    document.getElementById('expSelect').addEventListener('change', function (e) {
      state.exposure = e.target.value; renderStats(); renderInterp();
    });
    document.getElementById('outSelect').addEventListener('change', function (e) {
      state.outcome = e.target.value; renderStats(); renderInterp();
    });
    document.getElementById('stratSelect').addEventListener('change', function (e) {
      state.stratify = e.target.value; renderStats(); renderInterp();
    });
    document.getElementById('filterSelect').addEventListener('change', function (e) {
      var v = e.target.value;
      if (v && state.filters.indexOf(v) === -1) { state.filters.push(v); renderAll(); }
      e.target.value = '';
    });

    // Profile drawer close
    document.getElementById('profileClose').addEventListener('click', closeProfile);
    profileScrim.addEventListener('click', closeProfile);
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeProfile();
    });

    // CSV download
    document.getElementById('downloadBtn').addEventListener('click', downloadCsv);

    // Plain-language / technical mode toggle
    var mp = document.getElementById('modePlain');
    var mt = document.getElementById('modeTech');
    function setMode(plain) {
      state.plain = plain;
      mp.classList.toggle('is-active', plain);
      mt.classList.toggle('is-active', !plain);
      mp.setAttribute('aria-pressed', String(plain));
      mt.setAttribute('aria-pressed', String(!plain));
      renderStats(); renderInterp();
    }
    mp.addEventListener('click', function () { setMode(true); });
    mt.addEventListener('click', function () { setMode(false); });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
