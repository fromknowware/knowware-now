// /api/remove/confirm — the page behind the removal link.
//   GET  ?t=<token>      shows three choices; changes nothing
//   POST t=<token> what=news|waitlist|all   does it, once, and tells the author so they can
//                        take the address out of any Resend segment it was imported into

import pageHeaders from '../../../lib/generated/page-headers.js';
import { TOKEN_RE, json, originAllowed } from '../../../lib/server/guard.js';
import { maskEmail } from '../../../lib/server/agent.js';
import { confirmPage } from '../../../lib/server/confirm-page.js';
import { sendMail } from '../../../lib/server/mail.js';
import { applyRemoval, peekRemoval } from '../../../lib/server/removal.js';
import { redirect } from '../../../lib/server/reader-http.js';
import { esc } from '../../../lib/server/mail.js';

async function handleGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('t') || '';
  if (!TOKEN_RE.test(token)) return redirect('/unsubscribe/?link=invalid');
  const pending = await peekRemoval(env, token);
  if (!pending) return redirect('/unsubscribe/?link=expired');
  return confirmPage(pageHeaders, {
    heading: 'What should we remove?',
    lead: `For <strong>${esc(maskEmail(pending.email))}</strong>. Stopping news or leaving the pre-order list keeps your reading and any chapters already open. Deleting everything signs you out everywhere and erases your reader record, both lists, your notes and nominations, and your invite link.`,
    action: '/api/remove/confirm',
    token,
    actions: [
      { value: 'news', label: 'Stop news emails' },
      { value: 'waitlist', label: 'Leave the pre-order list' },
      { value: 'all', label: 'Delete everything', danger: true },
    ],
  });
}

async function handlePost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'Requests must come from the Knowware site.' }, 403);
  const raw = await request.text();
  const p = new URLSearchParams(raw.length <= 512 ? raw : '');
  const token = p.get('t') || '';
  if (!TOKEN_RE.test(token)) return redirect('/unsubscribe/?link=invalid', [], 303);
  const done = await applyRemoval(env, token, p.get('what') || '');
  if (!done) return redirect('/unsubscribe/?link=expired', [], 303);
  if (env.CLAIM_NOTIFY_TO) {
    await sendMail(env, 'removal notice', {
      to: env.CLAIM_NOTIFY_TO,
      subject: 'Removal request done',
      text: `${done.email} asked to ${{ news: 'stop news emails', waitlist: 'leave the pre-order list', all: 'be deleted' }[done.choice]}. It is done on the site. If this address was imported into a Resend segment, remove or unsubscribe it there too.`,
    });
  }
  return redirect('/unsubscribed/', [], 303);
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'GET') return handleGet(context);
  if (method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
