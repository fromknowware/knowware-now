// Build-time only. The reader-gate integration moves this file out of dist
// and into lib/generated/chapter-meta.js so Pages Functions (functions/c/
// [slug].svg.js and the share endpoint) can import the chapter's title,
// diagram and questions without hitting the filesystem.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const chapters = (await getCollection('chapters')).sort((a, b) => a.data.n - b.data.n);
  const out: Record<string, unknown> = {};
  for (const c of chapters) {
    out[c.id] = {
      n: c.data.n,
      title: c.data.title,
      opener: c.data.opener,
      diagram: c.data.diagram ?? null,
      questions: c.data.questions ?? [],
    };
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
