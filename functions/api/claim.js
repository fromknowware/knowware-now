// /api/claim — receives /contribute nominations.
// Primary store: CLAIMS KV binding (declared in wrangler.jsonc).
// Optional: if RESEND_API_KEY and CLAIM_NOTIFY_TO are set as Pages secrets,
// also emails a plain-text notification.

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_S = 3600;

const FIELDS = {
  yourName:  { max: 120,  required: true },
  email:     { max: 254,  required: true },
  voiceName: { max: 160,  required: true },
  voiceRole: { max: 240,  required: true },
  why:       { max: 2000, required: true },
  chapter:   { max: 2,    required: false },
};

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?knowware\.press$/,
  /^https:\/\/([a-z0-9-]+\.)?knowware-book\.pages\.dev$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...BASE_HEADERS, ...extra } });
}

// Strip control characters (keeps \n in multi-line fields only).
function clean(v, max, multiline = false) {
  if (typeof v !== 'string') return '';
  const pattern = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return v.replace(pattern, '').trim().slice(0, max);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function rateLimited(env, request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rl:${(await sha256(`${env.RATE_SALT || 'kw'}:${ip}`)).slice(0, 32)}`;
  const count = Number((await env.CLAIMS.get(key)) || 0);
  if (count >= RATE_LIMIT) return true;
  await env.CLAIMS.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_S });
  return false;
}

async function handlePost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  if (!ALLOWED_ORIGINS.some((re) => re.test(origin))) {
    return json({ ok: false, error: 'Requests must come from knowware.press.' }, 403);
  }

  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
    return json({ ok: false, error: 'Send the form as JSON.' }, 415);
  }

  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_BODY_BYTES) return json({ ok: false, error: 'Submission is too long.' }, 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'Submission is too long.' }, 413);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'The form data could not be read. Reload and try again.' }, 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ ok: false, error: 'The form data could not be read. Reload and try again.' }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (clean(data.company, 200)) return json({ ok: true });

  const claim = {};
  const missing = [];
  for (const [name, rule] of Object.entries(FIELDS)) {
    claim[name] = clean(data[name], rule.max, name === 'why');
    if (rule.required && !claim[name]) missing.push(name);
  }
  if (missing.length) {
    return json({ ok: false, error: 'Fill in every required field.', fields: missing }, 422);
  }
  if (!EMAIL_RE.test(claim.email)) {
    return json({ ok: false, error: 'Enter a valid email address, like name@example.com.', fields: ['email'] }, 422);
  }
  if (claim.chapter && !/^[1-9]$/.test(claim.chapter)) claim.chapter = '';

  if (await rateLimited(env, request)) {
    return json({ ok: false, error: 'Too many submissions from this connection. Try again in an hour.' }, 429, { 'Retry-After': String(RATE_WINDOW_S) });
  }

  claim.submittedAt = new Date().toISOString();
  claim.country = request.cf?.country || '';

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
          reply_to: claim.email,
          subject: `New nomination: ${claim.voiceName}`.slice(0, 150),
          text: [
            `Nominee:   ${claim.voiceName}`,
            `Role:      ${claim.voiceRole}`,
            `Chapter:   ${claim.chapter || '(editor’s pick)'}`,
            `From:      ${claim.yourName} <${claim.email}>`,
            ``,
            claim.why,
            ``,
            `${claim.submittedAt} · ${claim.country}`,
            `KV key: ${key}`,
          ].join('\n'),
        }),
      });
    } catch {
      // stored in KV regardless
    }
  }

  return json({ ok: true });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
}
