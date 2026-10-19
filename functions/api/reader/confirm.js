// /api/reader/confirm — the page behind the emailed link.
//   GET  ?t=<token>   shows a "Confirm and read" button. It changes nothing, so a mail scanner that
//                     fetches every link cannot confirm an address on someone's behalf.
//   POST t=<token>    uses the link: verifies the address, signs this device in, opens the chapter.
// The link works once and expires in 48 hours.

import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, json, originAllowed } from '../../../lib/server/guard.js';
import { maskEmail } from '../../../lib/server/agent.js';
import { esc } from '../../../lib/server/mail.js';
import { confirmSignup, peekPending } from '../../../lib/server/reader.js';
import { accessCookies, redirect } from '../../../lib/server/reader-http.js';

function page(token, pending) {
  const body = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">
<title>Confirm your email — Knowware</title>
<style>
  body{margin:0;background:#f6f4ee;color:#1a1a1a;font:18px/1.55 "Helvetica Neue",Helvetica,Arial,sans-serif}
  main{max-width:34rem;margin:0 auto;padding:12vh 16px 48px}
  h1{font-size:1.6rem;line-height:1.2;margin:0 0 .75rem}
  p{margin:0 0 1.25rem}
  button{font:inherit;font-weight:600;background:#1a1a1a;color:#fff;border:2px solid #1a1a1a;padding:.75rem 1.4rem;min-height:48px;cursor:pointer}
  button:hover{background:#fff;color:#1a1a1a}
  :focus-visible{outline:3px solid #0b57d0;outline-offset:3px}
  .fine{font-size:.9rem;color:#444}
</style></head><body><main>
<h1>Confirm your email.</h1>
<p>This confirms <strong>${esc(maskEmail(pending.email))}</strong> and opens Knowware on this device.</p>
<form method="post" action="/api/reader/confirm"><input type="hidden" name="t" value="${esc(token)}"><button type="submit">Confirm and read</button></form>
<p class="fine" style="margin-top:1.5rem">Not you? Close this page. Nothing happens until you press the button.</p>
</main></body></html>`;
  return new Response(body, {
    headers: {
      ...pageHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
    },
  });
}

async function handleGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('t') || '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid');
  const pending = await peekPending(env, token);
  if (!pending) return redirect('/read/?link=expired');
  return page(token, pending);
}

async function handlePost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const raw = await request.text();
  const token = raw.length <= 512 ? new URLSearchParams(raw).get('t') || '' : '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid', [], 303);
  const done = await confirmSignup(env, token);
  if (!done) return redirect('/read/?link=expired', [], 303);
  return redirect(`/read/${done.chapter}/full#continue`, accessCookies(done.deviceToken), 303);
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'GET') return handleGet(context);
  if (method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
