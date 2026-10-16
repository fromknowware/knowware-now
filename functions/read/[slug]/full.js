// /read/:slug/full — full chapter text for signed-up readers only.
// The HTML is generated at build time into lib/generated and never ships
// as a static file.

import chapters from '../../../lib/generated/full-chapters.js';
import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, readCookie, sha256 } from '../../../lib/server/guard.js';

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug);
  const html = /^0[1-9]$/.test(slug) ? chapters[slug] : undefined;
  if (!html) return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  const token = readCookie(request, 'kw_reader');
  const ok = TOKEN_RE.test(token) && (await env.CLAIMS.get(`reader:${await sha256(token)}`));

  if (!ok) {
    const headers = new Headers({ Location: `/read/${slug}/#unlock`, 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', 'kw_reader_ui=; Path=/; Max-Age=0; Secure; SameSite=Lax');
    return new Response(null, { status: 302, headers });
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
