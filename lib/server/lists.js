// The two mailing lists. They are different lists with different consent, stored separately,
// and joining one never joins the other:
//   interest   news when a chapter is published and when the print edition is ready
//   waitlist   one email when pre-orders open
// A person is on a list only after confirming the address. Until then the site keeps nothing but
// a 48-hour pending record, so an address typed by a stranger leaves no lasting trace.
//   <list>:<h(email)>   {email, status, createdAt, consent{text, askedAt, confirmedAt, source}}
//   lpending:<h(token)> {list, email, source, askedAt}
// Nothing here sends mail; the author exports the confirmed addresses (functions/api/admin/lists.js).

import { INTEREST_CONSENT, WAITLIST_CONSENT } from '../site-facts.mjs';
import { EMAIL_RE, clean, newToken, sha256 } from './guard.js';
import { PENDING_TTL_S, addressThrottled } from './throttle.js';
import { addCredit } from './unlocks.js';

export const LISTS = {
  interest: {
    consent: INTEREST_CONSENT,
    source: 'news-form',
    ask: 'to be emailed when a new Knowware chapter is published and when the print edition is ready',
    subject: 'Confirm: news about Knowware chapters and the print edition',
    done: '/read/subscribed/',
  },
  waitlist: {
    consent: WAITLIST_CONSENT,
    source: 'order-page',
    ask: 'to be emailed once, when Knowware pre-orders open',
    subject: 'Confirm: tell me when Knowware pre-orders open',
    done: '/order/confirmed/',
  },
};
export const LIST_NAMES = Object.keys(LISTS);
export const isList = (name) => Object.prototype.hasOwnProperty.call(LISTS, name);

const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

export function readSubmission(data) {
  const email = clean(data.email, 254).toLowerCase();
  return { email, valid: EMAIL_RE.test(email), trap: Boolean(clean(data.company, 200)) };
}

// Writes a confirmed membership. Idempotent: a confirmed member keeps their first consent record.
// Someone who left (status "unsubscribed") and asks again gets a fresh record.
export async function recordMember(env, list, email, { source, askedAt, now = new Date().toISOString() }) {
  const key = `${list}:${await sha256(email)}`;
  const existing = parse(await env.CLAIMS.get(key));
  if (existing?.status === 'confirmed') return { created: false };
  await env.CLAIMS.put(key, JSON.stringify({
    email,
    status: 'confirmed',
    createdAt: existing?.createdAt || now,
    consent: { text: LISTS[list].consent, askedAt: askedAt || now, confirmedAt: now, source },
  }));
  return { created: true };
}

// A person asked to join. Returns { token } to mail, or null when nothing should be mailed (already a
// member, or this address was mailed moments ago). The caller answers the same either way.
export async function requestJoin(env, list, email, now = new Date().toISOString()) {
  const eh = await sha256(email);
  if (parse(await env.CLAIMS.get(`${list}:${eh}`))?.status === 'confirmed') return null;
  if (await addressThrottled(env, eh)) return null;
  const token = newToken();
  await env.CLAIMS.put(
    `lpending:${await sha256(token)}`,
    JSON.stringify({ list, email, source: LISTS[list].source, askedAt: now }),
    { expirationTtl: PENDING_TTL_S },
  );
  return { token };
}

export async function peekJoin(env, token) {
  const p = parse(await env.CLAIMS.get(`lpending:${await sha256(token)}`));
  return p && isList(p.list) ? p : null;
}

// The link was used (once): the address is confirmed on that one list.
export async function confirmJoin(env, token, now = new Date().toISOString()) {
  const key = `lpending:${await sha256(token)}`;
  const p = parse(await env.CLAIMS.get(key));
  if (!p || !isList(p.list)) return null;
  await env.CLAIMS.delete(key);
  await recordMember(env, p.list, p.email, { source: p.source, askedAt: p.askedAt, now });
  // A thank-you chapter for the reader with this address, kept even if they later leave the list.
  await addCredit(env, await sha256(p.email), p.list, '1', now);
  return { list: p.list, email: p.email };
}

// One page of a list for the author's export. `status` is "confirmed" (default) or "all". Records
// that predate confirmation have no status and show as "legacy": they never confirmed, so a
// default export leaves them out.
export async function listMembers(env, list, { cursor, limit = 100, status = 'confirmed' } = {}) {
  const page = await env.CLAIMS.list({ prefix: `${list}:`, limit: Math.min(Math.max(limit, 1), 1000), cursor: cursor || undefined });
  const entries = [];
  for (const k of page.keys) {
    const o = parse(await env.CLAIMS.get(k.name));
    if (!o || typeof o.email !== 'string') continue;
    const st = o.status || 'legacy';
    if (status !== 'all' && st !== status) continue;
    entries.push({
      email: o.email, list, status: st, created_at: o.createdAt,
      confirmed_at: o.consent?.confirmedAt || '', consent: o.consent?.text || '', source: o.consent?.source || o.source || '',
    });
  }
  return { entries, cursor: page.list_complete ? null : page.cursor || null };
}
