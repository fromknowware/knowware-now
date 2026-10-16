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
| `RATE_SALT` | any long random string (existing recommendation; also salts the new limits) | Secret |

With `AGENT_CHECKOUT` unset, `POST /api/agent/checkout` returns 503 `checkout_not_open`, `/api/stripe/webhook` returns 404, and tokens cannot be minted with the `checkout` scope. `GET /api/agent/status` says which.

## 3. Try it (test mode)

1. Sign up on `/read`, open `/agents`, tick "Also let this agent request a checkout link", mint a token.
2. `examples/agent-client.mjs` (see its header) discovers the site, reads a preview, reads a chapter, and requests a checkout URL.
3. Open the URL as the person. Pay with Stripe's published test card `4242 4242 4242 4242`, any future expiry, any CVC. Never use a real card.
4. The webhook marks the order `paid`; the agent sees it at `GET /api/agent/orders/<id>`.

## 4. Orders

Each order is a KV record `order:<id>` in `CLAIMS` with: the human (principal id and email), the agent (name and operator), the context note, amount, Stripe session id, status. The same facts are in the Stripe Checkout Session metadata (`principal_id`, `agent_name`, `agent_operator`, `context_note`), so they show in the Stripe Dashboard next to the payment. The shipping address stays in Stripe; it is not copied.

## 5. Decision for the author: who handles agent orders?

Today an agent order is an ordinary Stripe payment with extra metadata, handled like any other order. Nothing fulfills it automatically. Decide who reads `channel=agent` orders and what is promised if an agent orders the wrong thing (suggestion: refund on request, via Stripe).

## 6. Going live later (not done here)

1. Make the public pre-order button real first (the current `/order` loop).
2. Create the live product/price, and a live webhook endpoint.
3. Change `lib/server/stripe.js` deliberately: `TEST_KEY_RE`, `checkoutMode` and the `livemode` checks currently refuse live. Review it, then flip `CHECKOUT_OPEN` in `src/config.ts` so the site publishes an `Offer`.
4. Optional, when Stripe's Shared Payment Tokens are generally available for your account: an SPT is the signed human mandate this design is waiting for. Replacing "human opens a link" with "agent presents an SPT the human granted" would let a person authorize an amount-limited purchase. See `docs/agent-protocols.md`.
