/* ==========================================================================
   Adam Shop - Theme Manager (Dark / Light)
   ========================================================================== */

const THEME_KEY = 'adam_shop_theme';
const DEFAULT_THEME = 'dark';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved || DEFAULT_THEME;
  applyTheme(theme);
  return theme;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcon(theme);
  document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
}

function updateThemeIcon(theme) {
  const buttons = document.querySelectorAll('.navbar-theme-btn');
  buttons.forEach(btn => {
    const icon = btn.querySelector('i') || btn.querySelector('span') || btn;
    if (theme === 'dark') {
      icon.textContent = '\u263E';
      icon.className = '';
      if (btn.querySelector('i')) btn.querySelector('i').className = '';
    } else {
      icon.textContent = '\u2600';
      icon.className = '';
      if (btn.querySelector('i')) btn.querySelector('i').className = '';
    }
  });
}

function initThemeToggle() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.navbar-theme-btn');
    if (btn) {
      e.preventDefault();
      toggleTheme();
    }
  });
}

function watchSystemTheme() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initThemeToggle();
      watchSystemTheme();
    });
  } else {
    initTheme();
    initThemeToggle();
    watchSystemTheme();
  }
})();
