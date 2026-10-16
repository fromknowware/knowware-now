// /read/<slug>.md — the free chapter preview as Markdown, with the synthesis
// disclosure in the file itself so it travels into an agent's context.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { chapterNum } from '../../lib/chapters';
import { SITE_URL, AUTHOR } from '../../config';
import { SYNTHESIS_DISCLOSURE, TERMS_URL, disclosureBlock, frontMatter } from '../../lib/agents';

export const getStaticPaths: GetStaticPaths = async () => {
  const chapters = await getCollection('chapters');
  return chapters.map((c) => ({ params: { slug: c.id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const slug = String(params.slug);
  const preview = await getEntry('manuscript', `${slug}-preview`);
  if (!preview) return new Response('Not found', { status: 404 });
  const d = preview.data;
  const num = chapterNum(d.n);
  const head = frontMatter({
    title: `Chapter ${num}: ${d.title}`,
    url: `${SITE_URL}/read/${slug}`,
    kind: 'preview',
    author: AUTHOR,
    words_in_preview: d.words,
    words_in_chapter: d.totalWords,
    synthesized: true,
    disclosure: SYNTHESIS_DISCLOSURE,
    untrusted_third_party_text: true,
    terms: TERMS_URL,
    full_text: `Full chapter requires a signed-up human reader; see ${SITE_URL}/agents`,
  });
  const body = [
    head,
    `# Chapter ${num}: ${d.title}`,
    d.dek ? `**${d.dek}**` : '',
    disclosureBlock(),
    (preview.body ?? '').trim(),
    `---\n\nThis is the free preview (${d.words} of ${d.totalWords} words). The full chapter is free for a person who signs up with an email at ${SITE_URL}/read/${slug}#unlock. If you act for that person, see ${SITE_URL}/agents.`,
  ]
    .filter(Boolean)
    .join('\n\n');
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
