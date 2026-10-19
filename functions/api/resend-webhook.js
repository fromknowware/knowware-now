// POST /api/resend-webhook — Resend tells us about hard bounces, spam complaints and contact
// unsubscribes, so the lists here stay in step with what Resend will actually send to. Signed with
// Svix (RESEND_WEBHOOK_SECRET). Off (404) until that secret is set. Server to server: no Origin,
// no cookies, small bodies, each delivery id accepted once.

import { json } from '../../lib/server/guard.js';
import { applyResendEvent, verifySvix } from '../../lib/server/resend-webhook.js';
import { guard } from '../../lib/server/shield.js';

async function handle({ request, env }) {
  if (typeof env.RESEND_WEBHOOK_SECRET !== 'string' || env.RESEND_WEBHOOK_SECRET.length < 16) return json({ ok: false, error: 'not_found' }, 404);
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (Number(request.headers.get('Content-Length') || 0) > 65536) return json({ ok: false, error: 'too_large' }, 413);
  const body = await request.text();
  if (body.length > 65536) return json({ ok: false, error: 'too_large' }, 413);
  if (!(await verifySvix(env.RESEND_WEBHOOK_SECRET, request.headers, body))) return json({ ok: false, error: 'unauthorized' }, 401);

  const seen = `whid:${request.headers.get('svix-id')}`;
  if (await env.CLAIMS.get(seen)) return json({ ok: true, duplicate: true });
  await env.CLAIMS.put(seen, '1', { expirationTtl: 86400 });

  let event;
  try { event = JSON.parse(body); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  return json({ ok: true, acted: await applyResendEvent(env, event) });
}

export const onRequest = guard(handle, { exemptFromKillSwitch: true }); // not part of the agent API
