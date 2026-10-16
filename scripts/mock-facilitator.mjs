// A local stand-in for an x402 facilitator (/verify and /settle). It checks
// NOTHING cryptographic: it only lets tests drive the server's logic.
//   payer ending "dead" -> /verify says insufficient_funds
//   payer ending "beef" -> /verify ok, /settle fails
//   anything else       -> both succeed
// GET /__calls lists what it received. Never point real traffic at it.
// Usage: node scripts/mock-facilitator.mjs [port]
import http from 'node:http';
const port = Number(process.argv[2] || 12112);
const calls = [];
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  const send = (s, o) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (req.method === 'GET' && req.url === '/__calls') return send(200, calls);
  const path = req.url.replace(/^\/facilitator/, '');
  if (req.method !== 'POST' || !['/verify', '/settle'].includes(path)) return send(404, {});
  const body = JSON.parse(raw || '{}');
  const payer = body.paymentPayload?.payload?.authorization?.from || '';
  calls.push({ path, payer, amount: body.paymentRequirements?.amount, payTo: body.paymentRequirements?.payTo, network: body.paymentRequirements?.network });
  if (path === '/verify') return send(200, payer.endsWith('dead') ? { isValid: false, invalidReason: 'insufficient_funds', payer } : { isValid: true, payer });
  if (payer.endsWith('beef')) return send(200, { success: false, errorReason: 'transaction_failed', payer, transaction: '', network: body.paymentRequirements?.network });
  send(200, { success: true, payer, transaction: '0x' + 'ab'.repeat(32), network: body.paymentRequirements?.network });
}).listen(port, '127.0.0.1', () => console.log(`mock facilitator on ${port}`));
