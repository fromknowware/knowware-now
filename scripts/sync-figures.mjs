// Pulls the book's causal-diagram figures out of the manuscript repo and works out where each belongs in
// the current chapter text.   node scripts/sync-figures.mjs
//
// Why this exists: the manuscript repo ships 65 SVG figures and a PLACEMENT.md per chapter, but its "after
// line N" placements were written on 2026-04-09 and the chapters were rewritten afterwards (Apr 17+). So each
// figure is resolved against today's text, most reliable method first:
//   1. override      a hand-picked paragraph start (OVERRIDES below), for rewritten passages
//   2. anchor tail   the last 7 words of the quoted anchor appear in one paragraph
//   3. anchor words  >= 85% of the anchor's content words appear in one paragraph
//   4. original      the paragraph that sat at the stated line in the original text, matched forward by similarity
// A figure whose subject no longer appears in the rewritten text is skipped (SKIP below), not forced in.
//
// Output (commit both): public/figures/<chapter>/<slug>.svg (cropped to the drawing) and src/content/figures.json.
// The loader (src/loaders/manuscript.ts) inserts each figure after the paragraph that starts with `after`.
// Cropping measures each drawing in headless Chrome (CHROME=/path/to/chrome to override).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://raw.githubusercontent.com/fromknowware/systems-intelligence';
const ORIGINAL_TEXT_REF = '4fdfeb68'; // the commit the placement files were written against
const CHAPTERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 'X'];
const idOf = (c) => (c === 'X' ? 'x' : c);
const PAD = 28;

// Paragraph starts (first words) chosen by hand where the chapter was rewritten after the placements.
const OVERRIDES = {
  '3.2': 'Constitutional AI works by giving the AI a',
  '3.3': "LeCun's Joint-Embedding Predictive Architecture",
  '3.4': "The genius wasn't any single component. It was the coordination architecture",
  '3.6': 'In each case, the absence of a third coordinating element',
  '3.5': 'Traditional approaches optimized either evolutionary data OR physical constraints',
  '6.1': 'The National Transportation Safety Board investigation peeled back layers',
  '6.2': 'Russell\'s solution through Inverse Reinforcement Learning',
  '6.3': "Gebru's framework insists that the solution is not better algorithms",
  '6.4': '**The AI Material Three-Body System:**',
  '9.5': 'Turkle explained that technology undermines connection',
  'X.1': 'At every scale, the same architecture.',
};

// Figures whose subject was cut from the rewritten chapter, with the grep that shows it is gone.
const SKIP = {
  '1.2': 'composite triptych (2584px wide, unreadable at page width); its three diagrams are placed individually',
  '1.8': 'Burning Man no longer appears in chapter 1',
  '2.3': 'no first-principles / Musk passage in chapter 2',
  '2.4': "no Conway's Game of Life passage in chapter 2",
  '4.4': 'no 23andMe passage in chapter 4',
  '7.4': 'no Abbeel / sim-to-real passage in chapter 7',
  '9.4': 'no Yang passage in chapter 9',
  '9.6': 'no Menegon passage in chapter 9',
  'X.2': 'no Kurzweil passage in the rewritten capstone',
  'X.3': 'no Blueprint / Bryan Johnson passage in the rewritten capstone',
  'X.4': 'no Ostrom commons passage in the rewritten capstone',
  'X.5': 'no Verdon acceleration passage in the rewritten capstone',
  'X.6': 'no AGI-alignment-fork passage in the rewritten capstone',
};

const STOP = new Set('the a an of to and in that is it for as with on by or be are this their its not from at which can we you they what how more than into when if but has have was were will would about also'.split(' '));
const words = (s) => (s.replace(/[*_`]/g, '').toLowerCase().replace(/’/g, "'").match(/[a-z0-9]+/g) ?? []);
// Same normalisation as the loader: markdown marks and curly quotes off, whitespace collapsed.
const stripMd = (s) => s.replace(/[*_`]/g, '').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, ' ').trim();

const get = async (url, binary = false) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
};
const paragraphs = (text) => text.replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

function parseRows(md) {
  return [...md.matchAll(/^\| \*\*([\dA-Z]+\.\d+)\*\* \| `([^`]+)` \| \*\*(\d+)\*\* \| (.*?) \| /gm)].map((m) => ({
    label: m[1], file: m[2], slug: m[2].replace(/\.png$/, ''), line: Number(m[3]), anchor: m[4],
  }));
}

function resolve(row, paras, originalLines) {
  const pw = paras.map(words);
  const quoted = [...row.anchor.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  const anchorText = quoted.at(-1) ?? row.anchor;
  const aw = words(anchorText);
  // 1
  if (OVERRIDES[row.label]) {
    const want = stripMd(OVERRIDES[row.label]);
    const i = paras.findIndex((p) => stripMd(p).startsWith(want));
    return i >= 0 ? { i, how: 'override' } : null;
  }
  // 2
  const n = Math.min(aw.length, 7);
  if (n >= 4) {
    const tail = aw.slice(-n).join(' ');
    const i = pw.findIndex((p) => p.join(' ').includes(tail));
    if (i >= 0) return { i, how: 'anchor tail' };
  }
  // 3
  const content = aw.filter((w) => !STOP.has(w));
  if (content.length >= 4) {
    let best = [0, -1];
    pw.forEach((p, i) => {
      const set = new Set(p);
      const s = content.filter((w) => set.has(w)).length / content.length;
      if (s > best[0]) best = [s, i];
    });
    if (best[0] >= 0.85) return { i: best[1], how: `anchor words ${best[0].toFixed(2)}` };
  }
  // 4: the paragraph at the stated line in the original text, matched forward
  let k = Math.min(row.line - 1, originalLines.length - 1);
  while (k > 0 && !originalLines[k].trim()) k--;
  let s = k, e = k;
  while (s > 0 && originalLines[s - 1].trim()) s--;
  while (e + 1 < originalLines.length && originalLines[e + 1].trim()) e++;
  const ow = new Set(words(originalLines.slice(s, e + 1).join(' ')));
  let best = [0, -1];
  pw.forEach((p, i) => {
    const set = new Set(p);
    const j = [...set].filter((w) => ow.has(w)).length / new Set([...set, ...ow]).size;
    if (j > best[0]) best = [j, i];
  });
  return best[0] >= 0.5 ? { i: best[1], how: `original text ${best[0].toFixed(2)}` } : null;
}

function describe(g) {
  const byId = new Map(g.nodes.map((n) => [n.id, n.label]));
  const latent = g.nodes.filter((n) => n.is_latent).map((n) => n.label);
  const links = g.edges.filter((e) => !e.is_confounding).map((e) => `${byId.get(e.from)} ${e.polarity === 'negative' ? 'reduces' : 'raises'} ${byId.get(e.to)}`);
  const loops = (g.loops ?? []).map((l) => l.label);
  const parts = [`Causal diagram. ${g.summary}`, `Nodes: ${g.nodes.filter((n) => !n.is_latent).map((n) => n.label).join(', ')}.`];
  if (latent.length) parts.push(`Missing from the system: ${latent.join(', ')}.`);
  if (links.length) parts.push(`Links: ${links.join('; ')}.`);
  if (loops.length) parts.push(`Loops: ${loops.join('; ')}.`);
  return parts.join(' ');
}

// Measure each drawing in headless Chrome so the crop follows what is really drawn.
function measure(svgs) {
  const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!existsSync(chrome)) return null;
  const dir = mkdtempSync(join(tmpdir(), 'kw-figs-'));
  const page = join(dir, 'm.html');
  const body = svgs.map((s, i) => `<div id="s${i}">${s.replace(/^<\?xml[^>]*\?>/, '')}</div>`).join('');
  const script = `<script>
    const out = {};
    document.querySelectorAll('div[id^=s]').forEach((d) => {
      const svg = d.querySelector('svg');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      [...svg.children].filter((c) => c.tagName !== 'defs').forEach((c) => g.appendChild(c));
      svg.appendChild(g);
      const b = g.getBBox();
      out[d.id] = [b.x, b.y, b.width, b.height];
    });
    document.title = JSON.stringify(out);
  </script>`;
  return writeFile(page, `<!doctype html><meta charset="utf-8">${body}${script}`).then(() => {
    const dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=4000', '--dump-dom', `file://${page}`], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8' });
    const m = dom.match(/<title>(.*?)<\/title>/s);
    return m ? JSON.parse(m[1].replace(/&quot;/g, '"')) : null;
  });
}

function crop(svg, box, title) {
  const [bx, by, bw, bh] = box;
  const x = Math.floor(bx - PAD), y = Math.floor(by - PAD), w = Math.ceil(bw + PAD * 2), h = Math.ceil(bh + PAD * 2);
  const inner = svg.replace(/^<\?xml[^>]*\?>\s*/, '').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const fonts = inner.replace(/font-family="Barlow Condensed,sans-serif"/g, `font-family="'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif"`);
  return {
    w, h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>${fonts}</svg>\n`,
  };
}

const figures = {};
const report = [];
const staged = [];

for (const c of CHAPTERS) {
  const dirBase = `${REPO}/main/chapters/ch${c}`;
  const rows = parseRows(await get(`${dirBase}/PLACEMENT.md`));
  const current = paragraphs(await get(`${dirBase}/text/chapter-${c}.md`));
  const originalLines = (await get(`${REPO}/${ORIGINAL_TEXT_REF}/chapters/ch${c}/text/chapter-${c}.md`)).replace(/\r\n/g, '\n').split('\n');
  for (const row of rows) {
    if (SKIP[row.label]) { report.push(`skip   ${row.label}  ${SKIP[row.label]}`); continue; }
    const hit = resolve(row, current, originalLines);
    if (!hit) { report.push(`UNPLACED ${row.label}  ${row.anchor.slice(0, 90)}`); continue; }
    const short = row.slug.replace(/^ch\d+-/, '');
    let graph;
    try { graph = JSON.parse(await get(`${dirBase}/diagrams/graph/${row.slug}.json`)); }
    catch { graph = JSON.parse(await get(`${dirBase}/diagrams/graph/${short}.json`)); }
    const svg = await get(`${dirBase}/diagrams/svg/${row.slug}.svg`);
    staged.push({ c, row, hit, graph, svg, para: current[hit.i] });
    report.push(`place  ${row.label}  #${hit.i}  ${hit.how}  ${stripMd(current[hit.i]).slice(0, 60)}`);
  }
}

const boxes = (await measure(staged.map((s) => s.svg))) ?? {};
for (const [k, s] of staged.entries()) {
  const box = boxes[`s${k}`] ?? [0, 0, 1280, 950];
  const id = idOf(s.c);
  const out = crop(s.svg, box, s.graph.title);
  s.out = out; s.id = id;
}

// Number figures in reading order within each chapter (the source labels disagree with the text order in places).
for (const c of CHAPTERS) {
  const id = idOf(c);
  const list = staged.filter((s) => s.id === id).sort((a, b) => a.hit.i - b.hit.i || a.row.line - b.row.line);
  figures[id] = [];
  await mkdir(join(ROOT, 'public/figures', id), { recursive: true });
  for (const [n, s] of list.entries()) {
    const label = `${c === 'X' ? 'X' : Number(c)}.${n + 1}`;
    const slug = s.row.slug.replace(/^ch\d+-/, '');
    await writeFile(join(ROOT, 'public/figures', id, `${slug}.svg`), s.out.svg);
    figures[id].push({
      label,
      src: `/figures/${id}/${slug}.svg`,
      width: s.out.w,
      height: s.out.h,
      title: s.graph.title,
      caption: s.graph.summary,
      alt: describe(s.graph),
      after: stripMd(s.para).slice(0, 80),
    });
  }
}

await writeFile(join(ROOT, 'src/content/figures.json'), JSON.stringify(figures, null, 2) + '\n');
console.log(report.join('\n'));
console.log(`\n${Object.values(figures).flat().length} figures placed`);
