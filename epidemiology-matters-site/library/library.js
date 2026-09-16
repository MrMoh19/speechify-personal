// Library — tab switching + submit form

(function () {
  const tabs = document.querySelectorAll('.lib-tab');
  const panels = {
    articles: document.getElementById('panel-articles'),
    media: document.getElementById('panel-media'),
  };

  function activate(name, pushState) {
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.entries(panels).forEach(([k, el]) => {
      if (!el) return;
      if (k === name) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });
    if (pushState) {
      const url = name === 'articles' ? '#articles' : '#media';
      history.replaceState(null, '', url);
    }
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activate(t.dataset.tab, true));
  });

  // Initial — read hash
  const hash = location.hash.replace('#', '');
  if (hash === 'media') activate('media', false);
  else activate('articles', false);

  // Submit form
  const form = document.getElementById('submitForm');
  const success = document.getElementById('submitSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.email || !data.title || !data.pitch) {
        return;
      }
      // For now: client-side acknowledgment. A backend endpoint can be wired later.
      console.log('Submission received:', data);
      form.style.display = 'none';
      if (success) success.hidden = false;
    });
  }
})();
