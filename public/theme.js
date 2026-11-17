(() => {
  const root = document.documentElement;
  const colorPreference = matchMedia('(prefers-color-scheme: dark)');
  const key = 'xvex-site-theme';
  let preference;
  try {
    const stored = localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch {}

  function applyTheme() {
    root.dataset.theme = preference ?? (colorPreference.matches ? 'dark' : 'light');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const label = root.dataset.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
      button.title = label;
      button.setAttribute('aria-label', label);
    }
  }

  applyTheme();
  colorPreference.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    applyTheme();
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      applyTheme();
    });
  });
})();
