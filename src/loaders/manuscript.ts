import type { Loader } from 'astro/loaders';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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

export function splitChapter(markdown: string) {
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

  const blocks = lines.slice(i).join('\n').trim().split(/\n{2,}/);
  let words = 0;
  let cut = 0;
  for (let k = 0; k < blocks.length; k++) {
    words += countWords(blocks[k]);
    cut = k + 1;
    if (words >= PREVIEW_TARGET_WORDS && !isHeading(blocks[k]) && !isRule(blocks[k])) break;
  }
  const preview = blocks.slice(0, cut);
  while (preview.length && (isHeading(preview.at(-1)!) || isRule(preview.at(-1)!))) preview.pop();
  const rest = blocks.slice(preview.length);

  return {
    title,
    dek,
    previewMd: preview.join('\n\n'),
    fullMd: [...preview, '<span id="continue"></span>', ...rest].join('\n\n'),
    previewWords: countWords(preview.join(' ')),
    totalWords: countWords(blocks.join(' ')),
  };
}

export function manuscriptLoader(): Loader {
  return {
    name: 'knowware-manuscript',
    load: async ({ store, logger, parseData, renderMarkdown, generateDigest }) => {
      store.clear();
      for (let n = 1; n <= 10; n++) {
        const raw = await fetchChapter(n, logger);
        const ch = splitChapter(raw);
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
