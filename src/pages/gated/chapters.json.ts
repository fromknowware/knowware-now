// Build-time only. The reader-gate integration moves this file out of dist and
// into lib/generated/chapters-md.js for the token-gated agent API, so the full
// Markdown is never served as a static file.
import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { chapterNum } from '../../lib/chapters';

export const GET: APIRoute = async () => {
  const chapters = (await getCollection('chapters')).sort((a, b) => a.data.n - b.data.n);
  const out: Record<string, unknown> = {};
  for (const c of chapters) {
    const full = await getEntry('manuscript', `${c.id}-full`);
    const preview = await getEntry('manuscript', `${c.id}-preview`);
    if (!full || !preview) throw new Error(`gated chapters: missing manuscript entry for ${c.id}`);
    out[c.id] = {
      n: full.data.n,
      number: chapterNum(full.data.n),
      title: full.data.title,
      dek: full.data.dek,
      words: full.data.totalWords,
      previewWords: preview.data.words,
      markdown: (full.body ?? '').replace(/<span id="continue"><\/span>\s*/g, '').trim(),
    };
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
