// Verified sign-up: nothing opens until the emailed link is used. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as readerRoute } from '../functions/api/reader.js';
import { confirmEmail, footerLines } from '../lib/server/mail.js';
import {
  MAX_DEVICES, confirmSignup, mintDevice, peekPending, readerFromToken, signOut, startSignup,
} from '../lib/server/reader.js';
import { INTEREST_CONSENT } from '../lib/site-facts.mjs';
import { sha256 } from '../lib/server/guard.js';
import { fakeKV, mockResend } from './kv.mjs';

const ORIGIN = 'https://knowware.systems';
const post = (body, extra = {}) => new Request(`${ORIGIN}/api/reader`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': '198.51.100.9', ...extra },
  body: JSON.stringify(body),
});
const mailEnv = () => ({ CLAIMS: fakeKV(), RESEND_API_KEY: 're_test_key', READER_FROM: 'Knowware <hello@knowware.institute>' });
const linkIn = (call) => call.body.text.match(/https:\/\/\S+/)[0];

test('a typed address only creates a pending record; the token is stored as a hash', async () => {
  const env = { CLAIMS: fakeKV() };
  const s = await startSignup(env, { email: 'a@example.com', chapter: '01', interest: false });
  assert.equal(s.known, false);
  assert.equal(await readerFromToken(env, s.token), null); // nothing unlocked
  assert.equal(JSON.stringify([...env.CLAIMS.m.entries()]).includes(s.token), false);
  assert.ok(await peekPending(env, s.token));
  assert.equal(env.CLAIMS.ttl.get(`pending:${await sha256(s.token)}`), 172800);
});

test('the link works once, verifies the address and signs this device in', async () => {
  const env = { CLAIMS: fakeKV() };
  const { token } = await startSignup(env, { email: 'a@example.com', chapter: '03', interest: false });
  const done = await confirmSignup(env, token);
  assert.equal(done.chapter, '03');
  const reader = await readerFromToken(env, done.deviceToken);
  assert.equal(reader.email, 'a@example.com');
  assert.ok(reader.verifiedAt);
  assert.equal(await confirmSignup(env, token), null); // second use: nothing
  assert.equal(await peekPending(env, token), null);
});

test('the news list is recorded only if ticked, only after confirmation, with the wording shown', async () => {
  const env = { CLAIMS: fakeKV() };
  const eh = await sha256('a@example.com');
  const plain = await startSignup(env, { email: 'a@example.com', chapter: '01', interest: false });
  assert.equal(env.CLAIMS.m.has(`interest:${eh}`), false);
  await confirmSignup(env, plain.token);
  assert.equal(env.CLAIMS.m.has(`interest:${eh}`), false); // reading never subscribes

  env.CLAIMS.m.delete(`mail10:${eh}`);
  const ticked = await startSignup(env, { email: 'a@example.com', chapter: '01', interest: true });
  assert.equal(env.CLAIMS.m.has(`interest:${eh}`), false); // asked, not yet confirmed
  await confirmSignup(env, ticked.token);
  const rec = JSON.parse(env.CLAIMS.m.get(`interest:${eh}`));
  assert.equal(rec.status, 'confirmed');
  assert.equal(rec.consent.text, INTEREST_CONSENT);
  assert.ok(rec.consent.askedAt && rec.consent.confirmedAt);
  assert.equal(rec.country, undefined); // no location kept
});

test('one address cannot be mailed twice in ten minutes, or more than five times a day', async () => {
  const env = { CLAIMS: fakeKV() };
  const eh = await sha256('a@example.com');
  assert.ok(await startSignup(env, { email: 'a@example.com', chapter: '01' }));
  assert.equal(await startSignup(env, { email: 'a@example.com', chapter: '01' }), null);
  for (let i = 0; i < 4; i++) { env.CLAIMS.m.delete(`mail10:${eh}`); assert.ok(await startSignup(env, { email: 'a@example.com', chapter: '01' })); }
  env.CLAIMS.m.delete(`mail10:${eh}`);
  assert.equal(await startSignup(env, { email: 'a@example.com', chapter: '01' }), null); // sixth today
});

test('an address keeps at most five devices; the oldest is signed out', async () => {
  const env = { CLAIMS: fakeKV() };
  const tokens = [];
  for (let i = 0; i < MAX_DEVICES + 1; i++) tokens.push(await mintDevice(env, 'a@example.com', 'confirm', new Date(2026, 9, 1, 0, 0, i).toISOString()));
  assert.equal(await readerFromToken(env, tokens[0]), null);
  for (const t of tokens.slice(1)) assert.ok(await readerFromToken(env, t));
  const devKeys = [...env.CLAIMS.m.keys()].filter((k) => k.startsWith('readerdev:'));
  assert.equal(devKeys.length, MAX_DEVICES);
});

test('signing out removes the device record and its index entry', async () => {
  const env = { CLAIMS: fakeKV() };
  const t = await mintDevice(env, 'a@example.com', 'confirm');
  await signOut(env, t);
  assert.equal(await readerFromToken(env, t), null);
  assert.equal([...env.CLAIMS.m.keys()].filter((k) => k.startsWith('readerdev:')).length, 0);
});

test('a record from the old unlock-on-entry flow (no verifiedAt) opens nothing', async () => {
  const env = { CLAIMS: fakeKV() };
  const old = 'A'.repeat(43);
  env.CLAIMS.m.set(`reader:${await sha256(old)}`, JSON.stringify({ email: 'a@example.com', createdAt: '2026-10-01T00:00:00Z' }));
  assert.equal(await readerFromToken(env, old), null);
});

test('POST sends one confirmation email and grants nothing', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    const res = await readerRoute({ request: post({ email: 'A@Example.com', chapter: '02', updates: true }), env });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, sent: true });
    assert.equal(res.headers.get('Set-Cookie'), null);
    assert.equal(m.calls.length, 1);
    const mail = m.calls[0].body;
    assert.deepEqual(mail.to, ['a@example.com']);
    assert.match(mail.subject, /Confirm your email/);
    assert.match(mail.text, /^Someone entered this address/);
    assert.match(mail.text, /\/api\/reader\/confirm\?t=[A-Za-z0-9_-]{43}/);
    assert.match(mail.text, /You also ticked the box/); // the news list is named in the confirmation
    assert.ok(mail.html.includes(linkIn(m.calls[0])));
    assert.equal(mail.reply_to, 'hello@knowware.systems');
  } finally { m.restore(); }
});

test('the answer is the same for a new address, a known one and a throttled one, and never carries the link', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    const first = await readerRoute({ request: post({ email: 'a@example.com' }), env });
    const again = await readerRoute({ request: post({ email: 'a@example.com' }), env }); // throttled
    const other = await readerRoute({ request: post({ email: 'b@example.com' }), env });
    const bodies = await Promise.all([first, again, other].map((r) => r.text()));
    assert.equal(new Set(bodies).size, 1);
    assert.equal(m.calls.length, 2); // the repeat was not mailed
    for (const b of bodies) assert.equal(b.includes(linkIn(m.calls[0])), false);
  } finally { m.restore(); }
});

test('the emailed link, once confirmed, is a sign-in link for an address that already reads', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    await readerRoute({ request: post({ email: 'a@example.com' }), env });
    const token = new URL(linkIn(m.calls[0])).searchParams.get('t');
    await confirmSignup(env, token);
    await env.CLAIMS.delete(`mail10:${await sha256('a@example.com')}`);
    await readerRoute({ request: post({ email: 'a@example.com' }), env });
    assert.match(m.calls[1].body.subject, /sign-in link/);
  } finally { m.restore(); }
});

test('bad input is refused; the honeypot and a foreign origin send nothing', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    assert.equal((await readerRoute({ request: post({ email: 'nope' }), env })).status, 422);
    assert.equal((await readerRoute({ request: post({ email: 'a@b.co\nBcc: x@y.co' }), env })).status, 422);
    assert.equal((await readerRoute({ request: post({ email: 'a@example.com' }, { Origin: 'https://evil.example' }), env })).status, 403);
    const trap = await readerRoute({ request: post({ email: 'a@example.com', company: 'Acme' }), env });
    assert.equal(trap.status, 200);
    assert.equal(m.calls.length, 0);
  } finally { m.restore(); }
});

test('a form post without JavaScript is answered with redirects, never a cookie or an address in the URL', async () => {
  const env = mailEnv();
  const m = mockResend();
  try {
    const req = new Request(`${ORIGIN}/api/reader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: ORIGIN, 'CF-Connecting-IP': '198.51.100.9' },
      body: 'email=a%40example.com&chapter=01',
    });
    const res = await readerRoute({ request: req, env });
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('Location'), '/read/sent/');
    assert.equal(res.headers.get('Set-Cookie'), null);
  } finally { m.restore(); }
});

test('with no email key the site refuses to unlock; the dev flag only works without a key', async () => {
  const bare = { CLAIMS: fakeKV() };
  const res = await readerRoute({ request: post({ email: 'a@example.com' }), env: bare });
  assert.equal(res.status, 503);
  assert.equal(res.headers.get('Set-Cookie'), null);

  const dev = { CLAIMS: fakeKV(), READER_AUTOCONFIRM: 'true' };
  const ok = await readerRoute({ request: post({ email: 'a@example.com', chapter: '04' }), env: dev });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).next, '/read/04/full');
  assert.match(ok.headers.get('Set-Cookie'), /^kw_reader=/);

  const m = mockResend();
  try {
    const prod = { CLAIMS: fakeKV(), READER_AUTOCONFIRM: 'true', RESEND_API_KEY: 're_test_key' };
    const r = await readerRoute({ request: post({ email: 'b@example.com' }), env: prod });
    assert.equal(r.headers.get('Set-Cookie'), null); // a real deployment ignores the flag
    assert.equal(m.calls.length, 1);
  } finally { m.restore(); }
});

test('if the email provider rejects the message the visitor is told, without the address', async () => {
  const env = mailEnv();
  const m = mockResend({ ok: false, status: 422 });
  const warn = console.warn; console.warn = () => {};
  try {
    const res = await readerRoute({ request: post({ email: 'a@example.com' }), env });
    assert.equal(res.status, 502);
    assert.equal(JSON.stringify(await res.json()).includes('example.com'), false);
  } finally { m.restore(); console.warn = warn; }
});

test('signing out via ?forget=1 removes this device only', async () => {
  const env = mailEnv();
  const keep = await mintDevice(env, 'a@example.com', 'confirm', '2026-10-01T00:00:00Z');
  const gone = await mintDevice(env, 'a@example.com', 'confirm', '2026-10-02T00:00:00Z');
  const req = new Request(`${ORIGIN}/api/reader?forget=1`, { headers: { Cookie: `kw_reader=${gone}` } });
  const res = await readerRoute({ request: req, env });
  assert.equal(res.status, 302);
  assert.equal(await readerFromToken(env, gone), null);
  assert.ok(await readerFromToken(env, keep));
});

test('confirmation email: plain text and HTML carry the same link, expiry and footer', () => {
  const link = 'https://knowware.systems/api/reader/confirm?t=' + 'x'.repeat(43);
  for (const opts of [{}, { interest: true }, { signin: true }]) {
    const m = confirmEmail({ link, ...opts });
    assert.ok(m.text.includes(link) && m.html.includes(link));
    for (const part of ['48 hours', 'ignore this email', 'hello@knowware.systems', '/privacy']) {
      assert.ok(m.text.includes(part), `text: ${part}`);
      assert.ok(m.html.includes(part), `html: ${part}`);
    }
    assert.equal(/ticked the box/.test(m.text), Boolean(opts.interest));
    assert.equal(/ticked the box/.test(m.html), Boolean(opts.interest));
  }
  assert.ok(footerLines().length >= 3);
});

test('HTML in the email is escaped', () => {
  const m = confirmEmail({ link: 'https://knowware.systems/x?a=1&b="<script>"' });
  assert.equal(m.html.includes('<script>'), false);
  assert.ok(m.html.includes('&lt;script&gt;'));
});
