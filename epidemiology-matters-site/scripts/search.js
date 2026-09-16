/* =====================================================
   Epidemiology Matters — Site search
   Self-contained: injects the nav button, the overlay,
   and its styles. Open with the button, "/" or Cmd/Ctrl-K.
   ===================================================== */
(function () {
  'use strict';

  // ---------- Index ----------
  var ROOT = (function () {
    // Compute site root relative to current page depth.
    var p = location.pathname.replace(/[^/]*$/, '');
    var depth = (p.match(/\//g) || []).length - 1;
    return depth <= 0 ? './' : new Array(depth + 1).join('../');
  })();

  var INDEX = [
    { t: 'Home', u: 'index.html', d: 'Almost everything you believe about your health began as a pattern in a population.', k: 'homepage landing start' },
    { t: 'Does Coffee Cause Heart Attacks?', u: 'index.html#hook', d: 'A 60-second playable story about confounding. No epi vocabulary required.', k: 'coffee hook puzzle confounding smoking play interactive' },
    { t: 'Causal Thinking Lab', u: 'lab/index.html', d: 'Build a world, add bias on purpose, watch estimates distort. Five classroom scenarios.', k: 'lab causal bias confounding simpson paradox measurement error selection scenarios plain language technical' },
    { t: 'Interactive Companion', u: 'explore/index.html', d: 'Prevalence, causation, the seven steps, and the study design builder.', k: 'explore companion tools interactive chapter' },
    { t: 'Disease in a Population', u: 'explore/index.html#prevalence', d: 'Adjust sliders and watch prevalence, risk ratios, and risk differences update.', k: 'prevalence risk ratio risk difference measures association chapter 5' },
    { t: 'Component Cause Model', u: 'explore/index.html#causation', d: 'Sufficient causes as complete recipes: toggle component causes for individual Farrlandians.', k: 'causation sufficient component cause pie rothman chapter 7' },
    { t: 'Seven Steps for an Epidemiology of Consequence', u: 'explore/index.html#steps', d: 'The framework the whole book is built on: from defining a population to external validity.', k: 'seven steps framework population sample associations causality interaction external validity' },
    { t: 'Study Design Builder', u: 'explore/index.html#builder', d: 'Walk through all seven steps to design your own epidemiologic study.', k: 'study design builder walkthrough' },
    { t: 'Explore Farrlandia', u: 'farrlandia/index.html', d: 'The living dataset: 1,000 Farrlandians with demographics, exposures, and outcomes.', k: 'farrlandia dataset population data people census filter stratify william farr' },
    { t: 'Library — Articles & Media', u: 'library/index.html', d: 'Long-form pieces, animations, and infographics that extend the book. Submit your own.', k: 'library articles media journal videos submit' },
    { t: 'The Table 2 Fallacy', u: 'library/articles/table-2-fallacy/index.html', d: 'Why the second row of every regression almost never means what we want it to mean.', k: 'table 2 fallacy regression coefficients covariates adjustment article causal inference westreich greenland' },
    { t: 'Video: Confounding (EP 01)', u: 'library/index.html#media', d: 'Animated walkthrough: how a third variable inflates a crude risk ratio.', k: 'video animation confounding stratification media' },
    { t: 'Video: Adjusting for Confounders', u: 'library/index.html#media', d: 'What adjustment actually does, drawn out step by step.', k: 'video animation adjusting confounders adjustment media' },
    { t: 'Video: How to Read a DAG', u: 'library/index.html#media', d: 'Arrows, backdoor paths, and what to adjust for — the grammar of causal diagrams.', k: 'video animation dag directed acyclic graph backdoor causal diagram media' },
    { t: 'Infographic: Selection Bias', u: 'library/index.html#media', d: 'Study only the people who show up, and you can invent a cause out of thin air.', k: 'infographic selection bias collider media pdf download' },
    { t: 'Simpson’s Paradox', u: 'lab/index.html', d: 'A treatment looks worse for everyone yet better for each group separately. Play it in the Lab.', k: 'simpson paradox stratified aggregation reversal' },
    { t: 'The Farrlandia Challenge', u: 'index.html#challenge', d: 'Inter-school outbreak investigation. Four rounds, teams of 3–5, free to enter. Fall 2028.', k: 'challenge competition outbreak investigation registration teams students fall 2028' },
    { t: 'Consequence Boxes', u: 'index.html#tools', d: 'Each chapter connects a methodological choice to a question of social responsibility.', k: 'consequence boxes measurement social responsibility second edition' },
    { t: 'The Authors', u: 'index.html#authors', d: 'Katherine M. Keyes, Mohammed Abba-Aji, and Sandro Galea.', k: 'authors keyes abba-aji galea columbia washu oxford' },
    { t: 'The Book — Second Edition', u: 'index.html#book', d: 'Epidemiology Matters, second edition. Oxford University Press, 2028. QR codes link every chapter here.', k: 'book textbook second edition oxford university press oup 2028 buy' },
    { t: 'Stay Updated', u: 'index.html#signup', d: 'Get notified when tools launch, the Challenge opens, and the second edition publishes.', k: 'signup newsletter email notify subscribe updates' },
    { t: 'William Farr', u: 'farrlandia/index.html', d: '“The death rate is a fact; anything beyond this is an inference.” Farrlandia is named for him.', k: 'william farr vital statistics quote history 1807' },
    { t: 'Privacy Policy', u: 'privacy/index.html', d: 'What we collect and what we do with it.', k: 'privacy policy data legal' },
    { t: 'Terms of Use', u: 'terms/index.html', d: 'The terms governing use of this site.', k: 'terms use legal' }
  ];

  // ---------- Styles ----------
  var css = ''
    + '.emsearch-btn{display:inline-flex;align-items:center;gap:7px;background:none;border:1px solid var(--rule,#e5e8ed);border-radius:4px;padding:6px 10px;cursor:pointer;color:var(--ink-mute,#5b6066);font-family:"JetBrains Mono",monospace;font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;transition:border-color .2s,color .2s}'
    + '.emsearch-btn:hover{border-color:var(--signal,#cb493c);color:var(--signal,#cb493c)}'
    + '.emsearch-btn svg{flex:0 0 auto}'
    + '.emsearch-kbd{border:1px solid var(--rule,#e5e8ed);border-radius:3px;padding:1px 4px;font-size:0.58rem}'
    + '@media(max-width:1320px){.emsearch-kbd{display:none}}@media(max-width:1180px){.emsearch-word{display:none}.emsearch-btn{padding:6px 8px}}'
    + '.emsearch-overlay{position:fixed;inset:0;z-index:300;background:rgba(10,10,10,.45);display:none;align-items:flex-start;justify-content:center;padding:12vh 16px 16px}'
    + '.emsearch-overlay.is-open{display:flex}'
    + '.emsearch-panel{width:100%;max-width:560px;background:#fff;border:1px solid var(--rule,#e5e8ed);box-shadow:0 24px 64px rgba(10,10,10,.25)}'
    + '.emsearch-head{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--rule,#e5e8ed);padding:14px 16px}'
    + '.emsearch-input{flex:1;border:0;outline:0;font-family:"Source Serif 4",serif;font-size:1.05rem;color:var(--ink,#0a0a0a);background:transparent}'
    + '.emsearch-input::placeholder{color:var(--pop-grey-deep,#b8c2cc)}'
    + '.emsearch-esc{font-family:"JetBrains Mono",monospace;font-size:0.6rem;color:var(--ink-mute,#5b6066);border:1px solid var(--rule,#e5e8ed);border-radius:3px;padding:2px 6px;background:none;cursor:pointer}'
    + '.emsearch-results{list-style:none;margin:0;padding:6px;max-height:52vh;overflow-y:auto}'
    + '.emsearch-item a{display:block;padding:10px 12px;text-decoration:none;border-radius:4px}'
    + '.emsearch-item.is-active a,.emsearch-item a:hover{background:var(--paper-sunk,#fafbfc);outline:1px solid var(--rule,#e5e8ed)}'
    + '.emsearch-item-t{display:block;font-family:"Oswald",sans-serif;font-weight:600;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.03em;color:var(--ink,#0a0a0a)}'
    + '.emsearch-item.is-active .emsearch-item-t{color:var(--signal,#cb493c)}'
    + '.emsearch-item-d{display:block;font-family:"Source Serif 4",serif;font-size:0.82rem;color:var(--ink-mute,#5b6066);line-height:1.5;margin-top:2px}'
    + '.emsearch-empty{padding:22px 16px;font-family:"Source Serif 4",serif;font-style:italic;font-size:0.9rem;color:var(--ink-mute,#5b6066)}';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- Overlay ----------
  var overlay = document.createElement('div');
  overlay.className = 'emsearch-overlay';
  overlay.innerHTML = ''
    + '<div class="emsearch-panel" role="dialog" aria-modal="true" aria-label="Search the site">'
    + '  <div class="emsearch-head">'
    + '    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6.5" cy="6.5" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>'
    + '    <input class="emsearch-input" type="search" placeholder="Search the site…" aria-label="Search query" autocomplete="off" />'
    + '    <button class="emsearch-esc" type="button" aria-label="Close search">esc</button>'
    + '  </div>'
    + '  <ul class="emsearch-results" role="listbox"></ul>'
    + '</div>';
  document.body.appendChild(overlay);
  var input = overlay.querySelector('.emsearch-input');
  var list = overlay.querySelector('.emsearch-results');
  var active = -1;

  function openSearch() {
    overlay.classList.add('is-open');
    input.value = '';
    render('');
    setTimeout(function () { input.focus(); }, 30);
  }
  function closeSearch() { overlay.classList.remove('is-open'); }

  function score(item, q) {
    var s = 0;
    var t = item.t.toLowerCase(), k = item.k.toLowerCase(), d = item.d.toLowerCase();
    q.split(/\s+/).forEach(function (w) {
      if (!w) return;
      if (t.indexOf(w) > -1) s += 3;
      if (k.indexOf(w) > -1) s += 2;
      if (d.indexOf(w) > -1) s += 1;
    });
    return s;
  }

  function render(q) {
    q = q.trim().toLowerCase();
    var results;
    if (!q) {
      results = INDEX.slice(0, 6);
    } else {
      results = INDEX.map(function (it) { return { it: it, s: score(it, q) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8)
        .map(function (r) { return r.it; });
    }
    active = results.length ? 0 : -1;
    if (!results.length) {
      list.innerHTML = '<li class="emsearch-empty">Nothing found — lost to follow-up. Try “confounding”, “Farrlandia”, or “DAG”.</li>';
      return;
    }
    list.innerHTML = results.map(function (it, i) {
      return '<li class="emsearch-item' + (i === 0 ? ' is-active' : '') + '" role="option">'
        + '<a href="' + ROOT + it.u + '"><span class="emsearch-item-t">' + it.t + '</span>'
        + '<span class="emsearch-item-d">' + it.d + '</span></a></li>';
    }).join('');
  }

  function move(delta) {
    var items = list.querySelectorAll('.emsearch-item');
    if (!items.length) return;
    active = (active + delta + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle('is-active', i === active); });
    items[active].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', function () { render(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      var el = list.querySelectorAll('.emsearch-item')[active];
      if (el) el.querySelector('a').click();
    }
  });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  overlay.querySelector('.emsearch-esc').addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    var typing = /^(input|textarea|select)$/i.test((document.activeElement || {}).tagName || '');
    if (((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !overlay.classList.contains('is-open'))) {
      e.preventDefault();
      openSearch();
    }
  });

  // ---------- Nav button ----------
  var nav = document.getElementById('navlinks') || document.querySelector('.topnav__links');
  if (nav) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emsearch-btn';
    btn.setAttribute('aria-label', 'Search the site');
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6.5" cy="6.5" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg><span class="emsearch-word">Search</span><span class="emsearch-kbd">⌘K</span>';
    btn.addEventListener('click', openSearch);
    li.appendChild(btn);
    var ctaLi = nav.querySelector('li:last-child');
    nav.insertBefore(li, ctaLi);
  }
})();
