// POST /api/claim — receives contribute.html claim-form submissions.
// Primary store: CLAIMS KV binding (declared in wrangler.toml).
// Optional: if RESEND_API_KEY is set as a Pages secret, also emails a
// notification to CLAIM_NOTIFY_TO and upserts a Resend contact.

const MAX_FIELD = 500;

function clean(v) {
  return typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : '';
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (clean(data.company)) return json({ ok: true });

  const claim = {
    path: clean(data.path),
    name: clean(data.name),
    reach: clean(data.reach),
    work: clean(data.work),
    chapter: clean(data.chapter),
    why: clean(data.why),
    ticket: clean(data.ticket),
    submittedAt: new Date().toISOString(),
    ua: request.headers.get('User-Agent') || '',
    country: request.cf?.country || '',
  };

  if (!claim.name || !claim.reach) {
    return json({ ok: false, error: 'name and reach are required' }, 400);
  }

  const key = `claim:${claim.submittedAt}:${crypto.randomUUID().slice(0, 8)}`;
  await env.CLAIMS.put(key, JSON.stringify(claim));

  if (env.RESEND_API_KEY && env.CLAIM_NOTIFY_TO) {
    // Fail-soft: the claim is already stored; email is best-effort.
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CLAIM_NOTIFY_FROM || 'Knowware Claims <onboarding@resend.dev>',
          to: [env.CLAIM_NOTIFY_TO],
          subject: `New claim ${claim.ticket || ''} — Path ${claim.path || '?'} — ${claim.name}`,
          text: [
            `Path:    ${claim.path}`,
            `Name:    ${claim.name}`,
            `Reach:   ${claim.reach}`,
            `Work:    ${claim.work}`,
            `Chapter: ${claim.chapter || '(editor’s pick)'}`,
            `Why:     ${claim.why || '(blank)'}`,
            ``,
            `${claim.submittedAt} · ${claim.country}`,
            `KV key: ${key}`,
          ].join('\n'),
        }),
      });
    } catch {
      // ignore — stored in KV regardless
    }
  }

  return json({ ok: true });
}
