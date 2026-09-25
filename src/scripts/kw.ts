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

function initTheme() {
  const saved = localStorage.getItem('kw-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
}

document.addEventListener('DOMContentLoaded', () => {
  initDock();
  initTheme();
});
