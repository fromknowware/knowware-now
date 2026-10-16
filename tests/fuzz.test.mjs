// Property tests: whatever bytes arrive, the pure parsers and validators must not throw,
// and must reject rather than guess. Seeded, so a failure is reproducible.
import test from 'node:test';
import assert from 'node:assert/strict';
import { b64decode, checkPayload, requirements } from '../lib/server/x402.js';
import { verifySignature, formEncode } from '../lib/server/stripe.js';
import { validateCheckoutInput, IDEM_RE } from '../lib/server/checkout.js';
import { bearer, AGENT_TOKEN_RE, timingSafeEqualHex, maskEmail } from '../lib/server/agent.js';
import { clean } from '../lib/server/guard.js';

let seed = 20261016;
const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const junk = () => {
  const kinds = [
    () => '', () => 'a'.repeat(Math.floor(rand() * 20000)), () => String.fromCharCode(...Array.from({ length: Math.floor(rand() * 60) }, () => Math.floor(rand() * 65536))),
    () => Buffer.from(Array.from({ length: Math.floor(rand() * 100) }, () => Math.floor(rand() * 256))).toString('base64'),
    () => btoa(JSON.stringify({ x402Version: 2, accepted: rand() < 0.5 ? null : {}, payload: rand() < 0.5 ? [] : { authorization: 5, signature: {} } })),
    () => '{'.repeat(Math.floor(rand() * 5000)), () => '\u0000\u0001﻿\ud800', () => 'Bearer ' + 'x'.repeat(300), () => `t=${'9'.repeat(40)},v1=${'a'.repeat(64)}`, () => null, () => undefined, () => 5, () => ({}), () => [], () => ({ toString() { throw new Error('boom'); } }),
  ];
  return kinds[Math.floor(rand() * kinds.length)]();
};

test('parsers never throw on junk and reject it', async () => {
  const req = requirements({ X402_PAY_TO: '0x209693Bc6afc0C5328bA36FaF03C514EF312287C' });
  for (let i = 0; i < 3000; i++) {
    const j = junk();
    assert.doesNotThrow(() => b64decode(j), 'b64decode');
    assert.equal(b64decode(j) === null || typeof b64decode(j) === 'object' || ['string', 'number', 'boolean'].includes(typeof b64decode(j)), true);
    assert.doesNotThrow(() => checkPayload(b64decode(j), req), 'checkPayload');
    assert.notEqual(checkPayload(b64decode(j), req), '', 'junk must never pass the payload check');
    await assert.doesNotReject(() => verifySignature('{}', j, 'whsec_x'), 'verifySignature');
    assert.equal(await verifySignature('{}', j, 'whsec_x'), false);
    assert.doesNotThrow(() => formEncode(typeof j === 'object' && j ? j : { a: j }), 'formEncode');
    // Regexes only ever see header strings in production; helpers that take any value must not throw.
    if (typeof j === 'string') assert.doesNotThrow(() => (IDEM_RE.test(j), AGENT_TOKEN_RE.test(j)), 'regexes');
    assert.doesNotThrow(() => (clean(j, 50), timingSafeEqualHex(j, j)), 'helpers');
  }
});

test('validateCheckoutInput tolerates any JSON shape and only accepts the closed schema', () => {
  for (let i = 0; i < 3000; i++) {
    const shapes = [{ product: junk(), quantity: junk(), note: junk() }, { note: junk() }, { quantity: junk() }, { product: junk() }];
    const input = shapes[Math.floor(rand() * shapes.length)];
    let out;
    assert.doesNotThrow(() => { try { out = validateCheckoutInput(input); } catch (e) { if (!(e instanceof Error && /boom/.test(e.message))) throw e; out = { error: 'thrown_by_hostile_toString' }; } });
    if (!out.error) { assert.equal(out.product, 'preorder'); assert.equal(out.quantity, 1); assert.equal(typeof out.note, 'string'); assert.ok(out.note.length <= 200); }
  }
});

test('bearer() and maskEmail() are total', () => {
  for (let i = 0; i < 2000; i++) {
    const h = junk();
    const r = new Request('https://x.test/', { headers: typeof h === 'string' && !/[^\x20-\x7e]/.test(h) ? { Authorization: h } : {} });
    assert.doesNotThrow(() => bearer(r));
    assert.doesNotThrow(() => maskEmail(typeof h === 'string' ? h : 'a@b.co'));
  }
});
