// /api/agent/tokens — the human's side. Needs the reader cookie.
//   POST {name, operator, lifetime, scopes}  → mints a token, shown once
//   GET                                      → lists this person's active tokens
// Only knowware.press origins and JSON; the cookie is SameSite=Lax as well.

import { json, readJson, rateLimited } from '../../../../lib/server/guard.js';
import { agentJson, browserGuard, browserReadGuard, listTokens, mintToken, principalHash, tokensClosed, tokensOpen, verifiedReader } from '../../../../lib/server/agent.js';

async function post({ request, env }) {
  if (!tokensOpen(env)) return tokensClosed();
  const blocked = browserGuard(request);
  if (blocked) return blocked;
  const who = await verifiedReader(request, env);
  if (who.response) return who.response;
  const reader = who.reader;
  const parsed = await readJson(request, 1024);
  if (parsed.response) return parsed.response;
  // Only requests that would really mint count against the limit.
  const result = await mintToken(env, reader, parsed.data, () => rateLimited(env, request, 'agent-mint', 10, 3600));
  if (result.limited) return agentJson({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '3600' });
  if (result.error) return agentJson({ ok: false, error: result.error, fields: result.fields }, result.status || 422);
  return agentJson({ ok: true, ...result, note: 'Copy the token now. It is shown once and stored only as a hash.' }, 201);
}

async function get({ request, env }) {
  if (!tokensOpen(env)) return tokensClosed();
  const blocked = browserReadGuard(request);
  if (blocked) return blocked;
  const who = await verifiedReader(request, env);
  if (who.response) return who.response;
  const reader = who.reader;
  const tokens = (await listTokens(env, await principalHash(reader.email))).map(({ keyHash, ...rest }) => rest);
  return agentJson({ ok: true, tokens });
}

export async function onRequest(context) {
  const { method } = context.request;
  if (method === 'POST') return post(context);
  if (method === 'GET') return get(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
}
