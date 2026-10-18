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

const W = 1200;
const H = 630;
const INK = '#191938';
const BG = '#EDEEE4';
const SUB = '#55554f';
const SIGNAL = '#2F55E0';
const SITE = 'https://knowware.press';
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
    label: 'SYSTEMS OF INTELLIGENCE', value: 'A field guide, by Khayyam Wakil', url: `knowware.press${path}`,
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
    return {
      ...base,
      kicker: chapter[1] === 'x' ? 'CAPSTONE' : `CHAPTER ${chapter[1]}`,
      subtitle: 'A chapter of Knowware: Systems of Intelligence. Read the free preview.',
      label: 'KNOWWARE',
      value: 'The book, by Khayyam Wakil',
    };
  }
  return base;
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
    el('div', { flex: 1, flexDirection: 'column', justifyContent: 'center' }, [
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
