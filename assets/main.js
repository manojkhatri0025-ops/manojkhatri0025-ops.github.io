(() => {
  'use strict';
  const themes = ['system', 'light', 'dark'];
  const themeButton = document.getElementById('theme-btn');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try { preference = localStorage.getItem('mk_theme') || 'system'; } catch {}
  if (!themes.includes(preference)) preference = 'system';
  function applyTheme() {
    document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    themeButton.textContent = { system: '⚙', light: '☀', dark: '☾' }[preference];
    const label = `Color theme: ${preference}. Switch to ${themes[(themes.indexOf(preference) + 1) % themes.length]}.`;
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  }
  themeButton.addEventListener('click', () => {
    preference = themes[(themes.indexOf(preference) + 1) % themes.length];
    try { localStorage.setItem('mk_theme', preference); } catch {}
    applyTheme();
  });
  media.addEventListener('change', () => { if (preference === 'system') applyTheme(); });
  applyTheme();

  const menuButton = document.getElementById('menu-btn');
  const nav = document.getElementById('nav-links');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('nav')) setMenu(false); });
  window.matchMedia('(min-width: 769px)').addEventListener('change', () => setMenu(false));

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scheduled = false;
  function updateActiveLink() {
    let current = '';
    for (const section of sections) { if (section.getBoundingClientRect().top <= 140) current = section.id; }
    for (const link of links) {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveLink); } }, { passive: true });
  updateActiveLink();
})();
