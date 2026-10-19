# Email and sign-ups

Every message the site can send, every list it keeps, and how to run, test and erase them. Code: `lib/server/mail.js`, `lib/server/reader.js`, `functions/api/reader.js`, `functions/api/reader/confirm.js`.

## What the site sends

| Message | When | To | Consent | Opens access? |
|---|---|---|---|---|
| Confirmation / sign-in link | Someone types an address at a chapter gate | That address | None needed: one message, no marketing, expires in 48 h | Only after its button is pressed |
| New nomination | Someone submits `/contribute` | The author (`CLAIM_NOTIFY_TO`) | Internal | No |

The site sends no marketing email. Chapter news and the pre-order notice are sent by the author from Resend to the two lists below.

## Reading needs a confirmed email
1. A visitor enters an address at a chapter gate. The site stores a pending record (`pending:<hash>`, 48 h) and mails one link.
2. The answer is always "check your email", whether the address is new, known or throttled. Nothing in the response or the page says which.
3. The link opens `/api/reader/confirm`. Opening it changes nothing, so a mail scanner that fetches every link cannot confirm an address on someone's behalf. Pressing **Confirm and read** uses the link (once), verifies the address and signs that device in.
4. An address can be mailed once per ten minutes and five times a day. A connection can ask ten times an hour.
5. An address has at most five signed-in devices. The sixth sign-in signs out the oldest. Cookies last 180 days.
6. Reading on another device means entering the same address there for a fresh link.

Without `RESEND_API_KEY` the site answers 503 and unlocks nothing. `READER_AUTOCONFIRM=true` skips the email and confirms at once, for local development and CI only; it is ignored whenever `RESEND_API_KEY` is set, and must never be set in Cloudflare.

## Chapter unlocks
Confirming opens Chapter 1. `unlocked = min(10, 1 + credits + weeks since confirming)`, in book order (`01`–`09`, then `x`). One more opens every 7 days with no action. Credits (one chapter each; `lib/server/unlocks.js`):

| Credit | Earned when | Cap |
|---|---|---|
| `invite` | A NEW address confirms its email through your share link (`/read/01/?ref=CODE`). No credit for yourself or an alias (`+tag`, Gmail dots), for an address someone else brought first, or for an existing reader. | 9 |
| `nominate` | You submit `/contribute` while signed in | 2 |
| `waitlist` | Your address is confirmed on the pre-order list | 1 |
| `interest` | Your address is confirmed on the news list | 1 |
| `note` | You send the author a note (`/api/reader/note`; it is emailed to `CLAIM_NOTIFY_TO` with the reader as Reply-To) | 2 |

A credit is never taken back: leaving a list, or the friend leaving, does not close a chapter. The two list credits are a thank-you; consent for each list is still its own unticked, separate choice with its own wording. The site never emails a third party for a reader (invites are a link the reader shares themselves). An agent token opens exactly what its person has open (`chapter_locked` otherwise). Page: `/read/progress`, data: `GET /api/reader/me`.

Known soft spot: someone with many throwaway inboxes can open chapters faster than the weekly drip. That only moves a free chapter earlier, so it is accepted.

## The two lists
They are different lists with different consent, stored separately, and joining one never joins the other.

| | News (**interest**) | Pre-order list (**waitlist**) |
|---|---|---|
| What it is for | A note when a chapter is published and when the print edition is ready | One email when pre-orders open |
| Where collected | The optional, unticked box on the chapter gate | The form on `/order` |
| KV key | `interest:<sha256(email)>` | `waitlist:<sha256(email)>` |
| Consent wording | `INTEREST_CONSENT` in `lib/site-facts.mjs` | `WAITLIST_CONSENT` in `lib/site-facts.mjs` |
| Active when | The address is confirmed: the same click that opens reading (gate box), or its own confirmation link (`/read` news form, `/api/interest`) | Its own confirmation link (`/api/waitlist`, then `/api/list/confirm`) |
| Until then | Nothing kept except a 48-hour pending record | Same |

Both texts come from `lib/site-facts.mjs`, which the forms, the privacy page and the stored consent record all read, so what a person saw is what is on file.

## Getting addresses into Resend
The site's Resend key is send-only on purpose, so it never reads or writes contacts. To mail a list, export it and import it yourself:

```bash
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "https://knowware.systems/api/admin/lists?list=waitlist&format=csv" -o waitlist.csv
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "https://knowware.systems/api/admin/lists?list=interest&format=csv" -o interest.csv
```
Import each CSV into its own Resend segment ("Knowware pre-order waitlist", "Knowware updates"; the `email` column maps to the contact email) and send a Broadcast to that segment. The export holds confirmed members only; `&status=all` adds rows that never confirmed (old sign-ups show as `legacy`). `X-Next-Cursor` on a response means there is another page: repeat with `&cursor=…`. Resend adds the unsubscribe link and header to broadcasts.

## Sender
`READER_FROM` (Pages secret) is the From address; Reply-To is `hello@knowware.systems`. Until `knowware.systems` is a verified Resend domain it is `Knowware <hello@knowware.institute>`. Switch it by setting the secret and redeploying (`gh workflow run pages.yml --ref main`). The postal address printed in every footer is `POSTAL_ADDRESS` in `lib/site-facts.mjs`; it must be filled in before any list email is sent.

## Testing
- `npm test` covers the reader, throttles, device cap, both lists, the export and both message formats.
- `scripts/test-reader.sh` and `scripts/test-lists.sh` run the real flows against a local server that talks to `scripts/mock-resend.mjs`, which records messages instead of sending them (CI does this on port 8789).
- Never send test mail to anyone but your own address.

## Erasing one person
Delete, for `h = sha256(lowercased email)`: `acct:h` (and its `refcode:<code>`), `credit:h:*`, `interest:h`, `waitlist:h`, `mail10:h`, `maild:h`, every `readerdev:h:*` key and the `reader:<token hash>` each ends with (the token hash is the part after the last colon), then any `claim:*` whose `email` matches. Leave nothing else with the address in it.
