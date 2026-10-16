# Agent protocols: what Knowware adopts, and what it does not

Written 2026-10-16. The principle is the book's: agents act with a human in the room. Every action that costs money or unlocks gated text must name a human principal who authorized it. Where a protocol carries a signed human mandate, use it; otherwise the agent gets a link a human completes. The setting is a solo author, a static Astro site on Cloudflare Pages, Stripe, and no pre-order yet. Prefer fewer things done properly.

Most of the sources below are secondary or vendor-adjacent; where a primary source gave less than I wanted, that is stated.

## Adopted

| Thing | Verdict | Why |
|---|---|---|
| `/llms.txt`, `/llms-full.txt` | Adopt | Cheap, static, the [format](https://llmstxt.org/) is stable (H1, blockquote, H2 link lists, `Optional`). Honest caveat: it is a community proposal, and one [log study](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/) found 97% of files get zero AI requests. It also carries the terms and the disclosure where a coding agent will see them, so it is worth ten minutes. |
| `.md` siblings of pages, `rel="alternate" type="text/markdown"` | Adopt | llmstxt.org [suggests `page.md`](https://llmstxt.org/) siblings. Static files need no Function, no invocations, and can carry front matter (the synthesis disclosure) that survives copying. |
| Content negotiation (`Accept: text/markdown`) | Not done | [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents) is a zone feature for Pro, Business and Enterprise plans that converts HTML at the edge. If the zone is on a plan that has it, flip it on later; it composes with the `.md` files. A Pages Function in front of every request to negotiate would add invocations to every page view for no gain. |
| `Content-Signal` in robots.txt | Adopt, flagged | The [Content Signals](https://blog.cloudflare.com/content-signals-policy/) vocabulary is `search`, `ai-input`, `ai-train`. Set to `search=yes, ai-input=yes, ai-train=no`, matching "read and quote for the principal; no training". A stated preference, not a licence. **Author decision.** |
| Stripe Checkout (test mode, flagged off) | Adopt (PR 3) | The only payment path a solo author on Stripe can run today. The agent fetches a link; a human pays. |
| Remote MCP server | See PR 2 | |

## Considered and not adopted

| Thing | Verdict | Why |
|---|---|---|
| [Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/) (RFC 9421 signatures, Cloudflare signed agents and verified bots) | Defer | It identifies the bot operator, not the human, so it does not satisfy the principle by itself. Verifying means fetching an agent-supplied key directory (an SSRF surface) and Ed25519 verification in a Function. Worth adding later as an optional tier that raises a token's rate limit. Cloudflare's own verified-bot checks are not exposed to Pages Functions without Bot Management. |
| Cloudflare [pay per crawl](https://blog.cloudflare.com/introducing-pay-per-crawl) (HTTP 402) | Not applicable | A private-beta Cloudflare product for charging crawlers. The book is free to read by design and the text is not for sale per request. Revisit only if the author decides to charge AI crawlers. |
| OpenAI/Stripe [Agentic Commerce Protocol](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol) and [Shared Payment Tokens](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) | Not yet | ACP is in beta (latest stable 2026-04-17 per its repo). An SPT is a scoped, single-merchant, amount- and time-limited reference to a payment method that the agent platform issues; it carries the human's authorization. Stripe's docs for processing agent credentials were labelled private preview when I looked, and a secondary source says availability is limited to the US and Canada for selected flows. The seller side needs the agent platform (ChatGPT, etc.) to list the product, and a catalog. None of that is reachable from a static site with no live checkout. This is the right *future* autonomous path for a Stripe seller: the SPT is the signed human mandate. Revisit when SPT is generally available and the pre-order is live. |
| Google [AP2](https://github.com/google-agentic-commerce/AP2) | No | Signed mandates (verifiable credentials) are the right shape, but the repo is samples and a spec; the SDK is "not yet on PyPI", and I found no way for a merchant to accept it without wallet and payments partners. Explainers disagree on the mandate naming across versions. |
| Coinbase [x402](https://www.theblock.co/post/372064/cloudflare-coinbase-launch-x402-foundation) | No | HTTP 402 with stablecoin settlement. It suits pay-per-call APIs between machines. For a $33 book bought on behalf of a person it adds a crypto rail and custody for no benefit, and it has no human mandate in it. |
| [Visa Intelligent Commerce / Trusted Agent Protocol](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.22276.html), Mastercard Agent Pay | No | Card-network programs for enrolled agents and acquirers. Visa's TAP builds on HTTP Message Signatures and aligns with Web Bot Auth, so it may become a light merchant-side add-on later; Mastercard's merchant requirements I could not confirm from a primary source. Neither is something a solo author joins ahead of a live checkout. |

## So there is no autonomous purchase path

The brief allowed one "only if a signed-mandate protocol you verified supports it". None is verified and reachable (see above), so none is built. The agent purchase endpoint returns a Stripe-hosted Checkout URL that a human completes. The page and manifest say `autonomous_payment: not_supported`.

## Sources

- llms.txt: https://llmstxt.org/ , adoption: https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/
- Cloudflare Markdown for Agents: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents
- Web Bot Auth: https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
- Content Signals: https://blog.cloudflare.com/content-signals-policy/
- Pay per crawl: https://blog.cloudflare.com/introducing-pay-per-crawl
- ACP: https://github.com/agentic-commerce-protocol/agentic-commerce-protocol , https://stripe.com/newsroom/news/stripe-openai-instant-checkout
- Stripe SPT: https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens
- AP2: https://github.com/google-agentic-commerce/AP2
- x402: https://www.theblock.co/post/372064/cloudflare-coinbase-launch-x402-foundation
- Visa: https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.22276.html
- MCP: https://modelcontextprotocol.net/specification/2026-07-28/changelog and https://blog.cloudflare.com/mcp-v2/
