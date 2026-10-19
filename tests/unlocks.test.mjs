// Chapter unlocks: Chapter 1 on confirming, then one per earned action or per week. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as claimRoute } from '../functions/api/claim.js';
import { onRequest as meRoute } from '../functions/api/reader/me.js';
import { onRequest as noteRoute } from '../functions/api/reader/note.js';
import { sha256 } from '../lib/server/guard.js';
import { confirmJoin, requestJoin } from '../lib/server/lists.js';
import { confirmSignup, mintDevice, startSignup } from '../lib/server/reader.js';
import {
  CAPS, DRIP_MS, ORDER, addCredit, canonicalEmail, chapterOpen, creditInvite, creditsFor, ensureRefCode, unlockedFor,
} from '../lib/server/unlocks.js';
import { fakeKV, mockResend } from './kv.mjs';

const ORIGIN = 'https://knowware.systems';
const T0 = '2026-10-01T00:00:00.000Z';
const t0 = Date.parse(T0);

async function signUp(env, email, { ref, interest = false, now = T0 } = {}) {
  await env.CLAIMS.delete(`mail10:${await sha256(email)}`);
  const s = await startSignup(env, { email, chapter: '01', interest, ref }, now);
  return confirmSignup(env, s.token, now);
}

test('aliases of one mailbox are the same mailbox', () => {
  assert.equal(canonicalEmail('A.B+news@Gmail.com'), 'ab@gmail.com');
  assert.equal(canonicalEmail('ab@googlemail.com'), 'ab@gmail.com');
  assert.equal(canonicalEmail('a.b+x@example.com'), 'a.b@example.com');
});

test('a new reader has Chapter 1 only, one more opens each week, never more than ten', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'a@example.com');
  assert.equal((await unlockedFor(env, 'a@example.com', t0)).count, 1);
  assert.equal((await unlockedFor(env, 'a@example.com', t0 + 6 * 86400e3)).count, 1);
  const w2 = await unlockedFor(env, 'a@example.com', t0 + 2 * DRIP_MS + 1000);
  assert.equal(w2.count, 3);
  assert.equal(w2.nextDripAt, new Date(t0 + 3 * DRIP_MS).toISOString());
  const end = await unlockedFor(env, 'a@example.com', t0 + 40 * DRIP_MS);
  assert.equal(end.count, ORDER.length);
  assert.equal(end.nextDripAt, null);
});

test('chapters open in order', () => {
  assert.equal(chapterOpen(1, '01'), true);
  assert.equal(chapterOpen(1, '02'), false);
  assert.equal(chapterOpen(10, 'x'), true);
  assert.equal(chapterOpen(9, 'x'), false);
  assert.equal(chapterOpen(10, '99'), false);
});

test('a credit counts once, and each kind stops at its cap', async () => {
  const env = { CLAIMS: fakeKV() };
  const eh = await sha256('a@example.com');
  assert.equal(await addCredit(env, eh, 'note', 'n1'), true);
  assert.equal(await addCredit(env, eh, 'note', 'n1'), false); // same one again
  assert.equal(await addCredit(env, eh, 'note', 'n2'), true);
  assert.equal(await addCredit(env, eh, 'note', 'n3'), false); // cap of 2
  assert.equal(await addCredit(env, eh, 'bogus', 'x'), false);
  assert.equal((await creditsFor(env, eh)).note, 2);
  assert.ok(Object.values(CAPS).every((n) => n >= 1));
});

test('a new reader confirming through a share link opens a chapter for the person who shared it', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'alice@example.com');
  const code = await ensureRefCode(env, await sha256('alice@example.com'));
  assert.match(code, /^[A-HJ-NP-Z2-9]{8}$/);
  assert.equal((await unlockedFor(env, 'alice@example.com', t0)).count, 1);
  await signUp(env, 'bob@example.com', { ref: code });
  assert.equal((await unlockedFor(env, 'alice@example.com', t0)).count, 2);
  assert.equal((await unlockedFor(env, 'bob@example.com', t0)).count, 1); // the friend gets Chapter 1, like anyone
});

test('invites cannot be gamed: no self, no alias, no repeats, no existing readers, no unknown codes', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'alice.x@gmail.com');
  await signUp(env, 'carol@example.com');
  const a = await ensureRefCode(env, await sha256('alice.x@gmail.com'));
  const c = await ensureRefCode(env, await sha256('carol@example.com'));
  await signUp(env, 'alicex+me@gmail.com', { ref: a }); // the same mailbox
  assert.equal((await unlockedFor(env, 'alice.x@gmail.com', t0)).count, 1);
  await signUp(env, 'dave@example.com', { ref: a });
  await signUp(env, 'dave+again@example.com', { ref: c }); // the same mailbox, a second referrer
  assert.equal((await unlockedFor(env, 'alice.x@gmail.com', t0)).count, 2);
  assert.equal((await unlockedFor(env, 'carol@example.com', t0)).count, 1);
  await signUp(env, 'carol@example.com', { ref: a }); // already a reader, signing in again
  assert.equal((await unlockedFor(env, 'alice.x@gmail.com', t0)).count, 2);
  assert.equal(await creditInvite(env, 'ZZZZZZZZ', 'erin@example.com'), false);
  assert.equal(await creditInvite(env, 'bad', 'erin@example.com'), false);
});

test('invites stop at nine', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'alice@example.com');
  const code = await ensureRefCode(env, await sha256('alice@example.com'));
  for (let i = 0; i < 12; i++) await signUp(env, `friend${i}@example.com`, { ref: code });
  const u = await unlockedFor(env, 'alice@example.com', t0);
  assert.equal(u.credits.invite, 9);
  assert.equal(u.count, 10);
});

test('the pre-order list and the news list each open one chapter, and leaving never closes it', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'a@example.com');
  await env.CLAIMS.delete(`mail10:${await sha256('a@example.com')}`);
  const w = await requestJoin(env, 'waitlist', 'a@example.com', T0);
  await confirmJoin(env, w.token, T0);
  assert.equal((await unlockedFor(env, 'a@example.com', t0)).count, 2);
  // unsubscribing changes the membership record, not the credit
  const key = `waitlist:${await sha256('a@example.com')}`;
  env.CLAIMS.m.set(key, JSON.stringify({ ...JSON.parse(env.CLAIMS.m.get(key)), status: 'unsubscribed' }));
  assert.equal((await unlockedFor(env, 'a@example.com', t0)).count, 2);
  await signUp(env, 'a@example.com', { interest: true });
  assert.equal((await unlockedFor(env, 'a@example.com', t0)).credits.interest, 1);
});

test('merely asking for the news box, without confirming, opens nothing', async () => {
  const env = { CLAIMS: fakeKV() };
  await signUp(env, 'a@example.com');
  await env.CLAIMS.delete(`mail10:${await sha256('a@example.com')}`);
  await startSignup(env, { email: 'a@example.com', chapter: '01', interest: true }, T0); // not confirmed
  assert.equal((await unlockedFor(env, 'a@example.com', t0)).credits.interest, 0);
});

// --- endpoints ---
const authed = async (env, email) => {
  const now = new Date().toISOString(); // the endpoints read the real clock
  await signUp(env, email, { now });
  const token = await mintDevice(env, email, 'confirm', now);
  return { Cookie: `kw_reader=${token}` };
};
const req = (path, { method = 'GET', cookie = {}, body } = {}) => new Request(`${ORIGIN}${path}`, {
  method, headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.9', ...cookie }, ...(body ? { body: JSON.stringify(body) } : {}),
});

test('/api/reader/me needs a signed-in reader and reports what is open', async () => {
  const env = { CLAIMS: fakeKV() };
  assert.equal((await meRoute({ request: req('/api/reader/me'), env })).status, 401);
  const cookie = await authed(env, 'a@example.com');
  const me = await (await meRoute({ request: req('/api/reader/me', { cookie }), env })).json();
  assert.equal(me.unlocked >= 1, true);
  assert.equal(me.total, 10);
  assert.deepEqual(me.chapters[0], { slug: '01', open: true });
  assert.equal(me.chapters[1].open, false);
  assert.match(me.share_url, /\/read\/01\/\?ref=[A-HJ-NP-Z2-9]{8}#unlock$/);
  assert.equal(JSON.stringify(me).includes('a@example.com'), false); // the address is masked
});

test('a note reaches the author, with the reader as reply-to, and opens a chapter twice at most', async () => {
  const env = { CLAIMS: fakeKV(), RESEND_API_KEY: 're_test_key', CLAIM_NOTIFY_TO: 'author@example.com' };
  const cookie = await authed(env, 'a@example.com');
  const m = mockResend();
  try {
    const note = (text) => noteRoute({ request: req('/api/reader/note', { method: 'POST', cookie, body: { note: text, chapter: '01' } }), env });
    assert.equal((await noteRoute({ request: req('/api/reader/note', { method: 'POST', body: { note: 'x'.repeat(30) } }), env })).status, 401);
    assert.equal((await note('too short')).status, 422);
    const first = await (await note('The three-body figure made the argument click for me.')).json();
    assert.deepEqual([first.ok, first.credited], [true, true]);
    await note('Chapter three drags in the middle; trim the Knight Capital detour.');
    const third = await (await note('A third note should still reach the author but open nothing.')).json();
    assert.deepEqual([third.ok, third.credited], [true, false]);
    assert.equal(m.calls.length, 3);
    assert.deepEqual(m.calls[0].body.to, ['author@example.com']);
    assert.equal(m.calls[0].body.reply_to, 'a@example.com');
    assert.equal((await creditsFor(env, await sha256('a@example.com'))).note, 2);
  } finally { m.restore(); }
});

test('a nomination from a signed-in reader opens a chapter; one from a visitor does not', async () => {
  const env = { CLAIMS: fakeKV() };
  const cookie = await authed(env, 'a@example.com');
  const claim = { yourName: 'A', email: 'a@example.com', voiceName: 'Someone Real', voiceRole: 'Role', why: 'Because their work matters.' };
  const ok = await (await claimRoute({ request: req('/api/claim', { method: 'POST', cookie, body: claim }), env })).json();
  assert.deepEqual([ok.ok, ok.credited], [true, true]);
  const visitor = await (await claimRoute({ request: req('/api/claim', { method: 'POST', body: claim }), env })).json();
  assert.deepEqual([visitor.ok, visitor.credited], [true, false]);
  assert.equal((await creditsFor(env, await sha256('a@example.com'))).nominate, 1);
});
