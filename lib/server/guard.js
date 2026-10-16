// Shared request guards for Pages Functions.

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?knowware\.press$/,
  /^https:\/\/([a-z0-9-]+\.)?knowware-book\.pages\.dev$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

export const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function json(body, status = 200, extra = {}) {
  const headers = new Headers(BASE_HEADERS);
  for (const [k, v] of Object.entries(extra)) {
    if (Array.isArray(v)) v.forEach((item) => headers.append(k, item));
    else headers.set(k, v);
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export function originAllowed(request) {
  const origin = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.some((re) => re.test(origin));
}

// Returns { data } on success or { response } with the error to send.
export async function readJson(request, maxBytes) {
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
    return { response: json({ ok: false, error: 'Send the form as JSON.' }, 415) };
  }
  if (Number(request.headers.get('Content-Length') || 0) > maxBytes) {
    return { response: json({ ok: false, error: 'Submission is too long.' }, 413) };
  }
  const raw = await request.text();
  if (raw.length > maxBytes) return { response: json({ ok: false, error: 'Submission is too long.' }, 413) };
  try {
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && !Array.isArray(data)) return { data };
  } catch {}
  return { response: json({ ok: false, error: 'The form data could not be read. Reload and try again.' }, 400) };
}

export function clean(v, max) {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function rateLimited(env, request, bucket, limit, windowS) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rl:${bucket}:${(await sha256(`${env.RATE_SALT || 'kw'}:${ip}`)).slice(0, 32)}`;
  const count = Number((await env.CLAIMS.get(key)) || 0);
  if (count >= limit) return true;
  await env.CLAIMS.put(key, String(count + 1), { expirationTtl: windowS });
  return false;
}

export function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=');
    if (eq > 0 && part.slice(0, eq) === name) return part.slice(eq + 1);
  }
  return '';
}

export function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
