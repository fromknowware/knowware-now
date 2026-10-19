// Per-address send throttle, shared by every flow that mails a confirmation link.

export const PENDING_TTL_S = 60 * 60 * 48;
const GAP_S = 600; // one message per address per ten minutes
const DAILY_MAX = 5; // and five per day

// Throttle sends to ONE address, so a stranger's inbox cannot be filled by repeating a request.
// Returns true when this send should be skipped. The caller answers the same either way.
// `scope` keeps different kinds of mail apart (a reader who just signed up can still ask to leave).
export async function addressThrottled(env, eh, scope = 'mail') {
  if (await env.CLAIMS.get(`suppress:${eh}`)) return true; // bounced for good or complained: never mail again
  if (await env.CLAIMS.get(`${scope}10:${eh}`)) return true;
  const day = Number((await env.CLAIMS.get(`${scope}d:${eh}`)) || 0);
  if (day >= DAILY_MAX) return true;
  await env.CLAIMS.put(`${scope}10:${eh}`, '1', { expirationTtl: GAP_S });
  await env.CLAIMS.put(`${scope}d:${eh}`, String(day + 1), { expirationTtl: 86400 });
  return false;
}
