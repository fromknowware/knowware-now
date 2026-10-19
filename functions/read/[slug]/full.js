// /read/:slug/full — full chapter text for confirmed readers, for the chapters they have open
// (Chapter 1 on confirming; more by invites, small actions, or one a week: lib/server/unlocks.js).
// The HTML is generated at build time into lib/generated and never ships
// as a static file.

import chapters from '../../../lib/generated/full-chapters.js';
import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, readCookie } from '../../../lib/server/guard.js';
import { readerFromToken } from '../../../lib/server/reader.js';
import { chapterOpen, unlockedFor } from '../../../lib/server/unlocks.js';

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug);
  const html = /^(0[1-9]|x)$/.test(slug) ? chapters[slug] : undefined;
  if (!html) return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  const token = readCookie(request, 'kw_reader');
  const reader = TOKEN_RE.test(token) ? await readerFromToken(env, token) : null;

  if (!reader) {
    const headers = new Headers({ Location: `/read/${slug}/#unlock`, 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', 'kw_reader_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax');
    return new Response(null, { status: 302, headers });
  }

  // Confirmed, but this chapter is not open yet: say how to open it instead of showing the gate.
  if (!chapterOpen((await unlockedFor(env, reader.email)).count, slug)) {
    return new Response(null, { status: 302, headers: { Location: `/read/progress/?locked=${slug}`, 'Cache-Control': 'no-store' } });
  }

  return new Response(html, {
    headers: {
      ...pageHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
