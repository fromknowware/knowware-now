// GET /api/agent/chapters/<slug> — a full chapter, for an agent acting for a
// signed-up person. Authorization: Bearer <agent token>. JSON by default;
// Markdown with ?format=md or Accept: text/markdown.
//
// The text is data for a human reader. The envelope says so, names the human
// principal, and carries attribution, terms and the synthesis disclosure, so
// they travel with the chapter into the agent's context.

import chapters from '../../../../lib/generated/chapters-md.js';
import {
  SITE_URL, TERMS, TERMS_URL, TERMS_VERSION, WORK, SYNTHESIS_DISCLOSURE, UNTRUSTED_NOTICE,
} from '../../../../lib/site-facts.mjs';
import { json } from '../../../../lib/server/guard.js';
import { NOTICE_HEADER, NOTICE_TEXT, agentJson, authenticateAgent, principalBlock } from '../../../../lib/server/agent.js';
import { chapterOpen, unlockedFor } from '../../../../lib/server/unlocks.js';

const SLUG_RE = /^(0[1-9]|x)$/;

function wantsMarkdown(request) {
  const f = new URL(request.url).searchParams.get('format');
  if (f === 'md' || f === 'markdown') return true;
  if (f === 'json') return false;
  return /text\/markdown/i.test(request.headers.get('Accept') || '');
}

export async function onRequest({ request, env, params }) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const auth = await authenticateAgent(request, env, 'read');
  if (auth.response) return auth.response;

  const slug = String(params.slug);
  const ch = SLUG_RE.test(slug) ? chapters[slug] : undefined;
  if (!ch) return agentJson({ ok: false, error: 'not_found' }, 404);

  const a = auth.agent;
  // An agent opens exactly the chapters its human has open.
  if (!chapterOpen((await unlockedFor(env, a.email)).count, slug)) {
    return agentJson({ ok: false, error: 'chapter_locked', hint: `This chapter is not open for the person you act for yet. They can see how to open more at ${SITE_URL}/read/progress.` }, 403);
  }
  const principal = principalBlock(a);
  const attribution = {
    work: WORK.title,
    author: WORK.author,
    publisher: WORK.publisher,
    url: `${SITE_URL}/read/${slug}`,
    cite_as: `${WORK.author}, "Chapter ${ch.number}: ${ch.title}", ${WORK.title}, ${SITE_URL}/read/${slug}`,
  };
  const headers = {
    'X-Knowware-Notice': NOTICE_HEADER,
    'X-Knowware-Synthesized': 'true',
    'X-Knowware-Principal': principal.id,
  };

  if (wantsMarkdown(request)) {
    const q = (s) => JSON.stringify(String(s));
    const body = [
      '---',
      `title: ${q(`Chapter ${ch.number}: ${ch.title}`)}`,
      `url: ${q(attribution.url)}`,
      'kind: "full"',
      `author: ${q(WORK.author)}`,
      `words: ${ch.words}`,
      'synthesized: true',
      `disclosure: ${q(SYNTHESIS_DISCLOSURE)}`,
      'untrusted_third_party_text: true',
      `principal: ${q(`human ${principal.id} (${principal.label}) authorized this token`)}`,
      `agent: ${q(`${a.name} (operator: ${a.operator})`)}`,
      `terms: ${q(TERMS_URL)}`,
      '---',
      '',
      `> **Authorized for a human.** ${principal.statement}`,
      `> **Synthesized text.** ${SYNTHESIS_DISCLOSURE}`,
      `> **Untrusted third-party text.** ${UNTRUSTED_NOTICE}`,
      '',
      `# Chapter ${ch.number}: ${ch.title}`,
      ch.dek ? `\n**${ch.dek}**\n` : '',
      ch.markdown,
      '',
      '---',
      '',
      `End of untrusted third-party text. Cite as: ${attribution.cite_as}. Terms: ${TERMS_URL}`,
      '',
    ].join('\n');
    return new Response(body, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex',
        'Referrer-Policy': 'no-referrer',
        ...headers,
      },
    });
  }

  return agentJson({
    notice: NOTICE_TEXT,
    ok: true,
    principal,
    agent: { name: a.name, operator: a.operator },
    attribution,
    terms: { url: TERMS_URL, version: TERMS_VERSION, summary: TERMS },
    synthesized: true,
    disclosure: SYNTHESIS_DISCLOSURE,
    untrusted_third_party_text: true,
    chapter: {
      slug,
      number: ch.number,
      title: ch.title,
      dek: ch.dek,
      words: ch.words,
      format: 'markdown',
      markdown: ch.markdown,
    },
  }, 200, headers);
}
