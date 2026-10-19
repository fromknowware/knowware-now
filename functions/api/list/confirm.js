// /api/list/confirm — the page behind a list confirmation link.
//   GET  ?t=<token>   shows a "Confirm" button; changes nothing.
//   POST t=<token>    uses the link once: the address joins that one list.

import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, json, originAllowed } from '../../../lib/server/guard.js';
import { maskEmail } from '../../../lib/server/agent.js';
import { confirmPage } from '../../../lib/server/confirm-page.js';
import { LISTS, confirmJoin, peekJoin } from '../../../lib/server/lists.js';
import { esc } from '../../../lib/server/mail.js';
import { redirect } from '../../../lib/server/reader-http.js';

async function handleGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('t') || '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid');
  const pending = await peekJoin(env, token);
  if (!pending) return redirect('/read/?link=expired');
  return confirmPage(pageHeaders, {
    heading: 'Confirm your email.',
    lead: `This confirms <strong>${esc(maskEmail(pending.email))}</strong> ${esc(LISTS[pending.list].ask)}.`,
    action: '/api/list/confirm',
    token,
    button: 'Confirm',
  });
}

async function handlePost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const raw = await request.text();
  const token = raw.length <= 512 ? new URLSearchParams(raw).get('t') || '' : '';
  if (!TOKEN_RE.test(token)) return redirect('/read/?link=invalid', [], 303);
  const done = await confirmJoin(env, token);
  if (!done) return redirect('/read/?link=expired', [], 303);
  return redirect(LISTS[done.list].done, [], 303);
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'GET') return handleGet(context);
  if (method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
