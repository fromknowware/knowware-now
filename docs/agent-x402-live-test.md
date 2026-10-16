# One real Base Sepolia test of the x402 rail, before it is switched on

Goal: prove the one thing the mock could not, that the **real** facilitator and the **real** testnet USDC contract accept what this server and `examples/x402-pay.mjs` produce. Nothing here touches real money: Base Sepolia is a test network and its USDC has no value. Production stays off throughout (`X402_MODE` is set on the **Preview** environment only).

Time: about 30 minutes. Cost: nothing.

## What is already proven, and what this test is for
| Already checked (no network) | Only this test can show |
|---|---|
| Server builds the 402 challenge, rejects bad payloads, never trusts the agent's `accepted` block, one-purchase mandate, replay and nonce guards, idempotency (35 curl checks, 10 unit tests, against a mock facilitator) | The real facilitator's `/verify` and `/settle` accept our `paymentRequirements` and `paymentPayload` shapes |
| The example client's EIP-712 signature recovers to the signer (`--selftest`, offline) | The USDC contract at `0x036C…CF7e` accepts that signature: domain `name`/`version`, chain id, field types |
| The facilitator at `https://x402.org/facilitator` lists `exact` on `eip155:84532` at x402 v2 (I read `/supported` on 2026-10-16) | That it settles, who pays gas, and what a failure looks like in practice |

## 0. Check the facilitator is still up (30 seconds, read-only)
```bash
curl -s https://x402.org/facilitator/supported | python3 -m json.tool | grep -B2 -A2 'eip155:84532'
```
You should see `"scheme": "exact"`, `"network": "eip155:84532"`, `"x402Version": 2`. If not, stop: the facilitator changed.

## 1. Two throwaway wallets (your machine; keys never go in the repo)
You need a **payer** (the agent's wallet) and a **receiver** (`X402_PAY_TO`, where the $11.95 testnet USDC lands). Use brand-new wallets that have never held anything real.

```bash
mkdir ~/x402-test && cd ~/x402-test && npm init -y >/dev/null && npm i viem
cp <repo>/examples/x402-pay.mjs .
node x402-pay.mjs --new-wallet     # run twice: one for the payer, one for the receiver
```
Write the two addresses down. Keep the **payer's private key** in your terminal session only (`export X402_TEST_PRIVATE_KEY=0x…`). The receiver needs only an address; you do not need its key to receive.

Sanity check of the signing code, offline:
```bash
node x402-pay.mjs --selftest        # expect: "selftest ok"
```

## 2. Fund the payer with testnet USDC
1. Open [faucet.circle.com](https://faucet.circle.com), choose **Base Sepolia** and **USDC**, paste the **payer** address. Circle's docs say 20 USDC per request, limited per 24 hours; if it refuses, wait or use another faucet (limits vary, check Circle's [faucet docs](https://developers.circle.com/w3s/developer-console-faucet)).
2. Confirm the balance on [sepolia.basescan.org](https://sepolia.basescan.org/address/) (paste the payer address, "Token Holdings"): about 20 USDC.
3. The payer should not need ETH: with EIP-3009 the facilitator submits the transfer and pays gas. If settlement fails with a gas error, send the payer a little Base Sepolia ETH from any Base Sepolia faucet and retry.

## 3. Switch the rail on in Preview only
Cloudflare Pages, project `knowware-book`, Settings, Variables and Secrets, **Preview** environment:

| Name | Value |
|---|---|
| `X402_MODE` | `testnet` |
| `X402_PAY_TO` | the **receiver** address from step 1 |
| `RATE_SALT` | any long random string, if not already set |

Leave `X402_FACILITATOR_URL` unset (default `https://x402.org/facilitator`). Leave Production untouched. Deploy the PR #22 branch preview; note its URL, `https://<something>.knowware-book.pages.dev`. Check:
```bash
curl -s https://<preview>/api/agent/status     # expect "x402":"testnet"
```

## 4. Mint a token the way a person would
1. On the preview, open `/read/01`, sign up with an email you control.
2. Open `/agents`, scroll to "Mint a token for your agent": name `x402 test`, operator `you`, lifetime 1 hour, **tick "Also let this agent pay for the digital edition ($11.95, one purchase)"**. (The box appears only because step 3 turned the rail on.) Copy the token; it is shown once.
```bash
export KNOWWARE_AGENT_TOKEN=kwa_…
```

## 5. Dry run (sends nothing but the price request)
```bash
node x402-pay.mjs --base https://<preview>
```
Expect: a `402`, the requirements (`eip155:84532`, amount `11950000`, the USDC address, your **receiver** as `payTo`), "For: x…@… (p_…)", and "Dry run. Nothing was sent."
Check by eye that `payTo` is your receiver and the amount is `11950000` (= 11.95 USDC).

## 6. The real payment
```bash
node x402-pay.mjs --base https://<preview> --pay
```
Success looks like: HTTP `200`, `"status":"paid"`, a real `transaction` hash, a `PAYMENT-RESPONSE` header, and an explorer link.

Then verify it independently of this server:
1. Open the explorer link: a `transferWithAuthorization` on the USDC contract, from the payer to the receiver, value 11.95 USDC.
2. The receiver's token holdings on basescan show +11.95 USDC.
3. `curl -s -H "Authorization: Bearer $KNOWWARE_AGENT_TOKEN" https://<preview>/api/agent/orders/<order_id>` shows `"status":"paid"` with the human, the agent and the note.

## 7. Check the guards on the real path
```bash
node x402-pay.mjs --base https://<preview> --pay --key <the same key>   # replay: 200, no second charge
node x402-pay.mjs --base https://<preview> --pay                        # new key: expect 409 mandate_used
```
The payer's balance must show **one** charge only.

## 8. If something fails
| You see | Likely cause | What to do |
|---|---|---|
| `402 payment_not_valid`, reason `insufficient_funds` | payer has no USDC | step 2 |
| `402 payment_not_valid`, a signature reason (for example `invalid_exact_evm_payload_signature`) | EIP-712 domain mismatch | the real contract's `name()`/`version()` differ from `USDC`/`2`; read them on basescan ("Read Contract") and send me the output; fix is one line in `lib/server/x402.js` (`extra`) |
| `402 payment_not_valid`, an unfamiliar reason | the real facilitator's schema differs from the spec I coded to | copy the full JSON; the mapping is in `payForDigital` |
| `402 settlement_failed` | gas or chain issue | read `reason`; fund the payer with a little ETH and retry with a new idempotency key |
| `502 facilitator_unreachable` / `settlement_unknown` | network | do not pay again; check basescan for a transfer; ask for the order status |
| `422 invalid_payment` with a `reason` | payload fails our own checks first | the `reason` names the field |
| `503 x402_not_open` | `X402_MODE` not `testnet` on the Preview environment you hit | step 3 |
| `404` on the endpoint | wrong host or branch not deployed | use the PR #22 preview URL |

Paste me the full output of steps 5 and 6 (never the private key or the token). I can read the real facilitator responses against the code and fix whatever differs.

## 9. Switching it off again
Remove `X402_MODE` and `X402_PAY_TO` from Preview. The endpoint returns 503 and no new `pay` token can be minted; existing ones are inert.

## 10. Done criteria before this PR is called ready
- [ ] A real `200 paid` with an on-chain transfer you saw on basescan.
- [ ] The replay and `mandate_used` checks behaved as above, on the real path.
- [ ] One failure case seen for real (for example a payer with no USDC) and its message read.
- [ ] Production still has no `X402_MODE`.
- [ ] You decided who emails the digital edition at launch.

Mainnet is a separate decision and a code change (`NETWORK` in `lib/server/x402.js`); do not do it from this test.
