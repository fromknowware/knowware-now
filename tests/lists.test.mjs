// The two lists (news and pre-order): separate, confirmed, exportable. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as adminLists } from '../functions/api/admin/lists.js';
import { onRequest as adminWaitlist } from '../functions/api/admin/waitlist.js';
import { toCsv } from '../lib/server/admin.js';
import { sha256 } from '../lib/server/guard.js';
import { listJoinHandler } from '../lib/server/list-endpoint.js';
import { LISTS, confirmJoin, listMembers, peekJoin, readSubmission, recordMember, requestJoin } from '../lib/server/lists.js';
import { INTEREST_CONSENT, WAITLIST_CONSENT } from '../lib/site-facts.mjs';
import { fakeKV, mockResend } from './kv.mjs';

const ORIGIN = 'https://knowware.systems';
const ADMIN = 'a'.repeat(40);
const key = async (list, email) => `${list}:${await sha256(email)}`;

test('submissions are normalised, validated, and the honeypot is detected', () => {
  assert.deepEqual(readSubmission({ email: '  Reader@Example.COM ', company: '' }), { email: 'reader@example.com', valid: true, trap: false });
  assert.equal(readSubmission({ email: 'nope' }).valid, false);
  assert.equal(readSubmission({ email: 'a@b.co', company: 'Acme' }).trap, true);
  for (const bad of [null, undefined, 5, {}, [], 'x', { toString: 1 }]) assert.doesNotThrow(() => readSubmission({ email: bad }));
  assert.equal(readSubmission({ email: 'a@b.co\nBcc: evil@x.co' }).valid, false);
  assert.equal(readSubmission({ email: 'x'.repeat(300) + '@b.co' }).valid, false);
});

test('asking to join stores nothing lasting until the link is used', async () => {
  const env = { CLAIMS: fakeKV() };
  const { token } = await requestJoin(env, 'waitlist', 'a@example.com', '2026-10-16T00:00:00Z');
  assert.equal(env.CLAIMS.m.has(await key('waitlist', 'a@example.com')), false);
  assert.equal(JSON.stringify([...env.CLAIMS.m.entries()]).includes(token), false);
  assert.equal(env.CLAIMS.ttl.get(`lpending:${await sha256(token)}`), 172800);
  assert.equal((await peekJoin(env, token)).list, 'waitlist');
});

test('confirming adds the address to that one list, with the consent wording shown, once', async () => {
  const env = { CLAIMS: fakeKV() };
  const { token } = await requestJoin(env, 'waitlist', 'a@example.com', '2026-10-16T00:00:00Z');
  const done = await confirmJoin(env, token, '2026-10-16T01:00:00Z');
  assert.deepEqual(done, { list: 'waitlist', email: 'a@example.com' });
  const rec = JSON.parse(env.CLAIMS.m.get(await key('waitlist', 'a@example.com')));
  assert.deepEqual([rec.status, rec.consent.text, rec.consent.askedAt, rec.consent.confirmedAt, rec.consent.source],
    ['confirmed', WAITLIST_CONSENT, '2026-10-16T00:00:00Z', '2026-10-16T01:00:00Z', 'order-page']);
  assert.equal(rec.country, undefined);
  assert.equal(await confirmJoin(env, token), null); // second use
});

test('the lists are separate: joining one never joins the other', async () => {
  const env = { CLAIMS: fakeKV() };
  const w = await requestJoin(env, 'waitlist', 'a@example.com');
  await confirmJoin(env, w.token);
  assert.equal(env.CLAIMS.m.has(await key('interest', 'a@example.com')), false);
  const eh = await sha256('a@example.com');
  env.CLAIMS.m.delete(`mail10:${eh}`);
  const i = await requestJoin(env, 'interest', 'a@example.com');
  await confirmJoin(env, i.token);
  const rec = JSON.parse(env.CLAIMS.m.get(await key('interest', 'a@example.com')));
  assert.equal(rec.consent.text, INTEREST_CONSENT);
  assert.notEqual(INTEREST_CONSENT, WAITLIST_CONSENT);
});

test('a member is not mailed again, and an address is throttled', async () => {
  const env = { CLAIMS: fakeKV() };
  const first = await requestJoin(env, 'waitlist', 'a@example.com');
  assert.equal(await requestJoin(env, 'waitlist', 'a@example.com'), null); // throttled
  await confirmJoin(env, first.token);
  env.CLAIMS.m.delete(`mail10:${await sha256('a@example.com')}`);
  assert.equal(await requestJoin(env, 'waitlist', 'a@example.com'), null); // already a member
});

test('the first consent record is kept; someone who left and returns gets a fresh one', async () => {
  const env = { CLAIMS: fakeKV() };
  await recordMember(env, 'interest', 'a@example.com', { source: 'chapter-gate', askedAt: '2026-10-01T00:00:00Z', now: '2026-10-01T00:05:00Z' });
  assert.equal((await recordMember(env, 'interest', 'a@example.com', { source: 'news-form', now: '2027-01-01T00:00:00Z' })).created, false);
  const k = await key('interest', 'a@example.com');
  assert.equal(JSON.parse(env.CLAIMS.m.get(k)).consent.source, 'chapter-gate');
  env.CLAIMS.m.set(k, JSON.stringify({ ...JSON.parse(env.CLAIMS.m.get(k)), status: 'unsubscribed' }));
  assert.equal((await recordMember(env, 'interest', 'a@example.com', { source: 'news-form', now: '2027-02-01T00:00:00Z' })).created, true);
  assert.equal(JSON.parse(env.CLAIMS.m.get(k)).consent.confirmedAt, '2027-02-01T00:00:00Z');
});

test('the export lists confirmed members by default; legacy and unsubscribed rows only on request', async () => {
  const env = { CLAIMS: fakeKV() };
  await recordMember(env, 'waitlist', 'in@example.com', { source: 'order-page' });
  env.CLAIMS.m.set(await key('waitlist', 'old@example.com'), JSON.stringify({ email: 'old@example.com', createdAt: '2026-10-01T00:00:00Z', consent: { text: 'x', at: 'y' } }));
  env.CLAIMS.m.set(await key('waitlist', 'gone@example.com'), JSON.stringify({ email: 'gone@example.com', status: 'unsubscribed', createdAt: '2026-10-01T00:00:00Z' }));
  assert.deepEqual((await listMembers(env, 'waitlist')).entries.map((e) => e.email), ['in@example.com']);
  const all = (await listMembers(env, 'waitlist', { status: 'all' })).entries;
  assert.deepEqual(all.map((e) => e.status).sort(), ['confirmed', 'legacy', 'unsubscribed']);
  assert.deepEqual((await listMembers(env, 'interest')).entries, []); // the other list is untouched
});

test('the CSV leads with the email, documents consent, and neutralises spreadsheet formulas', async () => {
  const env = { CLAIMS: fakeKV() };
  for (const e of ['a@example.com', '=cmd@example.com', '+x@example.com']) await recordMember(env, 'waitlist', e, { source: 'order-page' });
  const csv = toCsv((await listMembers(env, 'waitlist')).entries);
  assert.match(csv, /^email,list,status,created_at,confirmed_at,consent,source\n/);
  assert.match(csv, /"'=cmd@example.com"/);
  assert.match(csv, /"'\+x@example.com"/);
  assert.equal(csv.includes(',"=cmd'), false);
  assert.ok(csv.includes(WAITLIST_CONSENT));
});

// --- the HTTP handlers ---
const post = (body, extra = {}) => new Request(`${ORIGIN}/api/x`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': '198.51.100.9', ...extra }, body: JSON.stringify(body),
});
const waitlist = listJoinHandler('waitlist', { sentPath: '/order/listed', backPath: '/order#waitlist', bucket: 'waitlist' });
const interest = listJoinHandler('interest', { sentPath: '/read/sent/', backPath: '/read/#news' });
const mailEnv = () => ({ CLAIMS: fakeKV(), RESEND_API_KEY: 're_test_key' });

test('joining sends one confirmation naming exactly what was asked for, and the answer never differs', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    const a = await waitlist({ request: post({ email: 'a@example.com' }), env });
    const again = await waitlist({ request: post({ email: 'a@example.com' }), env });
    const b = await interest({ request: post({ email: 'b@example.com' }), env });
    assert.deepEqual([await a.json(), await again.json(), await b.json()], Array(3).fill({ ok: true, sent: true }));
    assert.equal(m.calls.length, 2);
    assert.equal(m.calls[0].body.subject, LISTS.waitlist.subject);
    assert.ok(m.calls[0].body.text.includes(LISTS.waitlist.ask) && m.calls[0].body.html.includes(LISTS.waitlist.ask));
    assert.equal(m.calls[1].body.subject, LISTS.interest.subject);
    assert.match(m.calls[1].body.text, /\/api\/list\/confirm\?t=[A-Za-z0-9_-]{43}/);
    assert.equal(env.CLAIMS.m.has(await key('waitlist', 'a@example.com')), false); // not a member yet
  } finally { m.restore(); }
});

test('bad input, foreign origins and the honeypot send nothing; form posts get redirects', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    assert.equal((await waitlist({ request: post({ email: 'nope' }), env })).status, 422);
    assert.equal((await waitlist({ request: post({ email: 'a@example.com' }, { Origin: 'https://evil.example' }), env })).status, 403);
    assert.equal((await waitlist({ request: post({ email: 'a@example.com', company: 'Acme' }), env })).status, 200);
    assert.equal(m.calls.length, 0);
    const form = (body) => new Request(`${ORIGIN}/api/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: ORIGIN, 'CF-Connecting-IP': '198.51.100.9' }, body });
    const ok = await waitlist({ request: form('email=a%40example.com'), env });
    assert.equal(ok.status, 303);
    assert.equal(ok.headers.get('Location'), '/order/listed');
    const bad = await waitlist({ request: form('email=nope'), env });
    assert.equal(bad.headers.get('Location'), '/order#waitlist');
    assert.equal((await interest({ request: form('email=b%40example.com'), env })).headers.get('Location'), '/read/sent/');
  } finally { m.restore(); }
});

test('without an email key the lists refuse; the dev flag confirms at once but only without a key', async () => {
  assert.equal((await waitlist({ request: post({ email: 'a@example.com' }), env: { CLAIMS: fakeKV() } })).status, 503);
  const dev = { CLAIMS: fakeKV(), READER_AUTOCONFIRM: 'true' };
  assert.equal((await waitlist({ request: post({ email: 'a@example.com' }), env: dev })).status, 200);
  assert.ok(dev.CLAIMS.m.has(await key('waitlist', 'a@example.com')));
  const m = mockResend();
  try {
    const prod = { CLAIMS: fakeKV(), READER_AUTOCONFIRM: 'true', RESEND_API_KEY: 're_test_key' };
    await waitlist({ request: post({ email: 'a@example.com' }), env: prod });
    assert.equal(prod.CLAIMS.m.has(await key('waitlist', 'a@example.com')), false);
  } finally { m.restore(); }
});

// --- the admin export ---
const adminReq = (qs, token = ADMIN) => new Request(`${ORIGIN}/api/admin/lists${qs}`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'CF-Connecting-IP': '198.51.100.9' } });

test('the admin export is off without a token, needs it, and checks its parameters', async () => {
  const env = { CLAIMS: fakeKV() };
  assert.equal((await adminLists({ request: adminReq('?list=waitlist'), env })).status, 404);
  env.ADMIN_TOKEN = ADMIN;
  assert.equal((await adminLists({ request: adminReq('?list=waitlist', null), env })).status, 401);
  assert.equal((await adminLists({ request: adminReq('?list=nope'), env })).status, 400);
  assert.equal((await adminLists({ request: adminReq('?list=waitlist&status=pending'), env })).status, 400);
  assert.equal((await adminLists({ request: adminReq('?list=waitlist&format=xml'), env })).status, 400);
});

test('the admin export returns confirmed members as JSON or CSV; /api/admin/waitlist is the same list', async () => {
  const env = { CLAIMS: fakeKV(), ADMIN_TOKEN: ADMIN };
  await recordMember(env, 'waitlist', 'w@example.com', { source: 'order-page' });
  await recordMember(env, 'interest', 'i@example.com', { source: 'news-form' });
  const w = await (await adminLists({ request: adminReq('?list=waitlist'), env })).json();
  assert.deepEqual(w.entries.map((e) => e.email), ['w@example.com']);
  const i = await (await adminLists({ request: adminReq('?list=interest'), env })).json();
  assert.deepEqual(i.entries.map((e) => e.email), ['i@example.com']);
  const csv = await adminLists({ request: adminReq('?list=interest&format=csv'), env });
  assert.match(csv.headers.get('Content-Type'), /text\/csv/);
  assert.match(csv.headers.get('Content-Disposition'), /knowware-interest\.csv/);
  const alias = await (await adminWaitlist({ request: new Request(`${ORIGIN}/api/admin/waitlist`, { headers: { Authorization: `Bearer ${ADMIN}`, 'CF-Connecting-IP': '198.51.100.9' } }), env })).json();
  assert.deepEqual(alias.entries.map((e) => e.email), ['w@example.com']);
});
