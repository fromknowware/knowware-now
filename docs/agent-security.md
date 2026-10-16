# Agent API: threat model, controls, residual risks, runbook

Nothing here is "bulletproof"; this file says what is defended, how it is checked, and what is not. Written 2026-10-16.

## What is being protected
| Asset | Why it matters |
|---|---|
| The full chapter text | Gated behind a signed-up person; should not leak into any public file |
| The "human principal" claim | Every spend or unlock must name a person who authorized it; it must not be spoofable |
| Money paths (Stripe test checkout, x402 testnet) | Must never charge without a human mandate; must never run live by accident |
| Reader emails, order records | Personal data in KV |
| Agent input into our systems | Untrusted; must not execute, leak, or change behavior |
| Text we hand to agents | Third-party and synthesized; must not be mistaken for instructions |

## Trust boundaries
Agents and every byte they send are untrusted. A signed-up person is trusted only once their email is confirmed (the emailed link opened). Stripe and the x402 facilitator are trusted for what they sign or return, never for what a caller claims they said. Environment variables are the author's.

## Controls, and what checks each
| Control | Checked by |
|---|---|
| Full text never in `dist` (`dist/gated` removed; build fails if not; a late sentence of every chapter is searched for in all public files) | `scripts/verify-build.mjs` (CI), build integration |
| Agent tokens: 256-bit random, stored as SHA-256, constant-time compare, expiry, scopes, revoke, 5 per person, brute-force lockout | `tests/agent.test.mjs`, `scripts/test-agent-api.sh` |
| Principal must have a **confirmed email** to mint, list or revoke | `tests/agent.test.mjs`, curl check with the flag on |
| Strict schemas, size caps, JSON-only, control characters and lone surrogates rejected, closed checkout and x402 inputs | unit, `tests/fuzz.test.mjs`, `scripts/test-agent-checkout.sh` |
| No CORS headers ever; foreign `Origin` refused; no wildcard anywhere in our code | `verify-build.mjs` (source rule), fuzzer, abuse scripts |
| Error shield: an unexpected throw is a generic 500, only the error class is logged; kill switch `AGENT_API_DISABLED=true`; strict `default-src 'none'` headers on every API response | `tests/shield.test.mjs`, fuzzer asserts the headers on every routed response |
| No secrets or credentials in logs, responses, or static files | `verify-build.mjs` (source scan of every `console.*`, secret-shaped strings in `dist`), fuzzer (echo check) |
| CSP covers every inline script on static pages and on gated pages served by a function | `verify-build.mjs` |
| Stripe: test keys only (live keys refused in code), webhook HMAC over the raw body before parsing, replay window, per-event dedupe, session and amount must match, live events ignored | `tests/checkout.test.mjs`, `scripts/test-agent-checkout.sh` |
| x402: Base Sepolia only (no mainnet setting), server-defined terms, payload checked before any facilitator call, nonce replay guard, one purchase per authorization, facilitator host allow-list | `tests/x402.test.mjs`, `scripts/test-agent-x402.sh`, `verify-build.mjs` |
| Disclosure travels with text: every Markdown file declares `synthesized`; every chapter preview carries the disclosure, the untrusted flag and a visible notice; API responses repeat them | `verify-build.mjs`, abuse scripts |
| No price marked available while checkout is off | `verify-build.mjs` |
| Admin view: off without a 32+ character secret, hashed constant-time compare, lockout, no internal hashes returned | `tests/admin.test.mjs` |
| Fuzzing: seeded, 3,000 requests per run across every route with real tokens (many seeds, well over 30,000 requests so far); property tests on every parser | `scripts/fuzz-agent-api.mjs`, `tests/fuzz.test.mjs` |

Bugs found by this checking, all fixed: unconfirmed email accepted as a principal; lone surrogate in a checkout note produced a 500; chapter-page CSP drift (caught by the invariant, not shipped).

## Residual risks (known, not fixed)
1. **KV is not atomic.** Counters, the five-token cap, idempotency records and the one-purchase lock are read-then-write. Races can let a burst slightly exceed a limit. The x402 lock and Stripe's own idempotency key narrow the money paths; true atomicity needs a Durable Object, which Pages Functions cannot own. Acceptable for a book; revisit before real volume.
2. **Revocation can take about a minute** to reach every edge location (KV caching). Token lifetimes are short (1h to 30d) for this reason.
3. **Agent name and operator are self-declared.** The person types them when minting. They identify nothing and are shown only as plain text. Web Bot Auth would add a signed operator identity; deliberately deferred.
4. **x402 is not verified against the live facilitator.** See `docs/agent-x402-live-test.md`. Until that test is done, treat the rail as unproven.
5. **A confirmed email proves control of an inbox, not identity.** That is the bar here. It depends on `RESEND_API_KEY` working.
6. **Prompt injection cannot be prevented from our side.** Chapter text is the author's, and it quotes synthesized voices; we label it as untrusted data at every layer, but a downstream agent still decides how to treat it.
7. **Order data is personal data held indefinitely.** Orders (email, agent, note) live in KV with no TTL so the author can fulfil them. There is no automated deletion; to erase one person, delete the keys listed below on request.
8. **Single shared secrets:** `ADMIN_TOKEN`, `STRIPE_WEBHOOK_SECRET`, `RATE_SALT`. Rotate by changing the Cloudflare secret; there is no overlap window for the webhook secret (Stripe supports a rolling secret in the Dashboard).
9. **The Workers Builds check is red on `main`** and there are no per-branch previews; the Preview environment must use a separate KV namespace (see PR notes), or test data lands in production.
10. **Dependencies:** `npm audit` reports two moderate issues in `satori` (the story-card image builder from the stories feature, build time only). Not from the agent work.
11. Denial of service by volume is out of scope here beyond the per-token and per-connection limits; Cloudflare's edge is the real defence.

## Runbook
**Turn the whole agent API off now** (no deploy): set `AGENT_API_DISABLED=true` in Cloudflare Pages variables. Every agent route and `/mcp` answers 503. The Stripe webhook keeps working so payments in flight are recorded.

**Turn off just money:** unset `AGENT_CHECKOUT` (Stripe) and/or `X402_MODE` (x402).

**A token leaked:** the person revokes it on `/agents` (or the agent calls `DELETE /api/agent/tokens/self`). Effective within about a minute.

**Revoke every agent token** (KV keys `agent:*` and `agentidx:*`):
```bash
wrangler kv key list --binding CLAIMS --prefix agent: --remote | python3 -c "import sys,json;[print(k['name']) for k in json.load(sys.stdin)]" | xargs -I{} wrangler kv key delete --binding CLAIMS --remote {}
```
(the same with `--prefix agentidx:`). Review the list before deleting.

**Rotate secrets:** change `ADMIN_TOKEN`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY` in Cloudflare; roll the webhook secret in the Stripe Dashboard first, then update Cloudflare.

**Erase one person:** delete `reader:<hash>` entries for them (hash of the token; use the person's email to find `subscriber:<sha256(email)>`), `agentidx:<sha256(email)[0:32]>:*`, and their `order:*` records (list `order:` and match `principal.email`).

**Something returned a 500:** the log line is `unhandled <METHOD> <path> <ErrorClass>`. No request data is logged. Reproduce with the fuzzer seed or the abuse scripts.

## Running every check
```bash
npm test                        # unit, property and shield tests (no server)
npm run build && node scripts/verify-build.mjs    # build invariants
# with wrangler pages dev, mock Stripe and mock facilitator running (see .github/workflows/test.yml):
for s in test-agent-api test-agent-checkout test-mcp test-agent-x402; do ./scripts/$s.sh; done
node scripts/fuzz-agent-api.mjs http://localhost:8788 --n 3000 --seed 1
```
CI runs all of it on every pull request.
