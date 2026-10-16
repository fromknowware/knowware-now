// Builds a base64 PAYMENT-SIGNATURE value for the mock facilitator. The
// signature is FAKE (130 hex chars): it only works against scripts/mock-facilitator.mjs.
// A real agent signs an EIP-3009 transferWithAuthorization with its wallet.
// Usage: node scripts/make-x402-payment.mjs <PAYMENT-REQUIRED header value> [--from 0x..] [--value N] [--payto 0x..] [--before secs] [--nonce 0x..] [--accepted-amount N]
const [header, ...flags] = process.argv.slice(2);
const flag = (n, d) => { const i = flags.indexOf(`--${n}`); return i >= 0 ? flags[i + 1] : d; };
const req = JSON.parse(Buffer.from(header, 'base64').toString());
const accepts = { ...req.accepts[0] };
const now = Math.floor(Date.now() / 1000);
const accepted = { ...accepts, amount: flag('accepted-amount', accepts.amount) };
const payload = {
  x402Version: 2,
  resource: req.resource,
  accepted,
  payload: {
    signature: '0x' + 'cd'.repeat(65),
    authorization: {
      from: flag('from', '0x857b06519E91e3A54538791bDbb0E22373e36b66'),
      to: flag('payto', accepts.payTo),
      value: flag('value', accepts.amount),
      validAfter: String(now - 5),
      validBefore: String(now + Number(flag('before', '55'))),
      nonce: flag('nonce', '0x' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')),
    },
  },
  extensions: {},
};
process.stdout.write(Buffer.from(JSON.stringify(payload)).toString('base64'));
