// Knowware client runtime — countdown + dock
// Runs once on DOMContentLoaded, no framework

const DEADLINE_ISO = '2026-12-21T23:59:59-05:00';

function initDock() {
  const dock = document.getElementById('kw-dock');
  const cta  = document.getElementById('kw-dock-cta');
  const cd   = document.getElementById('kw-dock-countdown');
  if (!dock || !cta || !cd) return;

  const deadline = new Date(DEADLINE_ISO).getTime();

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) { cd.textContent = 'SOLSTICE PASSED'; return; }
    const days = Math.floor(diff / 864e5);
    cd.textContent = days + 'D TO SOLSTICE';
  }
  tick();
  setInterval(tick, 60000);

  let shown = false;
  function check() {
    const past = window.scrollY > 240;
    if (past !== shown) { shown = past; dock.classList.toggle('kw-visible', past); }
  }
  window.addEventListener('scroll', check, { passive: true });
}

const THEMES = ['light', 'dark', 'warm'] as const;
const THEME_LABEL: Record<string, string> = { light: 'Light', dark: 'Dark', warm: 'Warm' };

function currentTheme(): string {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function initTheme() {
  const btn = document.getElementById('kw-theme-btn');
  if (!btn) return;
  // The icon follows data-theme in CSS; the label is for assistive tech and the tooltip.
  const paint = () => {
    const t = currentTheme();
    btn.setAttribute('aria-label', `Theme: ${THEME_LABEL[t] ?? 'Light'}. Switch theme`);
    btn.setAttribute('title', `Theme: ${THEME_LABEL[t] ?? 'Light'}. Click to switch`);
  };
  paint();
  btn.addEventListener('click', () => {
    const i = THEMES.indexOf(currentTheme() as typeof THEMES[number]);
    const next = THEMES[(i + 1) % THEMES.length];
    if (next === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('kw-theme', next); } catch {}
    paint();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDock();
  initTheme();
});
