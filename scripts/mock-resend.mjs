// A local stand-in for Resend's POST /emails. It records what the site would have mailed so
// tests can read the confirmation link. It sends nothing anywhere. Never point real traffic at it.
//   POST /emails          → 200 {id}; stores {to, from, subject, text, html, headers}
//   GET  /__mails?to=ADDR → the recorded messages for that address (all when omitted)
// Usage: node scripts/mock-resend.mjs [port]
import http from 'node:http';
const port = Number(process.argv[2] || 12113);
const mails = [];
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  const send = (s, o) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/__mails') {
    const to = url.searchParams.get('to');
    return send(200, to ? mails.filter((m) => m.to.includes(to)) : mails);
  }
  if (req.method !== 'POST' || url.pathname !== '/emails') return send(404, {});
  const b = JSON.parse(raw || '{}');
  mails.push({ to: b.to || [], from: b.from, subject: b.subject, text: b.text, html: b.html, headers: b.headers || null });
  send(200, { id: `mock_${mails.length}` });
}).listen(port, '127.0.0.1', () => console.log(`mock resend on ${port}`));
