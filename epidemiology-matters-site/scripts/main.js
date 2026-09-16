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

  // ---------- Email signup (client-side only) ----------
  var notifyBtn = document.getElementById('notifyBtn');
  var emailInput = document.getElementById('emailInput');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', function () {
      if (emailInput) emailInput.value = '';
      window.alert('Thank you! We will keep you updated.');
    });
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
