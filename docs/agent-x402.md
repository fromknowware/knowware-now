# x402 (USDC on Base Sepolia testnet): what is built, what is not

Built because the author asked for an x402 rail. It is **off**, **testnet only**, and **not verified against a live facilitator**. Read this before switching it on.

## What it is
`POST /api/agent/x402/digital` implements the x402 v2 flow ([spec](https://github.com/coinbase/x402/blob/main/specs/x402-specification-v2.md), [exact EVM scheme](https://github.com/coinbase/x402/blob/main/specs/schemes/exact/scheme_exact_evm.md)) for one product, the **digital edition ($11.95 = `11950000` USDC base units)**:

1. Agent calls with a token that has the `pay` scope and an `Idempotency-Key`. Server answers `402` with a base64 `PAYMENT-REQUIRED` header (and the same JSON body, plus a `knowware` block naming the human principal).
2. Agent signs an EIP-3009 `transferWithAuthorization` for exactly that amount and calls again with a base64 `PAYMENT-SIGNATURE` header.
3. Server checks the payload against **its own** requirements (never the agent's `accepted` block): scheme, network, amount, asset, payee, signature shape, nonce, a window of at most 60 seconds. Then it asks the facilitator `/verify`, records the order as `settling`, asks `/settle`, and marks it `paid` with the transaction hash. Response carries a base64 `PAYMENT-RESPONSE` header.

## The human mandate (the part x402 does not have)
x402 has no notion of a human principal; whoever holds the wallet pays. Knowware's rule is that every spend names a human who authorized it, so:
- The `pay` scope exists only on a token a signed-up person minted, by ticking an explicit box: "let this agent pay for the digital edition ($11.95, one purchase) from its own wallet".
- It authorizes **one purchase of that one product**, and lasts until the token expires (1 hour to 30 days). After a successful payment the token's mandate is used up (`409 mandate_used`); the person must mint another.
- Each order records the human (principal), the agent (name and operator) and the context note, like the Stripe path.

## What it does not do
- **No mainnet.** `NETWORK` is the constant `eip155:84532`; there is no setting for another network. Going to mainnet is a code change.
- **No print, no pre-order bundle.** They need a shipping address; x402 carries none. They stay on the Stripe link.
- **Not verified live.** A step-by-step real Base Sepolia test is in `docs/agent-x402-live-test.md`, with a client that signs a real EIP-3009 authorization (`examples/x402-pay.mjs`). So far I tested against `scripts/mock-facilitator.mjs`, which checks nothing cryptographic. I did not create a wallet, sign a real EIP-3009 authorization, or call the real facilitator, so signature handling, the facilitator's response details and `settlement_pending` are unexercised. First real test: Base Sepolia, testnet USDC from a faucet, `https://x402.org/facilitator`.
- **No fulfilment.** A paid digital order is a KV record and a Stripe-style order id; the author must email the files at launch.

## To switch it on (testnet)
Cloudflare Pages variables (Preview first):

| Name | Value |
|---|---|
| `X402_MODE` | `testnet` (anything else, or unset, keeps it off) |
| `X402_PAY_TO` | the author's receiving address on Base Sepolia (`0x…`). A wallet the author controls; never a key in this repo. |
| `X402_FACILITATOR_URL` | optional; default `https://x402.org/facilitator` (only that host, or localhost, is accepted) |

With `X402_MODE` unset: the endpoint returns 503 `x402_not_open`, and no token can be minted with the `pay` scope.

## Safety summary
Server-defined terms; strict payload checks before any facilitator call; per-nonce replay guard; per-token single-use mandate; idempotency (same key replays the stored result without touching the facilitator); no secrets (the server never holds a private key: the author's receiving address is public, the agent signs with its own wallet); facilitator host allow-list; rate limit 10 challenges an hour per token. `settlement_unknown` (facilitator unreachable mid-settle) tells the agent not to pay again and blocks reuse of the same authorization.

Tests: `tests/x402.test.mjs` (unit) and `scripts/test-agent-x402.sh` (35 checks against `wrangler pages dev` + the mock facilitator).

## Why this rail is not the main one
It is autonomous spend with a mandate we invented rather than one a protocol signs. The Stripe link with a human completing payment stays the default and the only path for print. See `docs/agent-protocols.md`.

## A note on `504x-files`
There, x402/USDC was shown in the UI as a "planned second rail" and later removed as inaccurate once it was clear Stripe was never wired. The lesson applied here: the page says "off" and "not verified yet", the manifest says the same, and nothing is advertised as available.
