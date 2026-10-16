// x402 (v2) on Base Sepolia TESTNET, for one product: the digital edition.
//
// What this is: an agent holding a token whose person ticked the "pay" scope
// can buy the digital edition with testnet USDC from its own wallet. That tick
// is the human mandate: one purchase, capped at the digital price, expiring
// with the token. x402 itself carries no human mandate, so we add this one.
//
// What it is not: mainnet (refused here), print or the pre-order bundle (they
// need a shipping address, which x402 does not carry), or verified against the
// live facilitator (tested here only against a mock; see docs/agent-x402.md).
//
// Spec: github.com/coinbase/x402 specs/x402-specification-v2.md and
// specs/schemes/exact/scheme_exact_evm.md.

import { sha256 } from './guard.js';
import { principalBlock } from './agent.js';
import { SITE_URL } from '../site-facts.mjs';

export const X402_VERSION = 2;
export const NETWORK = 'eip155:84532'; // Base Sepolia. Mainnet is deliberately not an option.
export const USDC_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const FACILITATOR_RE = /^(https:\/\/x402\.org\/facilitator|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/facilitator)?)$/;
const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const PRODUCT = { id: 'digital', name: 'Knowware digital edition (PDF + ePub), delivered by email at launch', amount: '11950000', amountLabel: '$11.95', cents: 1195 };
const MAX_TIMEOUT_S = 60;
export const MAX_HEADER_CHARS = 8192;

export const x402Mode = (env) => (env.X402_MODE === 'testnet' ? 'testnet' : 'off');

export function x402Problem(env) {
  if (x402Mode(env) !== 'testnet') return 'x402_not_open';
  if (!ADDRESS_RE.test(env.X402_PAY_TO || '')) return 'misconfigured';
  if (env.X402_FACILITATOR_URL && !FACILITATOR_RE.test(env.X402_FACILITATOR_URL)) return 'misconfigured';
  return '';
}

const facilitatorBase = (env) => (env.X402_FACILITATOR_URL || 'https://x402.org/facilitator').replace(/\/$/, '');

export function b64encode(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function b64decode(str) {
  if (typeof str !== 'string' || str.length > MAX_HEADER_CHARS || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(str)) return null;
  try {
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

// What the server will accept: its own terms, never the agent's.
export function requirements(env) {
  return {
    scheme: 'exact',
    network: NETWORK,
    amount: PRODUCT.amount,
    asset: USDC_BASE_SEPOLIA,
    payTo: env.X402_PAY_TO,
    maxTimeoutSeconds: MAX_TIMEOUT_S,
    extra: { assetTransferMethod: 'eip3009', name: 'USDC', version: '2' },
  };
}

export const resource = () => ({ url: `${SITE_URL}/api/agent/x402/digital`, description: PRODUCT.name, mimeType: 'application/json' });

export function challenge(env, agent, error) {
  const body = {
    x402Version: X402_VERSION,
    error,
    resource: resource(),
    accepts: [requirements(env)],
    extensions: {},
  };
  const principal = principalBlock(agent);
  return {
    header: b64encode(body),
    body: {
      ...body,
      knowware: {
        mode: 'testnet',
        human_principal: { id: principal.id, label: principal.label },
        mandate: 'The person ticked "pay" when minting this token: one purchase of this product, up to this amount, until the token expires.',
        instructions_for_agent: `You are about to spend ${PRODUCT.amountLabel} of Base Sepolia TESTNET USDC from your own wallet, for ${principal.label}. Sign an EIP-3009 transferWithAuthorization for exactly the amount in accepts[0] and send it base64-encoded in the PAYMENT-SIGNATURE header with the same Idempotency-Key. Do not exceed the amount; do not retry with a different key.`,
      },
    },
  };
}

// Checks the agent's payload against OUR requirements before any facilitator call.
export function checkPayload(payload, req, nowS = Math.floor(Date.now() / 1000)) {
  if (!payload || typeof payload !== 'object' || payload.x402Version !== X402_VERSION) return 'bad_version';
  const a = payload.accepted;
  if (!a || a.scheme !== req.scheme || a.network !== req.network || a.amount !== req.amount || a.asset?.toLowerCase() !== req.asset.toLowerCase() || a.payTo?.toLowerCase() !== req.payTo.toLowerCase()) return 'accepted_mismatch';
  const p = payload.payload;
  const auth = p?.authorization;
  if (!p || !auth || typeof p.signature !== 'string' || !/^0x[0-9a-fA-F]{130}$/.test(p.signature)) return 'bad_signature_shape';
  if (!ADDRESS_RE.test(auth.from || '') || String(auth.to).toLowerCase() !== req.payTo.toLowerCase()) return 'bad_authorization';
  if (auth.value !== req.amount) return 'wrong_amount';
  if (!/^0x[0-9a-fA-F]{64}$/.test(auth.nonce || '')) return 'bad_nonce';
  const after = Number(auth.validAfter);
  const before = Number(auth.validBefore);
  if (!Number.isInteger(after) || !Number.isInteger(before)) return 'bad_window';
  if (after > nowS + 5 || before <= nowS || before > nowS + req.maxTimeoutSeconds + 30) return 'bad_window';
  return '';
}

async function facilitator(env, path, body, fetchImpl) {
  const res = await fetchImpl(`${facilitatorBase(env)}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, data };
}

// The whole paid path. Returns { status, response, headers? }.
export async function payForDigital(env, agent, input, idemKey, paymentHeader, fetchImpl = fetch, limited) {
  const problem = x402Problem(env);
  if (problem) return { status: 503, response: { ok: false, error: problem } };

  const req = requirements(env);
  const bodyHash = await sha256(JSON.stringify([PRODUCT.id, input.note]));
  const orderId = `ord_${(await sha256(`x402:${agent.keyHash}:${idemKey}:${bodyHash}`)).slice(0, 16)}`;
  const existing = JSON.parse((await env.CLAIMS.get(`order:${orderId}`)) || 'null');

  if (existing) {
    if (existing.status === 'paid') return { status: 200, replay: true, response: paidResponse(existing) };
    if (existing.status === 'settling') return { status: 409, response: { ok: false, error: 'settlement_in_progress', order_id: orderId } };
  }
  // One purchase per authorization: the pay scope is a spending limit, not a standing permission.
  if (await env.CLAIMS.get(`x402used:${agent.id}`)) return { status: 409, response: { ok: false, error: 'mandate_used', hint: 'This token authorized one purchase and it was made. The person must mint a new token to authorize another.' } };

  if (!paymentHeader) {
    if (limited && (await limited())) return { limited: true };
    const c = challenge(env, agent, 'PAYMENT-SIGNATURE header is required');
    return { status: 402, response: c.body, headers: { 'PAYMENT-REQUIRED': c.header } };
  }

  const payload = b64decode(paymentHeader);
  const bad = checkPayload(payload, req);
  if (bad) return { status: 422, response: { ok: false, error: 'invalid_payment', reason: bad } };

  const auth = payload.payload.authorization;
  const nonceKey = `x402nonce:${auth.nonce.toLowerCase()}`;
  if (await env.CLAIMS.get(nonceKey)) return { status: 409, response: { ok: false, error: 'authorization_already_used' } };

  const request = { x402Version: X402_VERSION, paymentPayload: payload, paymentRequirements: req };
  let verify;
  try {
    verify = await facilitator(env, '/verify', request, fetchImpl);
  } catch {
    return { status: 502, response: { ok: false, error: 'facilitator_unreachable' } };
  }
  if (!verify.ok || verify.data?.isValid !== true) {
    return { status: 402, response: { ok: false, error: 'payment_not_valid', reason: String(verify.data?.invalidReason || 'unverified').slice(0, 64) }, headers: { 'PAYMENT-REQUIRED': challenge(env, agent, 'payment not valid').header } };
  }

  const now = new Date().toISOString();
  const principal = principalBlock(agent);
  const order = {
    id: orderId, mode: 'x402-testnet', status: 'settling', product: PRODUCT.id, quantity: 1,
    amountCents: PRODUCT.cents, currency: 'usd', network: NETWORK, asset: 'USDC', payer: String(verify.data.payer || auth.from).slice(0, 42),
    principal: { id: principal.id, prin: agent.prin, email: agent.email },
    agent: { name: agent.name, operator: agent.operator, tokenId: agent.id },
    context: input.note, fulfilment: 'digital edition emailed to the principal at launch',
    createdAt: now, updatedAt: now,
  };
  await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
  await env.CLAIMS.put(nonceKey, orderId, { expirationTtl: 604800 });

  // Take the one-purchase lock BEFORE settling so a second request racing in
  // with a different authorization is refused. (KV is not atomic; this narrows
  // the window rather than closing it, and the nonce guard still applies.)
  await env.CLAIMS.put(`x402used:${agent.id}`, orderId, { expirationTtl: 2592000 + 86400 });
  let settle;
  try {
    settle = await facilitator(env, '/settle', request, fetchImpl);
  } catch {
    order.status = 'settlement_unknown'; // keep the lock: money may have moved
    order.updatedAt = new Date().toISOString();
    await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
    return { status: 502, response: { ok: false, error: 'settlement_unknown', order_id: orderId, hint: 'Do not pay again. Check GET /api/agent/orders/<id> or ask the author.' } };
  }
  const s = settle.data || {};
  if (!settle.ok || s.success !== true) {
    order.status = 'payment_failed';
    order.updatedAt = new Date().toISOString();
    await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
    await env.CLAIMS.delete(nonceKey);
    await env.CLAIMS.delete(`x402used:${agent.id}`); // nothing moved: the mandate is unspent
    return { status: 402, response: { ok: false, error: 'settlement_failed', reason: String(s.errorReason || 'unknown').slice(0, 64), order_id: orderId } };
  }
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  order.updatedAt = order.paidAt;
  order.transaction = String(s.transaction || '').slice(0, 80);
  await env.CLAIMS.put(`order:${orderId}`, JSON.stringify(order));
  return {
    status: 200,
    response: paidResponse(order),
    headers: { 'PAYMENT-RESPONSE': b64encode({ success: true, transaction: order.transaction, network: NETWORK, payer: order.payer }) },
  };
}

export function paidResponse(order) {
  return {
    ok: true,
    mode: 'x402-testnet',
    order_id: order.id,
    status: order.status,
    product: order.product,
    amount: { usdc: '11.95', network: NETWORK, testnet: true },
    transaction: order.transaction || null,
    fulfilment: order.fulfilment,
    test_mode_notice: 'Base Sepolia testnet: no real money moved.',
    record: { principal: { id: order.principal.id }, agent: { name: order.agent.name, operator: order.agent.operator }, context: order.context },
  };
}
