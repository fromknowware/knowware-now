// Per-address send throttle, shared by every flow that mails a confirmation link.

export const PENDING_TTL_S = 60 * 60 * 48;
const GAP_S = 600; // one message per address per ten minutes
const DAILY_MAX = 5; // and five per day

// Throttle sends to ONE address, so a stranger's inbox cannot be filled by repeating a request.
// Returns true when this send should be skipped. The caller answers the same either way.
export async function addressThrottled(env, eh) {
  if (await env.CLAIMS.get(`mail10:${eh}`)) return true;
  const day = Number((await env.CLAIMS.get(`maild:${eh}`)) || 0);
  if (day >= DAILY_MAX) return true;
  await env.CLAIMS.put(`mail10:${eh}`, '1', { expirationTtl: GAP_S });
  await env.CLAIMS.put(`maild:${eh}`, String(day + 1), { expirationTtl: 86400 });
  return false;
}
