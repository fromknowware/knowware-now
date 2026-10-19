#!/usr/bin/env node
// Pays for the Knowware digital edition over x402 with TESTNET USDC from a
// throwaway wallet, for the person who minted the token. It is the client half
// of docs/agent-x402-live-test.md.
//
// It cannot spend real money: it refuses any network but Base Sepolia (eip155:84532),
// refuses any amount above --max, and DOES NOTHING BUT PRINT unless you pass --pay.
//
// Needs viem (not a dependency of this repo):  npm i viem
//   node examples/x402-pay.mjs --new-wallet                    # make a throwaway testnet wallet
//   node examples/x402-pay.mjs --selftest                      # sign + recover offline, no network
//   KNOWWARE_AGENT_TOKEN=kwa_... X402_TEST_PRIVATE_KEY=0x... \
//     node examples/x402-pay.mjs --base https://<preview-host> [--pay] [--max 11.95] [--note "..."]
// Never put a key that holds anything real in X402_TEST_PRIVATE_KEY.

import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { recoverTypedDataAddress } from 'viem';

const TESTNET = 'eip155:84532';
const CHAIN_ID = 84532;
const UA = 'knowware-x402-example/1 (testnet only)';

export const TYPES = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
  ],
};

// The EIP-712 message a facilitator will check, built only from what the server asked for.
export function buildTypedData(account, req, nowS = Math.floor(Date.now() / 1000)) {
  const nonce = '0x' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex');
  const authorization = {
    from: account.address,
    to: req.payTo,
    value: req.amount,
    validAfter: String(nowS - 5),
    validBefore: String(nowS + Math.min(req.maxTimeoutSeconds ?? 60, 55)),
    nonce,
  };
  const typedData = {
    domain: { name: req.extra.name, version: req.extra.version, chainId: CHAIN_ID, verifyingContract: req.asset },
    types: TYPES,
    primaryType: 'TransferWithAuthorization',
    message: { ...authorization, value: BigInt(authorization.value), validAfter: BigInt(authorization.validAfter), validBefore: BigInt(authorization.validBefore) },
  };
  return { authorization, typedData };
}

export async function signPayment(account, challenge) {
  const req = challenge.accepts[0];
  const { authorization, typedData } = buildTypedData(account, req);
  const signature = await account.signTypedData(typedData);
  const payload = { x402Version: 2, resource: challenge.resource, accepted: req, payload: { signature, authorization }, extensions: challenge.extensions ?? {} };
  return { header: Buffer.from(JSON.stringify(payload)).toString('base64'), typedData, signature, authorization };
}

async function selftest() {
  const account = privateKeyToAccount(generatePrivateKey());
  const req = { scheme: 'exact', network: TESTNET, amount: '11950000', asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', payTo: '0x209693Bc6afc0C5328bA36FaF03C514EF312287C', maxTimeoutSeconds: 60, extra: { name: 'USDC', version: '2' } };
  const { typedData, signature } = await signPayment(account, { resource: {}, accepts: [req] });
  const recovered = await recoverTypedDataAddress({ ...typedData, signature });
  console.log(recovered === account.address ? 'selftest ok: the signature recovers to the signer (EIP-712 domain, types and message are consistent)' : 'selftest FAILED');
  console.log('This proves the signing code only. It does not prove the real USDC contract or facilitator accepts it; that is the live test.');
  process.exit(recovered === account.address ? 0 : 1);
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
  if (args.includes('--new-wallet')) {
    const key = generatePrivateKey();
    console.log(`address:     ${privateKeyToAccount(key).address}\nprivate key: ${key}\nThrowaway TESTNET wallet. Fund it at https://faucet.circle.com (Base Sepolia, USDC). Never reuse it for anything real.`);
    return;
  }
  if (args.includes('--selftest')) return selftest();

  const base = (opt('base', 'https://knowware.systems')).replace(/\/$/, '');
  const token = process.env.KNOWWARE_AGENT_TOKEN;
  const key = process.env.X402_TEST_PRIVATE_KEY;
  const maxUsdc = Number(opt('max', '11.95'));
  const note = (opt('note', 'x402 testnet example') || '').slice(0, 200);
  if (!token || !key) throw new Error('Set KNOWWARE_AGENT_TOKEN (a person minted it with the "pay" box ticked) and X402_TEST_PRIVATE_KEY (a throwaway testnet wallet).');
  const account = privateKeyToAccount(key);
  const url = `${base}/api/agent/x402/digital`;
  const idem = opt('key', randomUUID());
  const headers = { 'User-Agent': UA, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Idempotency-Key': idem };
  const body = JSON.stringify({ note });

  console.log(`1. Ask for the price (${url})`);
  const first = await fetch(url, { method: 'POST', headers, body });
  if (first.status !== 402) { console.log(`Expected 402, got ${first.status}:`, await first.text()); process.exit(1); }
  const challenge = JSON.parse(Buffer.from(first.headers.get('payment-required') ?? '', 'base64').toString());
  const info = (await first.json().catch(() => ({}))).knowware; // the human principal block is in the body
  const req = challenge.accepts?.[0];
  console.log(JSON.stringify({ network: req?.network, amount: req?.amount, asset: req?.asset, payTo: req?.payTo }, null, 2));
  console.log(`For: ${info?.human_principal?.label} (${info?.human_principal?.id})`);

  // Guards the SERVER cannot override.
  if (challenge.x402Version !== 2 || req?.scheme !== 'exact') throw new Error('Unexpected x402 version or scheme. Refusing.');
  if (req.network !== TESTNET) throw new Error(`Refusing: network is ${req.network}, this example only signs for ${TESTNET} (Base Sepolia testnet).`);
  if (Number(req.amount) / 1e6 > maxUsdc) throw new Error(`Refusing: ${Number(req.amount) / 1e6} USDC exceeds --max ${maxUsdc}.`);

  const signed = await signPayment(account, challenge);
  console.log(`\n2. Would sign: ${account.address} -> ${req.payTo}, ${Number(req.amount) / 1e6} USDC (testnet), valid until ${new Date(Number(signed.authorization.validBefore) * 1000).toISOString()}`);
  if (!args.includes('--pay')) { console.log('Dry run. Nothing was sent. Add --pay to send the payment.'); return; }

  console.log('\n3. Paying (same Idempotency-Key, with PAYMENT-SIGNATURE)');
  const second = await fetch(url, { method: 'POST', headers: { ...headers, 'PAYMENT-SIGNATURE': signed.header }, body });
  const out = await second.json().catch(() => ({}));
  console.log(second.status, JSON.stringify(out, null, 2));
  const settled = second.headers.get('payment-response');
  if (settled) console.log('PAYMENT-RESPONSE:', Buffer.from(settled, 'base64').toString());
  if (out.transaction) console.log(`\nExplorer: https://sepolia.basescan.org/tx/${out.transaction}`);
  console.log(`Idempotency-Key used: ${idem} (re-run with --key ${idem} to replay safely; a new key will be refused once the mandate is used)`);
  process.exit(second.status === 200 ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e) => { console.error(e.message); process.exit(1); });
