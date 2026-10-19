// Leaving, erasure, and Resend's bounce/complaint/unsubscribe webhook. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { onRequest as requestRoute } from '../functions/api/remove/request.js';
import { onRequest as webhookRoute } from '../functions/api/resend-webhook.js';
import { mintToken, principalHash } from '../lib/server/agent.js';
import { sha256 } from '../lib/server/guard.js';
import { listMembers, recordMember, requestJoin } from '../lib/server/lists.js';
import { removalEmail, footerLines } from '../lib/server/mail.js';
import { applyRemoval, peekRemoval, startRemoval, suppress } from '../lib/server/removal.js';
import { confirmSignup, mintDevice, readerFromToken, startSignup } from '../lib/server/reader.js';
import { applyResendEvent, verifySvix } from '../lib/server/resend-webhook.js';
import { addCredit, creditsFor, ensureRefCode } from '../lib/server/unlocks.js';
import { fakeKV, mockResend } from './kv.mjs';

const ORIGIN = 'https://knowware.systems';
const eh = (e) => sha256(e);

async function reader(env, email) {
  await env.CLAIMS.delete(`mail10:${await eh(email)}`);
  const s = await startSignup(env, { email, chapter: '01', interest: true });
  return (await confirmSignup(env, s.token)).deviceToken;
}

test('a removal link is mailed only for an address we hold something for', async () => {
  const env = { CLAIMS: fakeKV() };
  assert.equal(await startRemoval(env, 'nobody@example.com'), null);
  await reader(env, 'a@example.com');
  await env.CLAIMS.delete(`mail10:${await eh('a@example.com')}`);
  const r = await startRemoval(env, 'a@example.com');
  assert.ok(r.token);
  assert.equal((await peekRemoval(env, r.token)).email, 'a@example.com');
  assert.equal(await startRemoval(env, 'a@example.com'), null); // throttled
});

test('leaving the news list keeps reading, the pre-order list and every open chapter', async () => {
  const env = { CLAIMS: fakeKV() };
  const dev = await reader(env, 'a@example.com'); // ticked the news box
  await recordMember(env, 'waitlist', 'a@example.com', { source: 'order-page' });
  await env.CLAIMS.delete(`mail10:${await eh('a@example.com')}`);
  const { token } = await startRemoval(env, 'a@example.com');
  assert.deepEqual(await applyRemoval(env, token, 'news'), { email: 'a@example.com', choice: 'news' });
  assert.deepEqual((await listMembers(env, 'interest')).entries, []);
  assert.deepEqual((await listMembers(env, 'interest', { status: 'unsubscribed' })).entries.map((e) => e.email), ['a@example.com']);
  assert.equal((await listMembers(env, 'waitlist')).entries.length, 1);
  assert.ok(await readerFromToken(env, dev));
  assert.equal((await creditsFor(env, await eh('a@example.com'))).interest, 1); // the chapter stays open
  assert.equal(await applyRemoval(env, token, 'news'), null); // single use
});

test('only the three choices work', async () => {
  const env = { CLAIMS: fakeKV() };
  await reader(env, 'a@example.com');
  await env.CLAIMS.delete(`mail10:${await eh('a@example.com')}`);
  const { token } = await startRemoval(env, 'a@example.com');
  for (const bad of ['', 'everything', 'ALL', undefined]) assert.equal(await applyRemoval(env, token, bad), null);
  assert.ok(await peekRemoval(env, token)); // a bad choice does not spend the link
});

test('deleting everything removes the person and keeps only other people\'s records and orders', async () => {
  const env = { CLAIMS: fakeKV() };
  const dev = await reader(env, 'a@example.com');
  await reader(env, 'b@example.com');
  const mine = await eh('a@example.com');
  const code = await ensureRefCode(env, mine);
  await addCredit(env, mine, 'note', 'n1');
  await recordMember(env, 'waitlist', 'a@example.com', { source: 'order-page' });
  env.CLAIMS.m.set('claim:2026-10-01:aaaa', JSON.stringify({ email: 'a@example.com', voiceName: 'X' }));
  env.CLAIMS.m.set('claim:2026-10-01:bbbb', JSON.stringify({ email: 'b@example.com', voiceName: 'Y' }));
  env.CLAIMS.m.set('note:2026-10-02:cccc', JSON.stringify({ email: 'a@example.com', note: 'hi' }));
  env.CLAIMS.m.set('order:ord_1', JSON.stringify({ principal: { email: 'a@example.com' } }));
  const tok = await mintToken({ ...env, AGENT_TOKENS: 'on' }, { email: 'a@example.com' }, { name: 'Test Agent', operator: 'Ops Co', lifetime: '1h', scopes: ['read'] });
  const agentKey = `agent:${await sha256(tok.token)}`;
  assert.ok(env.CLAIMS.m.has(agentKey));

  await env.CLAIMS.delete(`mail10:${mine}`);
  const { token } = await startRemoval(env, 'a@example.com');
  await applyRemoval(env, token, 'all');

  assert.equal(await readerFromToken(env, dev), null);
  assert.equal(env.CLAIMS.m.has(agentKey), false);
  assert.equal(env.CLAIMS.m.has(`refcode:${code}`), false);
  const left = [...env.CLAIMS.m.keys()];
  for (const k of left) assert.equal(k.includes(mine), false, `still keyed by the address: ${k.slice(0, 12)}`);
  assert.equal(left.some((k) => k === 'claim:2026-10-01:aaaa' || k === 'note:2026-10-02:cccc'), false);
  assert.ok(left.includes('claim:2026-10-01:bbbb')); // someone else's
  assert.ok(left.includes('order:ord_1')); // kept for the author's accounts
  assert.ok(await readerFromToken(env, await mintDevice(env, 'b@example.com', 'confirm'))); // b untouched
  assert.equal(JSON.parse(env.CLAIMS.m.get('order:ord_1')).principal.email, 'a@example.com'); // the order is untouched
});

test('a hard bounce or complaint ends all mail to that address and takes it off both lists', async () => {
  const env = { CLAIMS: fakeKV() };
  await recordMember(env, 'waitlist', 'a@example.com', { source: 'order-page' });
  await recordMember(env, 'interest', 'a@example.com', { source: 'news-form' });
  await suppress(env, 'a@example.com', 'complaint');
  assert.deepEqual((await listMembers(env, 'waitlist')).entries, []);
  assert.equal(await requestJoin(env, 'waitlist', 'a@example.com'), null);
  assert.equal(await startSignup(env, { email: 'a@example.com', chapter: '01' }), null);
});

// --- Resend webhook ---
const SECRET = `whsec_${Buffer.from('a-test-signing-secret-of-some-length').toString('base64')}`;
const sign = (id, ts, body, secret = SECRET) => `v1,${createHmac('sha256', Buffer.from(secret.replace('whsec_', ''), 'base64')).update(`${id}.${ts}.${body}`).digest('base64')}`;
const hdrs = (id, ts, sig) => new Headers({ 'svix-id': id, 'svix-timestamp': String(ts), 'svix-signature': sig });
const nowS = () => Math.floor(Date.now() / 1000);

test('Svix signatures: valid, rotated, tampered, stale, malformed', async () => {
  const body = '{"type":"x"}';
  const ts = nowS();
  assert.equal(await verifySvix(SECRET, hdrs('m1', ts, sign('m1', ts, body)), body), true);
  assert.equal(await verifySvix(SECRET, hdrs('m1', ts, `v1,AAAA ${sign('m1', ts, body)}`), body), true); // old key first
  assert.equal(await verifySvix(SECRET, hdrs('m1', ts, sign('m1', ts, body)), body + ' '), false);
  assert.equal(await verifySvix(SECRET, hdrs('m2', ts, sign('m1', ts, body)), body), false);
  assert.equal(await verifySvix(SECRET, hdrs('m1', ts - 3600, sign('m1', ts - 3600, body)), body), false);
  assert.equal(await verifySvix(SECRET, hdrs('m1', ts, 'v2,abc'), body), false);
  assert.equal(await verifySvix(SECRET, new Headers(), body), false);
  assert.equal(await verifySvix('', hdrs('m1', ts, sign('m1', ts, body)), body), false);
  assert.equal(await verifySvix('whsec_!!!notbase64', hdrs('m1', ts, 'v1,x'), body), false);
});

test('events: permanent bounce and complaint suppress; temporary bounce and other events do nothing; unsubscribe leaves both lists', async () => {
  const env = { CLAIMS: fakeKV() };
  for (const e of ['bounce@example.com', 'soft@example.com', 'spam@example.com', 'unsub@example.com']) {
    await recordMember(env, 'waitlist', e, { source: 'order-page' });
    await recordMember(env, 'interest', e, { source: 'news-form' });
  }
  assert.equal(await applyResendEvent(env, { type: 'email.bounced', data: { to: ['Bounce@Example.com'], bounce: { type: 'Permanent' } } }), 1);
  assert.equal(await applyResendEvent(env, { type: 'email.bounced', data: { to: ['soft@example.com'], bounce: { type: 'Temporary' } } }), 0);
  assert.equal(await applyResendEvent(env, { type: 'email.complained', data: { to: ['spam@example.com'] } }), 1);
  assert.equal(await applyResendEvent(env, { type: 'contact.updated', data: { email: 'unsub@example.com', unsubscribed: true } }), 1);
  assert.equal(await applyResendEvent(env, { type: 'contact.updated', data: { email: 'soft@example.com', unsubscribed: false } }), 0);
  assert.equal(await applyResendEvent(env, { type: 'email.opened', data: { to: ['soft@example.com'] } }), 0);
  assert.equal(await applyResendEvent(env, null), 0);
  assert.deepEqual((await listMembers(env, 'waitlist')).entries.map((e) => e.email), ['soft@example.com']);
  assert.ok(env.CLAIMS.m.has(`suppress:${await eh('bounce@example.com')}`));
  assert.equal(env.CLAIMS.m.has(`suppress:${await eh('unsub@example.com')}`), false); // leaving a list is not a mail ban
});

const hook = (env, body, h) => webhookRoute({ request: new Request(`${ORIGIN}/api/resend-webhook`, { method: 'POST', headers: h, body }), env });

test('the webhook is off without its secret, refuses bad signatures and replays, and acts once', async () => {
  const body = JSON.stringify({ type: 'email.complained', data: { to: ['spam@example.com'] } });
  const ts = nowS();
  const good = hdrs('msg_1', ts, sign('msg_1', ts, body));
  assert.equal((await hook({ CLAIMS: fakeKV() }, body, good)).status, 404);
  const env = { CLAIMS: fakeKV(), RESEND_WEBHOOK_SECRET: SECRET };
  assert.equal((await hook(env, body, hdrs('msg_1', ts, 'v1,AAAA'))).status, 401);
  const ok = await hook(env, body, good);
  assert.deepEqual(await ok.json(), { ok: true, acted: 1 });
  assert.deepEqual(await (await hook(env, body, good)).json(), { ok: true, duplicate: true });
  assert.equal((await webhookRoute({ request: new Request(`${ORIGIN}/api/resend-webhook`), env })).status, 405);
});

// --- the request endpoint ---
const post = (body, extra = {}) => new Request(`${ORIGIN}/api/remove/request`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': '198.51.100.9', ...extra }, body: JSON.stringify(body),
});

test('asking to leave gives the same answer for everyone and mails only people we hold', async () => {
  const env = { CLAIMS: fakeKV(), RESEND_API_KEY: 're_test_key' };
  await reader(env, 'a@example.com');
  await env.CLAIMS.delete(`mail10:${await eh('a@example.com')}`);
  const m = mockResend();
  try {
    const known = await (await requestRoute({ request: post({ email: 'a@example.com' }), env })).text();
    const unknown = await (await requestRoute({ request: post({ email: 'stranger@example.com' }), env })).text();
    assert.equal(known, unknown);
    assert.equal(m.calls.length, 1);
    assert.deepEqual(m.calls[0].body.to, ['a@example.com']);
    assert.match(m.calls[0].body.text, /\/api\/remove\/confirm\?t=[A-Za-z0-9_-]{43}/);
    assert.equal((await requestRoute({ request: post({ email: 'nope' }), env })).status, 422);
    assert.equal((await requestRoute({ request: post({ email: 'a@example.com' }, { Origin: 'https://evil.example' }), env })).status, 403);
    assert.equal((await requestRoute({ request: post({ email: 'a@example.com', company: 'x' }), env })).status, 200);
    assert.equal(m.calls.length, 1);
  } finally { m.restore(); }
});

test('the removal email and every footer carry the way out', () => {
  const m = removalEmail({ link: 'https://knowware.systems/api/remove/confirm?t=' + 'x'.repeat(43) });
  for (const part of ['24 hours', 'ignore this email', '/unsubscribe']) {
    assert.ok(m.text.includes(part) && m.html.includes(part), part);
  }
  assert.ok(footerLines().some((l) => l.includes('/unsubscribe')));
});
