// A 1200x630 social card for every indexable page, written to dist/og/<path>.png after the build.
//
// Base.astro points a page's og:image / twitter:image at /og/<path>.png unless the page brings its own
// (stories have theirs). This integration finds every built page that does, reads the page's own
// og:title and og:description, and renders a card in the Knowware palette with satori + resvg and the
// bundled JetBrains Mono, so cards look the same on every machine and no page needs a hand-made image.
//
// Voices carry the synthesis disclosure on the card itself, since a card travels without the page.
// The build fails if any page points at a card that was not written.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const W = 1200;
const H = 630;
const INK = '#191938';
const BG = '#EDEEE4';
const SUB = '#55554f';
const SIGNAL = '#2F55E0';
const SITE = 'https://knowware.systems';
const CARD_REF = new RegExp(`<meta property="og:image" content="${SITE}/og(/[^"]+)\\.png"`);

// What each static page is called on its card. Anything not listed uses its title as the kicker.
const KICKERS = {
  '/definition': 'DEFINITION',
  '/method': 'METHOD',
  '/rules': 'RULES',
  '/colophon': 'COLOPHON',
  '/contribute': 'CONTRIBUTE',
  '/order': 'PRE-ORDER',
  '/read': 'READ',
  '/the-81': 'THE 81',
  '/agents': 'FOR AGENTS',
};

const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const meta = (html, key) => {
  const m = html.match(new RegExp(`<meta (?:property|name)="${key.replace(/[:]/g, '\\:')}" content="([^"]*)"`));
  return m ? decode(m[1]) : '';
};

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('._')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (e.name === 'index.html') out.push(full);
  }
  return out;
}

const el = (type, style, children) => ({
  type,
  props: { style: { display: 'flex', ...style }, ...(children === undefined ? {} : { children }) },
});

const pill = (label, filled = true) =>
  el('div', {
    padding: '8px 14px', fontSize: 20, fontWeight: 700, letterSpacing: 3,
    border: `2px solid ${INK}`, background: filled ? INK : 'transparent', color: filled ? BG : INK,
  }, label);

// The bundled JetBrains Mono subsets have no arrows or approximately-equals, and a missing glyph draws
// as an empty box. Swap in plain equivalents (JetBrains Mono ligates -> into an arrow) and flag the rest.
const SWAPS = [[/↔/g, '<->'], [/→/g, '->'], [/←/g, '<-'], [/≈/g, '~'], [/≠/g, '!='], [/×/g, 'x']];
const SAFE = /^[\u0020-\u007E\u00A0-\u017F\u2013\u2014\u2018\u2019\u201C\u201D\u2026]*$/;
const unsupported = new Set();
function safe(text) {
  let out = text;
  for (const [re, to] of SWAPS) out = out.replace(re, to);
  if (!SAFE.test(out)) {
    for (const ch of out) if (!SAFE.test(ch)) unsupported.add(ch);
    out = [...out].map((ch) => (SAFE.test(ch) ? ch : '?')).join('');
  }
  return out;
}

// Satori does not clamp lines in this version, so shorten long descriptions: at the last full sentence
// that fits, else at a word boundary.
function clip(text, max) {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const sentence = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '));
  if (sentence >= 50) return head.slice(0, sentence + 1);
  return `${head.replace(/\s+\S*$/, '').replace(/[\s.,;:—-]+$/, '')}...`;
}

// A card hook should end where a sentence ends: take whole sentences while they fit, else clip.
function hook(text, max) {
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) ?? [text];
  let out = '';
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > max) break;
    out += sentence;
  }
  return out.trim().length >= 40 ? out.trim() : clip(text, max);
}

function titleSize(title) {
  const n = title.length;
  return n <= 18 ? 92 : n <= 30 ? 76 : n <= 46 ? 62 : n <= 70 ? 52 : 44;
}

/** What goes on a card, decided from the page's path and its own metadata. */
async function describe(path, html, root) {
  const title = meta(html, 'og:title').replace(/\s+—\s+Knowware$/, '');
  // A description that opens by repeating the title ("knowware (n.): ...") reads better without it.
  const raw = meta(html, 'og:description');
  const description = clip(raw.startsWith(`${title}: `) ? raw.slice(title.length + 2) : raw, 150);
  const base = {
    title: safe(title), subtitle: safe(description), kicker: KICKERS[path] ?? title.toUpperCase().slice(0, 22),
    label: 'SYSTEMS OF INTELLIGENCE', value: 'A field guide, by Khayyam Wakil', url: `knowware.systems${path}`,
  };

  const voice = path.match(/^\/voices\/([^/]+)$/);
  if (voice) {
    const data = JSON.parse(await readFile(join(root, 'src/content/voices', `${voice[1]}.json`), 'utf8'));
    const composite = data.status === 'anon';
    return {
      ...base,
      title: safe(data.name),
      subtitle: safe(data.role),
      kicker: composite ? 'COMPOSITE VOICE' : `VOICE · CHAPTER ${data.chapter}`,
      label: 'SYNTHESIZED',
      value: composite ? 'Not a real person or a quote' : 'From published work. Not a quote.',
    };
  }

  const chapter = path.match(/^\/read\/(\d\d|x)$/);
  if (chapter) {
    // A chapter card carries the chapter's own argument: its one-line hook and its causal diagram.
    const front = (await readFile(join(root, 'src/content/chapters', `${chapter[1]}.md`), 'utf8')).match(/^---\n([\s\S]*?)\n---/);
    const data = front ? parseYaml(front[1]) : {};
    const diagram = data.diagram;
    return {
      ...base,
      kicker: chapter[1] === 'x' ? 'CAPSTONE' : `CHAPTER ${chapter[1]}`,
      subtitle: diagram ? safe(hook(diagram.caption, 150)) : 'The capstone of Knowware: Systems of Intelligence.',
      label: 'FREE PREVIEW',
      value: safe(data.title ?? 'Read the chapter online'),
      diagram,
    };
  }
  return base;
}

// ── The chapter's causal diagram, drawn from its own nodes and arcs (src/content/chapters/*.md) ──
const PW = 440;
const PH = 300;
const NODE_W = 142;
const NODE_H = 58;
const COLS = [NODE_W / 2 + 4, PW / 2, PW - NODE_W / 2 - 4];
const ROWS = [NODE_H / 2 + 4, PH / 2, PH - NODE_H / 2 - 4];

function diagramPanel(d) {
  const at = new Map(d.nodes.map((n) => [n.id, { x: COLS[n.pos[0]], y: ROWS[n.pos[1]] }]));
  const inside = (p, c, pad) => Math.abs(p.x - c.x) <= NODE_W / 2 + pad && Math.abs(p.y - c.y) <= NODE_H / 2 + pad;
  const shapes = [];
  d.arcs.forEach((arc, i) => {
    const a = at.get(arc.from);
    const b = at.get(arc.to);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.max(Math.hypot(dx, dy), 1);
    const bend = 0.16 + (i % 3) * 0.04;
    const c = { x: (a.x + b.x) / 2 - (dy / len) * len * bend, y: (a.y + b.y) / 2 + (dx / len) * len * bend };
    const pt = (t) => ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y });
    const latent = arc.kind === 'latent';
    shapes.push({ type: 'path', props: { d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`, fill: 'none', stroke: latent ? SUB : SIGNAL, strokeWidth: latent ? 2 : 3, ...(latent ? { strokeDasharray: '7 6' } : {}) } });
    if (!latent) {
      // Arrowhead where the curve leaves the target box, pointing along the curve.
      let t = 1;
      while (t > 0.5 && inside(pt(t), b, 6)) t -= 0.01;
      const tip = pt(t), back = pt(Math.max(t - 0.04, 0));
      const ux = (tip.x - back.x) / Math.max(Math.hypot(tip.x - back.x, tip.y - back.y), 1);
      const uy = (tip.y - back.y) / Math.max(Math.hypot(tip.x - back.x, tip.y - back.y), 1);
      const bx = tip.x - ux * 16, by = tip.y - uy * 16;
      shapes.push({ type: 'path', props: { d: `M ${tip.x} ${tip.y} L ${bx - uy * 8} ${by + ux * 8} L ${bx + uy * 8} ${by - ux * 8} Z`, fill: SIGNAL } });
    }
  });
  const nodes = d.nodes.map((n) => {
    const p = at.get(n.id);
    const lines = n.label.split('\n').map((l) => el('div', {}, safe(l)));
    return el('div', {
      position: 'absolute', left: p.x - NODE_W / 2, top: p.y - NODE_H / 2, width: NODE_W, height: NODE_H, boxSizing: 'border-box',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 17, lineHeight: 1.15, textAlign: 'center',
      fontWeight: n.latent ? 400 : 700, color: n.latent ? SUB : INK, background: n.latent ? BG : '#F7F7F1',
      border: n.latent ? `2px dashed ${SUB}` : `2px solid ${INK}`,
    }, lines);
  });
  return el('div', { flexDirection: 'column', width: PW }, [
    el('div', { fontSize: 15, letterSpacing: 2, color: SUB, marginBottom: 14, textTransform: 'uppercase' }, safe(d.title)),
    el('div', { position: 'relative', width: PW, height: PH }, [
      { type: 'svg', props: { width: PW, height: PH, viewBox: `0 0 ${PW} ${PH}`, style: { position: 'absolute', left: 0, top: 0 }, children: shapes } },
      ...nodes,
    ]),
  ]);
}

function tree(c) {
  return el('div', { boxSizing: 'border-box', width: W, height: H, flexDirection: 'column', background: BG, color: INK, padding: '48px 56px', fontFamily: 'JetBrains Mono' }, [
    el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
      el('div', { alignItems: 'center', fontSize: 24, fontWeight: 800, letterSpacing: 5 }, [
        el('div', { width: 16, height: 16, borderRadius: 8, background: INK, marginRight: 14 }),
        'KNOWWARE',
      ]),
      pill(c.kicker),
    ]),
    c.diagram
      ? el('div', { flex: 1, alignItems: 'center', justifyContent: 'space-between' }, [
          el('div', { flexDirection: 'column', width: 600 }, [
            el('div', { fontSize: c.title.length <= 24 ? 62 : c.title.length <= 40 ? 52 : 44, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5 }, c.title),
            c.subtitle ? el('div', { fontSize: 22, fontWeight: 400, lineHeight: 1.4, color: SUB, marginTop: 20 }, c.subtitle) : el('div', {}),
          ]),
          diagramPanel(c.diagram),
        ])
      : el('div', { flex: 1, flexDirection: 'column', justifyContent: 'center' }, [
          el('div', { fontSize: titleSize(c.title), fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }, c.title),
          c.subtitle ? el('div', { fontSize: 28, fontWeight: 400, lineHeight: 1.35, color: SUB, marginTop: 22, maxWidth: 1000 }, c.subtitle) : el('div', {}),
        ]),
    el('div', { borderTop: `3px solid ${INK}`, paddingTop: 22, justifyContent: 'space-between', alignItems: 'flex-end' }, [
      el('div', { flexDirection: 'column' }, [
        el('div', { fontSize: 18, fontWeight: 400, letterSpacing: 4, color: SUB }, c.label),
        el('div', { fontSize: 26, fontWeight: 700, color: SIGNAL, marginTop: 6 }, c.value),
      ]),
      el('div', { fontSize: 20, fontWeight: 700, color: INK }, c.url),
    ]),
  ]);
}

export default function socialCards() {
  let root;
  return {
    name: 'knowware-social-cards',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const { default: satori } = await import('satori');
        const { Resvg } = await import('@resvg/resvg-js');
        const fontDir = join(root, 'node_modules/@fontsource/jetbrains-mono/files');
        const fonts = await Promise.all([400, 700, 800].map(async (weight) => ({
          name: 'JetBrains Mono',
          data: await readFile(join(fontDir, `jetbrains-mono-latin-${weight}-normal.woff`)),
          weight,
          style: 'normal',
        })));

        let made = 0;
        const missing = [];
        for (const file of await htmlFiles(out)) {
          const html = await readFile(file, 'utf8');
          const ref = html.match(CARD_REF);
          if (!ref) continue;
          const path = ref[1];
          const png = join(out, 'og', `${path}.png`);
          await mkdir(dirname(png), { recursive: true });
          const svg = await satori(tree(await describe(path, html, root)), { width: W, height: H, fonts });
          await writeFile(png, new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng());
          made++;
        }

        // Every card a page points at must exist.
        for (const file of await htmlFiles(out)) {
          const ref = (await readFile(file, 'utf8')).match(CARD_REF);
          if (ref) {
            try { await readFile(join(out, 'og', `${ref[1]}.png`)); } catch { missing.push(ref[1]); }
          }
        }
        if (missing.length) throw new Error(`social-cards: pages point at cards that were not written: ${missing.join(', ')}`);
        if (unsupported.size) logger.warn(`social-cards: characters the card font cannot draw were replaced with "?": ${[...unsupported].join(' ')}`);
        logger.info(`${made} social cards written to /og`);
      },
    },
  };
}
