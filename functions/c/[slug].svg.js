// /c/<slug>.svg — the chapter's causal diagram rendered as a social-sized
// SVG (1200×630), captioned with the chapter title and knowware.systems.
// Returns the diagram the book itself prints. Nothing on the card is
// attributed to any person — this is the book talking.

import chapters from '../../lib/generated/chapter-meta.js';

const W = 1200, H = 630;

// Palette tuned for both light and dark feeds (fallback from the on-page
// oklch values; many social previewers don't support oklch yet).
const INK = '#1C1C38';
const SUB = '#4A4B6E';
const NODE_FILL = '#1E2140';
const NODE_STROKE = '#9AA0C8';
const ARC = '#8A8FB8';
const LATENT = '#5C6194';
const BG = '#F4F3EA';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (next.length > max && cur) { lines.push(cur); cur = w; }
    else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function renderDiagram(diagram) {
  if (!diagram) return '';
  const DX = [240, W / 2, W - 240];
  const DY = [260, 350, 440];
  const px = (n) => DX[n.pos[0]];
  const py = (n) => DY[n.pos[1]];

  const arcs = (diagram.arcs || []).map((arc, i) => {
    const fn = diagram.nodes.find((n) => n.id === arc.from);
    const tn = diagram.nodes.find((n) => n.id === arc.to);
    if (!fn || !tn) return '';
    const ax = px(fn), ay = py(fn), bx = px(tn), by = py(tn);
    const dx = bx - ax, dy = by - ay;
    const len = Math.max(Math.hypot(dx, dy), 1);
    const c = 0.14 + (i % 3) * 0.04;
    const nx = -dy / len, ny = dx / len;
    const mx = (ax + bx) / 2 + nx * len * c;
    const my = (ay + by) / 2 + ny * len * c;
    const R = 56;
    const t1 = R / len, t2 = 1 - R / len;
    const d = `M ${ax + dx * t1} ${ay + dy * t1} Q ${mx} ${my} ${ax + dx * t2} ${ay + dy * t2}`;
    const isLatent = arc.kind === 'latent';
    const stroke = isLatent ? LATENT : ARC;
    const label = !isLatent && arc.label
      ? `<text x="${mx}" y="${my - 10}" font-family="JetBrains Mono, monospace" font-size="14" fill="${SUB}" text-anchor="middle">${esc(arc.label)}</text>`
      : '';
    return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${isLatent ? 1.2 : 1.8}" stroke-dasharray="${isLatent ? '5 4' : 'none'}" ${isLatent ? '' : 'marker-end="url(#arrow)"'}/>${label}`;
  }).join('');

  const nodes = diagram.nodes.map((n) => {
    const x = px(n), y = py(n), r = n.latent ? 38 : 54;
    const lines = n.label.split('\n');
    const circle = `<circle cx="${x}" cy="${y}" r="${r}" fill="${NODE_FILL}" stroke="${n.latent ? LATENT : NODE_STROKE}" stroke-width="${n.latent ? 1.2 : 1.8}" ${n.latent ? 'stroke-dasharray="5 4"' : ''}/>`;
    const text = lines.map((ln, i) => `<text x="${x}" y="${y + (i - (lines.length - 1) / 2) * 16}" font-family="JetBrains Mono, monospace" font-size="13" fill="#EDEEE4" text-anchor="middle" dominant-baseline="middle">${esc(ln)}</text>`).join('');
    return circle + text;
  }).join('');

  return `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${ARC}"/></marker></defs>${arcs}${nodes}`;
}

export function onRequestGet({ params }) {
  const slug = String(params.slug);
  const chapter = chapters[slug];
  if (!chapter) {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const nn = chapter.n === 10 ? 'X' : String(chapter.n).padStart(2, '0');
  const titleLines = wrap(chapter.title, 36);
  const captionLines = chapter.diagram ? wrap(chapter.diagram.caption, 90).slice(0, 3) : [];

  const titleY0 = 110;
  const captionY0 = 510;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Knowware Chapter ${nn}: ${esc(chapter.title)}">`,
    `<rect width="${W}" height="${H}" fill="${BG}"/>`,
    `<rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${SUB}" stroke-width="1"/>`,
    `<text x="80" y="80" font-family="JetBrains Mono, monospace" font-size="18" fill="${SUB}" letter-spacing="1.5">KNOWWARE · CHAPTER ${nn}</text>`,
    titleLines.map((ln, i) => `<text x="80" y="${titleY0 + i * 44}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="40" fill="${INK}">${esc(ln)}</text>`).join(''),
    chapter.diagram ? `<text x="80" y="230" font-family="JetBrains Mono, monospace" font-size="14" fill="${SUB}" letter-spacing="1">CAUSAL GRAPH · ${esc(chapter.diagram.title.toUpperCase())}</text>` : '',
    renderDiagram(chapter.diagram),
    captionLines.map((ln, i) => `<text x="80" y="${captionY0 + i * 24}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="18" fill="${SUB}">${esc(ln)}</text>`).join(''),
    `<text x="80" y="${H - 60}" font-family="JetBrains Mono, monospace" font-size="18" fill="${INK}" letter-spacing="1">knowware.systems</text>`,
    `<text x="${W - 80}" y="${H - 60}" font-family="JetBrains Mono, monospace" font-size="18" fill="${SUB}" letter-spacing="1" text-anchor="end">Systems of Intelligence</text>`,
    `</svg>`,
  ].join('');

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
