import type { Loader } from 'astro/loaders';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import figureData from '../content/figures.json';

// Full chapter text lives in the manuscript repo. Each build pulls the
// current text; a local cache keeps dev and offline builds working.
const SOURCE = 'https://raw.githubusercontent.com/fromknowware/systems-intelligence/main/chapters';
const CACHE_DIR = '.cache/manuscript';
const PREVIEW_TARGET_WORDS = 700;
const WORDS_PER_MINUTE = 230;

const pad = (n: number) => String(n).padStart(2, '0');
// File and id key per chapter; the capstone lives at chX and slugs as 'x'.
const srcKey = (n: number) => (n === 10 ? 'X' : pad(n));
const idKey = (n: number) => (n === 10 ? 'x' : pad(n));
const countWords = (text: string) => (text.replace(/[#>*_`[\]()-]/g, ' ').match(/\S+/g) ?? []).length;
const isHeading = (block: string) => /^#{1,6}\s/.test(block.trim());
const isRule = (block: string) => /^(-{3,}|\*{3,}|_{3,})$/.test(block.trim());

async function fetchChapter(n: number, logger: { warn: (m: string) => void }): Promise<string> {
  const file = join(CACHE_DIR, `ch${srcKey(n)}.md`);
  try {
    const res = await fetch(`${SOURCE}/ch${srcKey(n)}/text/chapter-${srcKey(n)}.md`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(file, text);
    return text;
  } catch (err) {
    try {
      const cached = await readFile(file, 'utf8');
      logger.warn(`chapter ${srcKey(n)}: using cached manuscript (${(err as Error).message})`);
      return cached;
    } catch {
      throw new Error(`chapter ${srcKey(n)}: manuscript unavailable and no cache (${(err as Error).message})`);
    }
  }
}


// Figures from the manuscript repo (see scripts/sync-figures.mjs). Each is placed after the paragraph that
// starts with `after`; a figure whose paragraph has been edited away is skipped and the build says so.
type Figure = { label: string; src: string; width: number; height: number; title: string; caption: string; alt: string; after: string };
const FIGURES = figureData as Record<string, Figure[]>;
const plain = (s: string) => s.replace(/[*_`]/g, '').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, ' ').trim();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const isFigure = (block: string) => block.startsWith('<figure class="kw-fig"');
const figureBlock = (f: Figure) =>
  `<figure class="kw-fig" id="fig-${f.label.replace('.', '-')}">\n` +
  `<div class="kw-fig-plate" role="region" tabindex="0" aria-label="Figure ${f.label}, scrolls sideways on small screens"><img src="${f.src}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}" decoding="async"></div>\n` +
  `<figcaption><span class="kw-fig-n">Figure ${f.label}</span> <strong>${esc(f.title)}.</strong> ${esc(f.caption)}</figcaption>\n` +
  `</figure>`;

function placeFigures(blocks: string[], figures: Figure[], warn: (m: string) => void): string[] {
  const out = [...blocks];
  // Insert from the bottom up so earlier indexes stay valid.
  const hits = figures
    .map((f) => ({ f, i: out.findIndex((b) => plain(b).startsWith(f.after)) }))
    .filter(({ f, i }) => (i < 0 ? (warn(`figure ${f.label} not placed: no paragraph starts "${f.after.slice(0, 50)}"`), false) : true))
    .sort((a, b) => b.i - a.i);
  for (const { f, i } of hits) out.splice(i + 1, 0, figureBlock(f));
  return out;
}

export function splitChapter(markdown: string, figures: Figure[] = [], warn: (m: string) => void = () => {}) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  let title = '';
  if (lines[i]?.startsWith('# ')) {
    title = lines[i].slice(2).replace(/^Chapter\s+\d+:\s*/i, '').trim();
    i++;
  }
  while (i < lines.length && !lines[i].trim()) i++;
  let dek = '';
  const dekMatch = lines[i]?.match(/^\*\*(.+)\*\*\s*$/);
  if (dekMatch) {
    dek = dekMatch[1].trim();
    i++;
  }

  const blocks = placeFigures(lines.slice(i).join('\n').trim().split(/\n{2,}/), figures, warn);
  let words = 0;
  let cut = 0;
  for (let k = 0; k < blocks.length; k++) {
    if (!isFigure(blocks[k])) words += countWords(blocks[k]);
    cut = k + 1;
    if (words >= PREVIEW_TARGET_WORDS && !isHeading(blocks[k]) && !isRule(blocks[k]) && !isFigure(blocks[k])) break;
  }
  // A figure that belongs to the last preview paragraph travels with it.
  while (blocks[cut] && isFigure(blocks[cut])) cut++;
  const preview = blocks.slice(0, cut);
  while (preview.length && (isHeading(preview.at(-1)!) || isRule(preview.at(-1)!))) preview.pop();
  const rest = blocks.slice(preview.length);

  return {
    title,
    dek,
    previewMd: preview.join('\n\n'),
    fullMd: [...preview, '<span id="continue"></span>', ...rest].join('\n\n'),
    previewWords: countWords(preview.filter((b) => !isFigure(b)).join(' ')),
    totalWords: countWords(blocks.filter((b) => !isFigure(b)).join(' ')),
  };
}

export function manuscriptLoader(): Loader {
  return {
    name: 'knowware-manuscript',
    load: async ({ store, logger, parseData, renderMarkdown, generateDigest }) => {
      store.clear();
      for (let n = 1; n <= 10; n++) {
        const raw = await fetchChapter(n, logger);
        const ch = splitChapter(raw, FIGURES[idKey(n)] ?? [], (m) => logger.warn(`chapter ${srcKey(n)}: ${m}`));
        const readMinutes = Math.max(1, Math.round(ch.totalWords / WORDS_PER_MINUTE));
        for (const kind of ['preview', 'full'] as const) {
          const id = `${idKey(n)}-${kind}`;
          const body = kind === 'preview' ? ch.previewMd : ch.fullMd;
          const data = await parseData({
            id,
            data: {
              n,
              kind,
              title: ch.title,
              dek: ch.dek,
              words: kind === 'preview' ? ch.previewWords : ch.totalWords,
              totalWords: ch.totalWords,
              readMinutes,
            },
          });
          store.set({ id, data, body, rendered: await renderMarkdown(body), digest: generateDigest(body) });
        }
      }
      logger.info('manuscript: 9 chapters and the capstone loaded');
    },
  };
}
