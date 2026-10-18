// Story diagrams: one small looping canvas scene per story, drawn from the structure the entry describes.
// Every scene ends with the same device: a dashed ring (the missing layer) that nothing ever connects to.
// Runs only while on screen, honors prefers-reduced-motion, and follows the site theme.

type Palette = { ink: string; sub: string; accent: string; rule: string; paper: string };
type G = { c: CanvasRenderingContext2D; k: number; p: Palette; sec: number; fade: number; layer: string };
type Scene = (g: G, t: number) => void;

const W = 400;
const H = 250;
const LOOP_SECONDS = 12;
const STATIC_PHASE = 0.86;
// The frame that best tells each story when nothing moves.
const STILL_PHASE: Record<string, number> = {
  'openai-misalignment-reports-september-2026': 0.62,
  'replit-agent-production-database': 0.52,
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function dot(g: G, x: number, y: number, r: number, fill: string, a = 1) {
  g.c.globalAlpha = clamp(a * g.fade);
  g.c.fillStyle = fill;
  g.c.beginPath();
  g.c.arc(x, y, r, 0, Math.PI * 2);
  g.c.fill();
  g.c.globalAlpha = 1;
}

function seg(g: G, x1: number, y1: number, x2: number, y2: number, color: string, a = 1, px = 1, dash?: number[]) {
  g.c.globalAlpha = clamp(a * g.fade);
  g.c.strokeStyle = color;
  g.c.lineWidth = px / g.k;
  g.c.setLineDash(dash ? dash.map((d) => d / g.k) : []);
  g.c.beginPath();
  g.c.moveTo(x1, y1);
  g.c.lineTo(x2, y2);
  g.c.stroke();
  g.c.setLineDash([]);
  g.c.globalAlpha = 1;
}

function box(g: G, x: number, y: number, w: number, h: number, o: { fill?: string; stroke?: string; a?: number; px?: number; dash?: number[] } = {}) {
  g.c.globalAlpha = clamp((o.a ?? 1) * g.fade);
  if (o.fill) {
    g.c.fillStyle = o.fill;
    g.c.fillRect(x, y, w, h);
  }
  if (o.stroke) {
    g.c.strokeStyle = o.stroke;
    g.c.lineWidth = (o.px ?? 1.5) / g.k;
    g.c.setLineDash((o.dash ?? []).map((d) => d / g.k));
    g.c.strokeRect(x, y, w, h);
    g.c.setLineDash([]);
  }
  g.c.globalAlpha = 1;
}

function ringShape(g: G, x: number, y: number, r: number, color: string, a: number) {
  g.c.globalAlpha = clamp(a * g.fade);
  g.c.strokeStyle = color;
  g.c.lineWidth = 1.5 / g.k;
  g.c.setLineDash([3 / g.k, 3 / g.k]);
  g.c.lineDashOffset = -g.sec * 14 / g.k;
  g.c.beginPath();
  g.c.arc(x, y, r, 0, Math.PI * 2);
  g.c.stroke();
  g.c.setLineDash([]);
  g.c.lineDashOffset = 0;
  g.c.globalAlpha = 1;
}

function text(g: G, s: string, x: number, y: number, o: { color?: string; align?: CanvasTextAlign; weight?: number; a?: number } = {}) {
  g.c.globalAlpha = clamp((o.a ?? 1) * g.fade);
  g.c.font = `${o.weight ?? 500} ${11 / g.k}px "JetBrains Mono", ui-monospace, monospace`;
  g.c.textAlign = o.align ?? 'left';
  g.c.textBaseline = 'alphabetic';
  g.c.fillStyle = o.color ?? g.p.sub;
  g.c.fillText(s, x, y);
  g.c.globalAlpha = 1;
}

// The missing layer: a dashed ring that nothing connects to, labeled with the entry's own layer name.
function missing(g: G, x: number, y: number) {
  ringShape(g, x, y, 14, g.p.sub, 0.95);
  g.c.font = `500 ${11 / g.k}px "JetBrains Mono", ui-monospace, monospace`;
  const half = (g.c.measureText(g.layer).width / 2) + 6 / g.k;
  const cx = clamp(x, half, W - half);
  text(g, g.layer, cx, y + 32, { align: 'center' });
}

// A small pulse travelling along a line.
function pulse(g: G, x1: number, y1: number, x2: number, y2: number, p: number, color: string, a = 1, r = 2) {
  const q = ((p % 1) + 1) % 1;
  dot(g, lerp(x1, x2, q), lerp(y1, y2, q), r, color, a);
}

// ---------------------------------------------------------------- scenes

// Agents meant to be isolated join a shared board, then reach an outside system. Nobody connects to the ring.
const openaiHuggingFace: Scene = (g, t) => {
  const { p } = g;
  const hub = { x: 250, y: 120 };
  const out = { x: 368, y: 120 };
  const N = 60;
  for (let i = 0; i < N; i++) {
    const born = 0.05 + (i / N) * 0.5;
    if (t < born) continue;
    let x = 28 + hash(i * 2 + 1) * 170;
    let y = 34 + hash(i * 2 + 2) * 150;
    if (i === 0) { x = 70; y = 70; }
    x += Math.sin(g.sec * 0.7 + i) * 1.6;
    y += Math.cos(g.sec * 0.6 + i * 1.3) * 1.6;
    const a = ss(born, born + 0.05, t);
    const linked = ss(born + 0.04, born + 0.09, t);
    seg(g, x, y, hub.x, hub.y, p.sub, 0.16 * linked);
    if (linked > 0.5) pulse(g, x, y, hub.x, hub.y, g.sec * 0.45 + hash(i), p.accent, 0.8, 1.6);
    dot(g, x, y, i === 0 ? 3.4 : 2.4, p.ink, 0.9 * a);
    if (i === 0) text(g, '?', x + 8, y - 6, { color: p.ink, weight: 700, a: 1 - ss(0.22, 0.3, t) });
  }
  box(g, hub.x - 11, hub.y - 11, 22, 22, { fill: p.paper, stroke: p.accent, px: 2 });
  text(g, 'board', hub.x, hub.y + 28, { align: 'center' });
  const attack = ss(0.62, 0.72, t);
  box(g, out.x - 12, out.y - 12, 24, 24, { stroke: p.ink, px: 1.5, dash: [4, 3] });
  text(g, 'outside', out.x, out.y + 28, { align: 'center' });
  for (let j = 0; j < 9; j++) pulse(g, hub.x + 12, hub.y, out.x - 13, out.y, g.sec * 0.8 + j / 9, p.accent, attack, 2.2);
  text(g, '≈1,200 agents', 28, 22, { a: ss(0.5, 0.6, t) });
  missing(g, 66, 204);
};

// Eight servers, one still running an old function, send a growing stream of orders while 97 emails go unreviewed.
const knightCapital: Scene = (g, t) => {
  const { p } = g;
  const y0 = 42;
  for (let i = 0; i < 8; i++) {
    const x = 26 + i * 32;
    if (i < 7) box(g, x, y0, 22, 22, { fill: p.ink, a: 0.85 });
    else box(g, x, y0, 22, 22, { fill: p.accent, stroke: p.accent, px: 2, a: 0.35 });
  }
  const sx = 26 + 7 * 32 + 22;
  text(g, 'old code', 26 + 7 * 32 + 11, y0 + 40, { align: 'center', color: p.ink });
  text(g, '7 new', 26 + 3 * 32 + 11, y0 + 40, { align: 'center' });
  box(g, 332, 22, 50, 64, { stroke: p.ink, px: 1.5 });
  text(g, 'market', 357, 102, { align: 'center' });
  const rate = ss(0.08, 0.7, t);
  const K = Math.floor(2 + rate * 46);
  for (let j = 0; j < K; j++) {
    const q = (g.sec * (0.7 + hash(j) * 0.5) + hash(j + 9)) % 1;
    const ty = 28 + hash(j * 3) * 52;
    dot(g, lerp(sx, 332, q), lerp(y0 + 11, ty, q), 1.7, p.accent, 0.85);
  }
  text(g, '212 orders in', 26, 102, { color: p.ink });
  text(g, 'millions out →', 232, 126, { a: ss(0.4, 0.6, t), color: p.ink });
  const sent = Math.floor(ss(0.04, 0.6, t) * 97);
  text(g, '97 emails, not reviewed', 26, 150);
  for (let n = 0; n < 97; n++) {
    const cx = 26 + (n % 20) * 9;
    const cy = 160 + Math.floor(n / 20) * 9;
    if (n < sent) box(g, cx, cy, 6, 6, { fill: p.sub, a: 0.9 });
    else box(g, cx, cy, 6, 6, { stroke: p.rule, px: 1, a: 0.8 });
  }
  missing(g, 292, 196);
};

// A summary passes through instances; one adds an instruction that is gone by the time the person reads it.
const openaiMisalignment: Scene = (g, t) => {
  const { p } = g;
  const xs = [52, 144, 236, 336];
  const y = 96;
  for (let i = 0; i < 3; i++) seg(g, xs[i] + 14, y, xs[i + 1] - 14, y, p.rule, 1, 1.5);
  for (let i = 0; i < 3; i++) {
    g.c.globalAlpha = g.fade;
    g.c.strokeStyle = p.ink;
    g.c.lineWidth = 1.5 / g.k;
    g.c.beginPath();
    g.c.arc(xs[i], y, 14, 0, Math.PI * 2);
    g.c.stroke();
    g.c.globalAlpha = 1;
  }
  g.c.globalAlpha = g.fade;
  g.c.strokeStyle = p.accent;
  g.c.lineWidth = 2 / g.k;
  g.c.beginPath();
  g.c.arc(xs[3], y, 14, 0, Math.PI * 2);
  g.c.stroke();
  g.c.globalAlpha = 1;
  text(g, 'instances', 144, y + 36, { align: 'center' });
  text(g, 'the person', xs[3], y + 36, { align: 'center', color: p.ink });
  const u = ss(0.06, 0.94, t) * 3;
  const seg_ = Math.min(2, Math.floor(u));
  const f = u - seg_;
  const e = f * f * (3 - 2 * f);
  const cx = lerp(xs[seg_], xs[seg_ + 1], e);
  const cy = y - 36;
  box(g, cx - 18, cy - 13, 36, 26, { fill: p.paper, stroke: p.ink, px: 1.5 });
  box(g, cx - 12, cy - 7, 24, 3, { fill: p.sub, a: 0.8 });
  box(g, cx - 12, cy - 1, 18, 3, { fill: p.sub, a: 0.8 });
  const added = ss(0.34, 0.4, t) * (1 - ss(0.74, 0.84, t));
  box(g, cx - 12, cy + 5, 20, 3, { fill: p.accent, a: added });
  text(g, 'summary', xs[0], y - 64, { align: 'center' });
  missing(g, 336, 188);
};

// One database serves both development and live use; an agent working in development deletes rows; backups restore them.
const replitDatabase: Scene = (g, t) => {
  const { p } = g;
  const cx = 200;
  const top = 78;
  const bodyH = 72;
  g.c.globalAlpha = g.fade;
  g.c.strokeStyle = p.ink;
  g.c.lineWidth = 1.5 / g.k;
  g.c.beginPath();
  g.c.ellipse(cx, top, 46, 10, 0, 0, Math.PI * 2);
  g.c.moveTo(cx - 46, top);
  g.c.lineTo(cx - 46, top + bodyH);
  g.c.ellipse(cx, top + bodyH, 46, 10, 0, Math.PI, 0, true);
  g.c.moveTo(cx + 46, top);
  g.c.lineTo(cx + 46, top + bodyH);
  g.c.stroke();
  g.c.globalAlpha = 1;
  text(g, 'dev + live, one database', cx, top + bodyH + 34, { align: 'center', color: p.ink });
  const del = ss(0.3, 0.55, t);
  const back = ss(0.72, 0.9, t);
  for (let n = 0; n < 20; n++) {
    const col = n % 5;
    const row = Math.floor(n / 5);
    const when = hash(n + 4);
    const gone = clamp((del - when * 0.6) / 0.4) * (1 - clamp((back - when * 0.6) / 0.4));
    dot(g, cx - 28 + col * 14, top + 22 + row * 12, 2.6, p.ink, 1 - 0.9 * gone);
  }
  g.c.globalAlpha = g.fade;
  g.c.strokeStyle = p.ink;
  g.c.lineWidth = 1.5 / g.k;
  g.c.beginPath();
  g.c.arc(62, 116, 14, 0, Math.PI * 2);
  g.c.stroke();
  g.c.globalAlpha = 1;
  text(g, 'agent', 62, 152, { align: 'center' });
  seg(g, 78, 116, cx - 50, 116, p.rule, 1, 1.5);
  if (t > 0.25 && t < 0.58) for (let j = 0; j < 3; j++) pulse(g, 78, 116, cx - 50, 116, g.sec * 0.9 + j / 3, p.accent, 1, 2.2);
  text(g, 'restore', cx + 56, top + 6, { color: p.accent, weight: 600, a: ss(0.7, 0.76, t) * (1 - ss(0.92, 0.97, t)) });
  missing(g, 338, 70);
};

// Landlords feed one tool; rents step up together and never step down; the people who pay sit outside it.
const realpagePricing: Scene = (g, t) => {
  const { p } = g;
  const eng = { x: 150, y: 118 };
  for (let i = 0; i < 6; i++) {
    const y = 36 + i * 32;
    box(g, 24, y - 7, 14, 14, { fill: p.ink, a: 0.85 });
    seg(g, 40, y, eng.x - 18, eng.y, p.sub, 0.3);
    pulse(g, 40, y, eng.x - 18, eng.y, g.sec * 0.5 + hash(i), p.accent, 0.9, 1.8);
  }
  g.c.globalAlpha = g.fade;
  g.c.fillStyle = p.accent;
  g.c.globalAlpha = 0.14 * g.fade;
  g.c.beginPath();
  g.c.arc(eng.x, eng.y, 18, 0, Math.PI * 2);
  g.c.fill();
  g.c.globalAlpha = g.fade;
  g.c.strokeStyle = p.accent;
  g.c.lineWidth = 2 / g.k;
  g.c.stroke();
  g.c.globalAlpha = 1;
  text(g, 'software', eng.x, eng.y + 38, { align: 'center' });
  const steps = [0.14, 0.3, 0.46, 0.62, 0.78];
  const ratchet = steps.reduce((acc, s) => acc + ss(s, s + 0.05, t), 0) / steps.length;
  const base = 196;
  let top = base;
  for (let i = 0; i < 6; i++) {
    const h = 24 + hash(i + 11) * 14 + ratchet * 66;
    top = Math.min(top, base - h);
    box(g, 240 + i * 16, base - h, 10, h, { fill: p.ink, a: 0.8 });
  }
  seg(g, 232, top, 340, top, p.accent, 0.6, 1, [3, 3]);
  text(g, 'rents', 290, base + 18, { align: 'center' });
  missing(g, 300, 36);
};

// Many agents, one constraint they can all see, and most go through it anyway. A simulation.
const anthropicSimulation: Scene = (g, t) => {
  const { p } = g;
  const barX = 206;
  const goal = { x: 352, y: 125 };
  const crossing = ss(0.28, 0.5, t) * (1 - ss(0.5, 0.62, t));
  seg(g, barX, 36, barX, 214, p.ink, 0.5 + 0.5 * crossing, 2, [5, 4]);
  text(g, 'constraint', barX, 28, { align: 'center', color: p.ink });
  for (const r of [18, 11, 4]) {
    g.c.globalAlpha = g.fade * 0.8;
    g.c.strokeStyle = p.accent;
    g.c.lineWidth = 1.5 / g.k;
    g.c.beginPath();
    g.c.arc(goal.x, goal.y, r, 0, Math.PI * 2);
    g.c.stroke();
    g.c.globalAlpha = 1;
  }
  text(g, 'goal', goal.x, goal.y + 36, { align: 'center' });
  for (let i = 0; i < 25; i++) {
    const sx = 26 + (i % 5) * 12;
    const sy = 64 + Math.floor(i / 5) * 18;
    const d = hash(i) * 0.22;
    let q = ss(0.1 + d, 0.62 + d, t);
    const holdout = i === 12;
    if (holdout) q = Math.min(q, 0.5);
    const tx = goal.x + (hash(i + 5) - 0.5) * 30;
    const ty = goal.y + (hash(i + 3) - 0.5) * 36;
    const x = lerp(sx, tx, holdout ? q * 0.9 : q);
    const y = lerp(sy, ty, holdout ? q * 0.9 : q);
    const bx = holdout ? Math.min(x, barX - 10) : x;
    dot(g, bx, y, 2.5, holdout ? p.sub : p.ink, 0.9);
  }
  text(g, '96%', goal.x - 28, goal.y - 34, { color: p.accent, weight: 700, a: ss(0.7, 0.78, t) });
  box(g, 24, 16, 78, 18, { stroke: p.accent, px: 1.5 });
  text(g, 'SIMULATION', 63, 29, { align: 'center', color: p.accent, weight: 700 });
  missing(g, 62, 212);
};

// Any story without its own scene: two systems exchange signals, a third thing is missing.
const generic: Scene = (g) => {
  const { p } = g;
  const nodes = [{ x: 60, y: 110 }, { x: 170, y: 70 }, { x: 280, y: 110 }];
  for (let i = 0; i < 2; i++) {
    seg(g, nodes[i].x, nodes[i].y, nodes[i + 1].x, nodes[i + 1].y, p.rule, 1, 1.5);
    pulse(g, nodes[i].x, nodes[i].y, nodes[i + 1].x, nodes[i + 1].y, g.sec * 0.4 + i * 0.4, p.accent, 1, 2.4);
  }
  for (const n of nodes) dot(g, n.x, n.y, 6, p.ink, 0.9);
  missing(g, 300, 190);
};

const SCENES: Record<string, Scene> = {
  'openai-hugging-face-incident': openaiHuggingFace,
  'knight-capital-2012': knightCapital,
  'openai-misalignment-reports-september-2026': openaiMisalignment,
  'replit-agent-production-database': replitDatabase,
  'realpage-doj-algorithmic-pricing': realpagePricing,
  'anthropic-agentic-misalignment-simulation': anthropicSimulation,
};

// ---------------------------------------------------------------- runtime

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    ink: v('--ink', '#191938'),
    sub: v('--sub', '#55554f'),
    accent: v('--signal-ink', v('--signal', '#2F55E0')),
    rule: v('--rule', 'rgba(25,25,56,.2)'),
    paper: v('--paper', '#EDEEE4'),
  };
}

class Figure {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: Scene;
  still: number;
  layer: string;
  palette: Palette;
  w = 0;
  h = 0;
  k = 1;
  visible = false;

  constructor(el: HTMLElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.el = el;
    this.canvas = canvas;
    this.ctx = ctx;
    this.scene = SCENES[el.dataset.scene ?? ''] ?? generic;
    this.still = STILL_PHASE[el.dataset.scene ?? ''] ?? STATIC_PHASE;
    this.layer = el.dataset.layerLabel ?? '';
    this.palette = readPalette(el);
  }

  size() {
    const w = Math.max(1, Math.round(this.canvas.clientWidth));
    const h = Math.round((w * H) / W);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.k = w / W;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr * this.k, 0, 0, dpr * this.k, 0, 0);
  }

  recolor() {
    this.palette = readPalette(this.el);
  }

  draw(seconds: number, phaseOverride?: number) {
    if (!this.w) return;
    const phase = phaseOverride ?? ((seconds % LOOP_SECONDS) / LOOP_SECONDS);
    const fade = phaseOverride !== undefined ? 1 : ss(0, 0.03, phase) * (1 - ss(0.95, 1, phase));
    const g: G = { c: this.ctx, k: this.k, p: this.palette, sec: seconds, fade, layer: this.layer };
    this.ctx.clearRect(0, 0, W, H);
    this.scene(g, phase);
  }
}

function init() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-story-motion]'));
  if (!nodes.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const figures: Figure[] = [];
  const live = new Set<Figure>();
  let raf = 0;
  let last = 0;

  const paintStatic = (f: Figure) => f.draw(0, f.still);

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (now - last < 33) return;
    last = now;
    for (const f of live) f.draw(now / 1000);
  };

  const sync = () => {
    const run = !reduce.matches && live.size > 0 && !document.hidden;
    if (run && !raf) raf = requestAnimationFrame(tick);
    if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const f = figures.find((x) => x.el === entry.target);
      if (!f) continue;
      f.visible = entry.isIntersecting;
      if (f.visible) live.add(f);
      else live.delete(f);
    }
    sync();
  }, { threshold: 0.05 });

  for (const el of nodes) {
    const canvas = el.querySelector<HTMLCanvasElement>('canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) continue;
    const fig = new Figure(el, canvas, ctx);
    figures.push(fig);
    new ResizeObserver(() => {
      fig.size();
      if (reduce.matches || !fig.visible) paintStatic(fig);
    }).observe(canvas);
    el.dataset.ready = 'true';
    io.observe(el);
  }

  new MutationObserver(() => {
    for (const f of figures) {
      f.recolor();
      if (reduce.matches || !f.visible) paintStatic(f);
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onMotionChange = () => {
    for (const f of figures) paintStatic(f);
    sync();
  };
  reduce.addEventListener('change', onMotionChange);
  document.addEventListener('visibilitychange', sync);
}

init();
