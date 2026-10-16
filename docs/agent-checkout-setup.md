# Agent checkout: what the author creates in Stripe, and what to flip

Everything here is **Stripe test mode**. The code refuses live keys. Going live is a deliberate code change (see the last section), not a setting.

Nothing here makes the public "Pre-order $33" button work. That button still points at `/order` (a loop), and fixing it is a launch blocker on its own: see the PR description.

## 1. In the Stripe Dashboard, test mode (the "Test mode" toggle on)

1. **Product catalog → Add product**: "Knowware pre-order (print + digital)". One-time price **$33.00 USD**. Copy the price id (`price_…`).
2. **Developers → API keys**: copy the **secret key** that starts with `sk_test_` (or create a restricted `rk_test_…` key that can only write Checkout Sessions).
3. **Developers → Webhooks → Add endpoint**: URL `https://knowware.press/api/stripe/webhook` (or the `*.pages.dev` preview URL while testing). Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`. Copy the **signing secret** (`whsec_…`).
4. Shipping: Checkout collects a shipping address because the pre-order includes print. Countries default to `US`; set `STRIPE_SHIP_COUNTRIES` (comma-separated ISO codes, e.g. `US,CA`) to change.

## 2. In Cloudflare Pages (project `knowware-book`, Settings → Variables and Secrets)

Set these on the **Preview** environment first, then Production when ready. The three secrets as **Secret** type:

| Name | Value | Type |
|---|---|---|
| `AGENT_CHECKOUT` | `test` (anything else, or unset, keeps it off) | Plaintext |
| `STRIPE_SECRET_KEY` | `sk_test_…` | Secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | Secret |
| `STRIPE_PRICE_PREORDER` | `price_…` | Plaintext |
| `STRIPE_SHIP_COUNTRIES` | optional, default `US` | Plaintext |
| `RESEND_API_KEY` | needed so readers get the confirmation link (see below); already used by the reader sign-up email | Secret |
| `RATE_SALT` | any long random string (existing recommendation; also salts the new limits) | Secret |

With `AGENT_CHECKOUT` unset, `POST /api/agent/checkout` returns 503 `checkout_not_open`, `/api/stripe/webhook` returns 404, and tokens cannot be minted with the `checkout` scope. `GET /api/agent/status` says which.

### Agent tokens need a confirmed email
Sign-up gives a reading cookie to anyone who types an address, so it does not prove who is at the keyboard. Agent tokens name that address as the human principal, so minting, listing and revoking them require the person to have **opened the link in the confirmation email** (the same link that lets them read on another device). Until then `/agents` shows "Confirm your email first" and the API returns `403 email_not_verified`. This needs `RESEND_API_KEY` to be working in that environment. `AGENT_REQUIRE_VERIFIED_EMAIL=false` turns the check off for local development only; never set it in Preview or Production.

## 3. Try it (test mode)

1. Sign up on `/read`, open the link in the email you receive, then open `/agents`, tick "Also let this agent request a checkout link", mint a token.
2. `examples/agent-client.mjs` (see its header) discovers the site, reads a preview, reads a chapter, and requests a checkout URL.
3. Open the URL as the person. Pay with Stripe's published test card `4242 4242 4242 4242`, any future expiry, any CVC. Never use a real card.
4. The webhook marks the order `paid`; the agent sees it at `GET /api/agent/orders/<id>`.

## 4. Orders

Each order is a KV record `order:<id>` in `CLAIMS` with: the human (principal id and email), the agent (name and operator), the context note, amount, Stripe session id, status. The same facts are in the Stripe Checkout Session metadata (`principal_id`, `agent_name`, `agent_operator`, `context_note`), so they show in the Stripe Dashboard next to the payment. The shipping address stays in Stripe; it is not copied.

## 4b. Seeing the orders: `ADMIN_TOKEN`
Optional. Set `ADMIN_TOKEN` (a random secret of at least 32 characters, as a **Secret**) in Cloudflare to switch on `GET /api/admin/orders`:
```bash
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "https://knowware.press/api/admin/orders?status=paid"
```
It lists agent orders (Stripe test mode and x402 testnet) with the human, the agent (name and operator), the context note, status, amount and, for x402, the transaction hash; `status` and `cursor` are optional. Unset, the endpoint returns 404. It is never called from a browser, compares the token in constant time after hashing, and locks a connection out after 10 wrong guesses in 10 minutes.

## 5. Decision for the author: who handles agent orders?

Today an agent order is an ordinary Stripe payment with extra metadata, handled like any other order. Nothing fulfills it automatically. Decide who reads `channel=agent` orders and what is promised if an agent orders the wrong thing (suggestion: refund on request, via Stripe).

## 6. Going live later (not done here)

1. Make the public pre-order button real first (the current `/order` loop).
2. Create the live product/price, and a live webhook endpoint.
3. Change `lib/server/stripe.js` deliberately: `TEST_KEY_RE`, `checkoutMode` and the `livemode` checks currently refuse live. Review it, then flip `CHECKOUT_OPEN` in `src/config.ts` so the site publishes an `Offer`.
4. Optional, when Stripe's Shared Payment Tokens are generally available for your account: an SPT is the signed human mandate this design is waiting for. Replacing "human opens a link" with "agent presents an SPT the human granted" would let a person authorize an amount-limited purchase. See `docs/agent-protocols.md`.
