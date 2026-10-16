// One wrapper around every agent-facing function:
//   - a kill switch (AGENT_API_DISABLED=true) that turns the whole agent API off
//     without a deploy; the Stripe webhook is exempt so payments in flight are
//     not dropped
//   - an error shield: an unexpected throw becomes a short generic 500, never a
//     stack trace or an internal message, and only the error class is logged
//   - strict headers on every response: nothing we return is a page, so no
//     script, no framing, no sniffing, no caching, no referrer
// The handlers keep their own validation; this is the last line of defence.

const API_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; sandbox",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
};

function plain(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...API_HEADERS, ...extra },
  });
}

export function harden(response) {
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(API_HEADERS)) out.headers.set(k, v);
  if (!out.headers.has('Cache-Control')) out.headers.set('Cache-Control', 'no-store');
  return out;
}

// `run` gets the Pages context and returns a Response.
export async function shielded(context, run, { exemptFromKillSwitch = false } = {}) {
  const { request, env } = context;
  if (!exemptFromKillSwitch && env.AGENT_API_DISABLED === 'true') {
    return plain(503, { ok: false, error: 'unavailable' }, { 'Retry-After': '300' });
  }
  try {
    return harden(await run(context));
  } catch (err) {
    // Class only: messages can carry user input or internals.
    console.error('unhandled', request.method, new URL(request.url).pathname, err?.name || 'Error');
    return plain(500, { ok: false, error: 'server_error' });
  }
}

// For a function file's own export: export const onRequest = guard(handler)
export const guard = (handler, opts) => (context) => shielded(context, handler, opts);
