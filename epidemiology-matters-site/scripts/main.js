/* =====================================================
   Epidemiology Matters — Homepage interactions
   ===================================================== */
(function () {
  'use strict';

  // ---------- Hero diagonal lattice ----------
  var heroLat = document.getElementById('hero-lattice');
  if (heroLat && window.EpiFigure) {
    EpiFigure.lattice(heroLat, {
      rows: 11, cols: 16, tilt: 15, figW: 56, gapX: 0.55, gapY: 0.25,
      signal: [4, 9], opacity: 0.28, staggerMs: 0,
    });
  }

  // ---------- Hero population graphic: 100 figures, 20 diseased ----------
  // Deterministic spread of the 20 signal-red figures across the 10x10 grid.
  var heroPop = document.getElementById('hero-pop-grid');
  if (heroPop && window.EpiFigure) {
    var diseased = new Set([3, 7, 12, 18, 21, 26, 33, 39, 41, 47, 52, 58, 63, 69, 74, 78, 83, 88, 91, 96]);
    for (var i = 0; i < 100; i++) {
      var f = window.EpiFigure.figure({ signal: diseased.has(i) });
      f.style.color = diseased.has(i) ? 'var(--signal)' : 'var(--pop-grey)';
      heroPop.appendChild(f);
    }
  }

  // ---------- Email signup (Netlify Forms) ----------
  var signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('notifyBtn');
      var msg = document.getElementById('signupMsg');
      if (btn) btn.disabled = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(signupForm)).toString(),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('status ' + r.status);
          signupForm.querySelector('[name=email]').value = '';
          if (msg) { msg.textContent = 'Thank you \u2014 you\u2019re on the list. We\u2019ll write when there\u2019s something worth reporting.'; msg.hidden = false; }
        })
        .catch(function () {
          if (msg) { msg.textContent = 'Something went wrong sending that. Please try again in a moment.'; msg.hidden = false; }
        })
        .finally(function () { if (btn) btn.disabled = false; });
    });
  }

  // ---------- Scroll reveals ----------
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var rvEls = document.querySelectorAll('main .section-head, main .feed-card, main .trio__card, main .tool-row, main .cbox, main .author-card');
    rvEls.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (Math.min(i % 3, 2) * 70) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -50px 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  // ---------- Mobile nav toggle ----------
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Smooth scroll for in-page anchors ----------
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

// ---------- Bulletin rotator ----------
(function () {
  'use strict';
  var items = document.querySelectorAll('.bulletin__item');
  var dotsWrap = document.querySelector('.bulletin__dots');
  if (!items.length || !dotsWrap) return;
  var idx = 0, timer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  items.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'bulletin__dot' + (i === 0 ? ' is-on' : '');
    d.setAttribute('aria-label', 'Show bulletin item ' + (i + 1));
    d.addEventListener('click', function () { show(i); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = dotsWrap.querySelectorAll('.bulletin__dot');
  function show(i) {
    idx = i;
    items.forEach(function (el, j) { el.classList.toggle('is-on', j === i); });
    dots.forEach(function (el, j) { el.classList.toggle('is-on', j === i); });
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = null;
    if (!reduced) timer = setInterval(function () { show((idx + 1) % items.length); }, 7000);
  }
  var bar = document.querySelector('.bulletin');
  bar.addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
  bar.addEventListener('mouseleave', restart);
  restart();
})();
