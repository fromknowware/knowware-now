// Author-only access to orders. Off unless ADMIN_TOKEN (a long random secret)
// is set in Cloudflare. One secret, compared in constant time after hashing,
// with its own failed-attempt guard. Never sent from a browser.

import { json, originAllowed, sha256 } from './guard.js';
import { bearer, ipKey, timingSafeEqualHex, windowLimited } from './agent.js';

export const ADMIN_MIN_LENGTH = 32;

export async function adminAuth(request, env) {
  const secret = env.ADMIN_TOKEN;
  if (typeof secret !== 'string' || secret.length < ADMIN_MIN_LENGTH) return { response: json({ ok: false, error: 'not_found' }, 404) };
  if (request.headers.get('Origin') && !originAllowed(request)) return { response: json({ ok: false, error: 'forbidden' }, 403) };
  const ip = await ipKey(env, request);
  if (await windowLimited(env, ['admfail', ip], 10, 600, { bump: false })) return { response: json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '600' }) };
  const given = bearer(request);
  const ok = given && timingSafeEqualHex(await sha256(given), await sha256(secret));
  if (!ok) {
    await windowLimited(env, ['admfail', ip], 10, 600);
    return { response: json({ ok: false, error: 'unauthorized' }, 401, { 'WWW-Authenticate': 'Bearer realm="knowware-admin"' }) };
  }
  return { ok: true };
}

// One page of orders (KV list order), optionally filtered by status.
export async function listOrders(env, { cursor, limit = 50, status } = {}) {
  const page = await env.CLAIMS.list({ prefix: 'order:', limit: Math.min(Math.max(limit, 1), 100), cursor: cursor || undefined });
  const orders = [];
  for (const k of page.keys) {
    let o;
    try { o = JSON.parse((await env.CLAIMS.get(k.name)) || 'null'); } catch { o = null; }
    if (!o || (status && o.status !== status)) continue;
    orders.push({
      id: o.id, mode: o.mode, status: o.status, product: o.product, amount_cents: o.amountCents, currency: o.currency,
      created_at: o.createdAt, paid_at: o.paidAt || null, transaction: o.transaction || null, session: o.sessionId || null,
      human: { id: o.principal?.id, email: o.principal?.email },
      agent: { name: o.agent?.name, operator: o.agent?.operator },
      context: o.context, fulfilment: o.fulfilment || null,
    });
  }
  return { orders, cursor: page.list_complete ? null : page.cursor || null };
}

// The waiting list, for the author to export when pre-orders open.
export async function listWaitlist(env, { cursor, limit = 100 } = {}) {
  const page = await env.CLAIMS.list({ prefix: 'waitlist:', limit: Math.min(Math.max(limit, 1), 1000), cursor: cursor || undefined });
  const entries = [];
  for (const k of page.keys) {
    let o;
    try { o = JSON.parse((await env.CLAIMS.get(k.name)) || 'null'); } catch { o = null; }
    if (o && typeof o.email === 'string') entries.push({ email: o.email, created_at: o.createdAt });
  }
  return { entries, cursor: page.list_complete ? null : page.cursor || null };
}

// Spreadsheet-safe CSV: a cell that starts with = + - @ is read as a formula, so prefix a quote.
export function toCsv(entries) {
  const cell = (v) => { const t = String(v ?? ''); const safe = /^[=+\-@\t\r]/.test(t) ? `'${t}` : t; return `"${safe.replace(/"/g, '""')}"`; };
  return ['email,created_at', ...entries.map((e) => `${cell(e.email)},${cell(e.created_at)}`)].join('\n') + '\n';
}
