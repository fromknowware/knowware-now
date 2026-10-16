// A tiny local stand-in for the one Stripe endpoint the checkout uses, so the
// flow can be tested with no network and no Stripe account. Never run against
// anything real. Usage: node scripts/mock-stripe.mjs [port]
// GET /__calls returns what was received (bodies only, key redacted).
import http from 'node:http';
import { createHash } from 'node:crypto';

const port = Number(process.argv[2] || 12111);
const byKey = new Map();
const calls = [];

http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks).toString();
  const send = (status, obj) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

  if (req.method === 'GET' && req.url === '/__calls') return send(200, calls);
  if (req.method !== 'POST' || req.url !== '/v1/checkout/sessions') return send(404, { error: { message: 'not found' } });
  if (!/^Bearer sk_test_/.test(req.headers.authorization || '')) return send(401, { error: { message: 'bad key' } });

  const idem = req.headers['idempotency-key'] || '';
  const params = Object.fromEntries(new URLSearchParams(body));
  calls.push({ idem, params });
  if (idem && byKey.has(idem)) {
    const prior = byKey.get(idem);
    if (prior.body !== body) return send(400, { error: { type: 'idempotency_error', message: 'reused with different params' } });
    return send(200, prior.session);
  }
  const id = `cs_test_${createHash('sha256').update(idem + body).digest('hex').slice(0, 24)}`;
  const session = {
    id, object: 'checkout.session', livemode: false, mode: 'payment', payment_status: 'unpaid',
    url: `https://checkout.stripe.com/c/pay/${id}`, amount_total: 3300, currency: 'usd',
    client_reference_id: params.client_reference_id, expires_at: Number(params.expires_at),
  };
  if (idem) byKey.set(idem, { body, session });
  send(200, session);
}).listen(port, '127.0.0.1', () => console.log(`mock stripe on ${port}`));
