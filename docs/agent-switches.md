# What is on, what is off, and what switches each on

State as shipped: **only things with all their plumbing are on.** Everything else is built, tested, and switched off.

## On at launch
| Thing | Notes |
|---|---|
| `/agents`, `/agents.txt`, `/agents.md`, `/llms.txt`, `/llms-full.txt`, `/.well-known/knowware.json` | Public, static, say plainly what is off |
| Markdown pages, chapter previews, stories as Markdown | Disclosure and licence in each file's front matter |
| `GET /api/agent/status`, `GET /api/agent/chapters` (metadata only) | Public |
| `/mcp` public tools: `list_chapters`, `read_preview`, `define_term` | `read_chapter` answers "not open yet" |
| **Pre-order list** at `/order#waitlist` and **news list** at `/read#news` (each confirmed by email; see `docs/email.md`) | Every "Pre-order" button leads to the pre-order list until a checkout exists |
| Shield on every agent route, strict API headers | |
| Theme icon, nav, stories | |

## Off until you switch them on
| Thing | Switch (Cloudflare Pages variable) | Plumbing it needs |
|---|---|---|
| Agent tokens, full-chapter API, MCP `read_chapter` | `AGENT_TOKENS=on` **and** flip `AGENT_TOKENS_OPEN` to `true` in `src/config.ts` (it only changes what the static pages say) | `RESEND_API_KEY` working, so a person can open the confirmation link |
| Stripe checkout for agents (test mode) | `AGENT_CHECKOUT=test` | `STRIPE_SECRET_KEY` (`sk_test_`), `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PREORDER`; see `docs/agent-checkout-setup.md` |
| x402 on Base Sepolia testnet | `X402_MODE=testnet` | `X402_PAY_TO` and the live test in `docs/agent-x402-live-test.md` |
| Admin view (orders, the two mailing lists) | `ADMIN_TOKEN` (32+ random characters, as a Secret) | nothing else |
| A real public pre-order | `CHECKOUT_OPEN=true` in `src/config.ts`, plus a real checkout behind `STRIPE_URL` | live Stripe; a code change on purpose |

Every switch is read at request time except the two constants in `src/config.ts`, which change the static text and need a deploy. Unset or any other value means off.

## Emergency off
`AGENT_API_DISABLED=true` turns every agent route and `/mcp` into a 503 at once. The waiting list and the Stripe webhook are not affected.

## The pre-order list and the news list
Two separate lists; the full description is `docs/email.md`.
- People join the pre-order list at `/order#waitlist` (`POST /api/waitlist`) and the news list at `/read#news` (`POST /api/interest`), browser origins only. One email field, a hidden trap field, a limit of 6 an hour per connection, and one email per address per ten minutes.
- Typing an address sends **one confirmation link**. A person is on the list only after pressing the button on it. Until then nothing is kept beyond a 48-hour pending record. The answer is the same for a new address, a member and a throttled address (no probing).
- Stored in KV as `waitlist:<sha256(email)>` and `interest:<sha256(email)>` with the consent wording, ask time and confirm time.
- **The site never mails a list.** It sends only the confirmation link. You send the one pre-order email and any news from Resend.
- To get a list, set `ADMIN_TOKEN`, then:
  ```bash
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "https://knowware.systems/api/admin/lists?list=waitlist&format=csv" -o waitlist.csv
  ```
  (`list=interest` for the news list; `/api/admin/waitlist` is kept as an alias.) JSON without `format=csv`. It pages 100 at a time (the `cursor` in the response, or `X-Next-Cursor` for CSV). Spreadsheet formulas in addresses are neutralised.
- To remove one person: see "Erasing one person" in `docs/email.md`.
- Agents are told to point a person at the form and never to sign anyone up.
