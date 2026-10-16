# Episode 02: The Eighth Server

**Channel:** faceless causal explainers of real systems that failed because nobody held the knowing. Look spec, palette, type and motion rules: see `ep01-the-first-message-was-a-question.md`, section 0a (locked 2026-10-16). This file repeats only what differs.
**System:** Knight Capital's automated order router (SMARS), August 1, 2012.
**Status:** DRAFT. Not published, not pushed. Every "confirmed" means confirmed by me against the primary source text on 2026-10-16. No human has source-checked it yet (see section 8).
**Target length:** about 5:20 including pauses and the 8-second end card (748 words of narration at 155 words per minute).
**Rhythm spine:** the clock. Short declarative sentences, numbers that tick up, and a visible 45-minute clock. The fastest of the first four episodes.
**Structure experiment (2026-10-16):** the closing turn ("in the book's reading") was moved from about 83% of the runtime to about 60%, ahead of the totals, the incident response, the loss and the SEC order. The last third is now the cost. See `rhythm-notes.md`, section 7.

---

## 0. Production notes

- **Narrator:** human voice only (author or hired actor). No AI voice, no cloning. Read it clipped and level. A company lost money here, but nobody died; keep it factual, not gleeful.
- **Process line, once on screen** at N05: *"Researched with AI, checked by a human, every claim linked below."* Do not publish with it until the human source check in section 8 is ticked.
- **Single source for the story:** the SEC's order, Release No. 70694, October 16, 2013. Every narration fact comes from it. Knight settled "without admitting or denying" the findings; the narration says so.
- **The refrain:** "Who knew...?" asked three times (N09, N11, N15), each answered from the SEC order. The empty ring K is on screen from N09.
- **Not said:** no speculation about individuals; the order does not name the technician and neither does the episode. No claim about what any executive knew beyond what the order says.

---

## 1. Script

| Line | Time | Narration | On screen | Source key |
|---|---|---|---|---|
| N01 | 0:00 | August first, 2012. Before the market opens, ninety-seven emails arrive at Knight Capital. | Cold open on navy. Mono `2012-08-01 08:01`. A stack of 97 small cream rectangles builds row by row; counter `97` in the tint. | SEC ¶19 |
| N02 | 0:07 | Each one carries the same error: Power Peg disabled. They aren't alerts. Knight never designed them to be, and generally nobody reads them. | The top rectangle opens; mono text `Power Peg disabled`. The stack dims to ghost. | SEC ¶19 |
| N03 | 0:16 | In about forty-five minutes, Knight will send orders for more than three hundred ninety-seven million shares it never meant to trade. | A clock ring appears, `00:45` counting down in mono. Counter `397,000,000+ shares`. | SEC ¶1, ¶10, ¶17 |
| N04 | 0:25 | This is a story about code that was supposed to be gone, and about who knew it wasn't. | Title card: **The Eighth Server**. | none (framing) |
| N05 | 0:35 | Knight Capital is a Wall Street broker-dealer. In 2012, its trading made up roughly ten percent of all trading in US-listed stocks. | Process line lower-third (5 s). Counter `~10%` in the tint; caption `of trading in US-listed stocks`. | SEC ¶11 |
| N06 | 0:45 | Customer orders flow into a router called SMARS. It sends smaller child orders to the exchanges, as liquidity allows. | Dashed frame labeled `SMARS router` draws in. Node **S, Seven servers** and node **E, Eighth server** appear inside it. Arc S to M. | SEC ¶12 |
| N07 | 0:53 | The New York Stock Exchange was starting a program for retail orders that day. To take part, Knight changed the router. The new code was meant to replace old code that sat unused. | Node **N, New code** draws in top left. Arc N to S, labeled `deployed`. | SEC ¶12, ¶13 |
| N08 | 1:06 | That old code was called Power Peg. Knight had stopped using it in 2003. It was still there, still callable. And the new code reused the flag that used to switch it on. | Node **O, Old code (Power Peg)** appears as a ghost at `[2,1]`, dated `2003`. Arc O to E, ghost, labeled `still callable`. A small mono `flag` marker moves from N toward O. | SEC ¶13, ¶14 |
| N09 | 1:19 | Who could say what that old code would do if it ran again? In 2005, Knight moved the piece that counts how many shares have been filled. Knight did not retest the old code afterward. | A faint dashed ring appears at `[1,2]`, unlabeled: the empty node K. Latent arc O to K draws and stops at the ring's edge. Mono `2005 moved`, `retest: none`. | SEC ¶14 |
| N10 | 1:33 | Starting July twenty-seventh, Knight rolled the new code out in stages across eight servers. A technician missed one. No second person checked the deployment, because Knight had no written procedure that required it. | Seven server marks fill from N one by one in signal blue, settling to cream; the eighth arc from N toward E begins and stops short. Mono `07-27`, `no second reviewer`. | SEC ¶15, ¶26 |
| N11 | 1:47 | Who knew the eighth server was different? According to the SEC, no one at Knight realized. | Latent arc N to K draws and stops at the ring's edge. | SEC ¶15 |
| N12 | 1:54 | On August first, orders carrying the repurposed flag reach the eighth server. The flag wakes the old code. The seven updated servers handle their orders correctly. The eighth starts sending child orders, over and over, with no regard for how many shares have already been filled. | O solidifies from ghost to cream. Arc S to M in cream, steady. Arc E to M in signal blue, repeating pulses. Mono `08-01`. | SEC ¶16 |
| N13 | 2:12 | Somewhere in Knight's systems, one part knows those parent orders are already filled. That knowledge never reaches the router. | A small cream mark on the edge of the frame labeled `order handling: filled`; a thin arc toward the router frame draws and does not connect. | SEC ¶16 |
| N14 | 2:20 | The market opens. Over about forty-five minutes, two hundred twelve small customer orders turn into millions of child orders: more than four million executions, in one hundred fifty-four stocks. | Node **M, Market** at `[2,2]`. Clock counts from `00:45`. Counters `212 parent orders` then `4,000,000+ executions` then `154 stocks`. | SEC ¶17 |
| N15 | 2:32 | Senior people are watching. At the open, they see a large position building in one account. But the monitoring tool only tracks positions after trades have happened. It sends no automated alerts, and it isn't connected to the orders going out. It doesn't display the limits, so whoever is looking has to already know them. | Node **P, Monitor (PMON)** at `[0,1]`, node **H, People watching** at `[0,2]`. Arc M to P `positions`, arc P to H `human monitoring`. Latent arc P to K draws and stops at the ring. Excerpt card, mono: `no automated alerts`. | SEC ¶24, ¶25 |
| N16 | 2:54 | Count what existed. An old function nobody had retested. A deployment nobody was required to double-check. Ninety-seven emails that were never designed to be alerts. A monitor that only helped someone who already knew the limits. | Diagram at full. Four callouts in turn, each touching its node: `O`, `N`, a small stack, `P`. | SEC ¶14, ¶15, ¶19, ¶25 |
| N17 | 3:08 | In the book's reading, the information was never the problem. What was missing was a place where it was held, and someone placed to answer: what is this system doing right now, and what is it for? | Latent arc H to K draws and stops. The ring comes to full size. All four latent arcs end at it; none enters. The ring stays on screen to the end. The 45-minute clock keeps running quietly in the corner. | book's argument (interpretation) |
| N18 | 3:23 | Now the totals. Knight ends up with a net long position of about three and a half billion dollars in eighty stocks. It also has a net short position of about three point one five billion in seventy-four others. | Two plain bars labeled `net long ~$3.5B, 80 stocks` and `net short ~$3.15B, 74 stocks`. | SEC ¶17 |
| N19 | 3:39 | In seventy-five of those stocks, Knight's executions are more than twenty percent of the trading volume. Other market participants get worse prices, and some get better ones. | Counter `75 stocks`, caption `Knight > 20% of volume`. No styling that celebrates or vilifies. | SEC ¶18 |
| N20 | 3:50 | Inside Knight, people can't quickly tell where the positions are coming from. Knight has no procedures for an incident like this. The technology team works the problem while the system keeps sending orders. | Arc H to P pulses; text `source of positions: unknown` in mono. Clock keeps running. | SEC ¶24, ¶27 |
| N21 | 4:03 | In one attempt to fix it, they remove the new code from the seven good servers. That makes it worse: now those servers wake the old code too. | Seven server marks go from cream to signal blue, all feeding M. | SEC ¶27 |
| N22 | 4:15 | When Knight finally stops the orders, it has lost more than four hundred sixty million dollars. | Clock stops at `00:00`. Counter `$460,000,000+ lost`. | SEC ¶1, ¶17 |
| N23 | 4:21 | In October 2013, the SEC found that Knight had violated the market access rule. Knight agreed to pay a twelve million dollar penalty, without admitting or denying the findings. | Excerpt card: `SEC · Release No. 70694 · Oct 16, 2013`, `penalty $12,000,000`. | SEC cover, §II, §IV (order) |
| N24 | 4:33 | In the book's terms, that is what the missing layer costs: forty-five minutes, and four hundred sixty million dollars. | The `45 min` and `$460,000,000+` counters slide together beside the ring, never inside it. The ring stays empty. | SEC ¶1, ¶17 (figures), book's argument (interpretation) |
| N25 | 4:41 | That layer has a name. The book calls it knowware. | `knowware` types beneath the ring. The ring stays empty. | book's argument |
| N26 | 4:46 | Here is the entry. Knowware, noun. One: the layer of knowing between people and machines: what the work is for, what the context is, and who answers for the result. Two: what goes missing when systems coordinate perfectly and nobody knows what they are doing. | Closing entry card on cream (frame type 6 in the Ep01 look spec). No animation. | DEF |
| N27 | 5:06 | Sources are linked below. The full entry is at knowware dot press slash definition. | End card, 8 seconds of silence. | DEF |

**Narration word count:** 748 words across N01 to N27.

---

## 2. Title options

1. **The Eighth Server** (working title; recommended)
2. **97 Emails Nobody Read: How Knight Capital Lost $460 Million**
3. **The Code That Was Supposed to Be Gone**

---

## 3. Thumbnail concept (text only, dictionary-entry style)

Navy ground, set like the top of an entry.

```
ENTRY · 2012-08-01                            (JetBrains Mono, cream, small, top left)

eighth server, n.                             (Helvetica Neue 800, cream, very large)

1. the one that was missed.                   (Helvetica Neue 400, cream, medium)
2. 45 minutes.                                (Helvetica Neue 400, cream, medium)
   ┌ ─ ─ ─ ─ ─ ─ ─ ┐
   │   (empty)     │                          (dashed blue-tint #6BADFF box, nothing inside)
   └ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## 4. Description and pinned comment

### 4a. YouTube description

```
On August 1, 2012, ninety-seven automated emails reached Knight Capital before the market opened. About forty-five minutes after the open, Knight had lost more than $460 million. This episode follows the SEC's findings on how old code, a missed server and a monitor nobody could act on fit together.

Researched with AI, checked by a human, every claim linked below.

CHAPTERS
0:00 The emails
0:35 The router and the new code
1:19 The old code
1:54 August 1
2:32 Who was watching
2:54 The missing layer
3:23 The totals and the cost
4:21 The order
4:46 The entry: knowware

SOURCES
[1] SEC, In the Matter of Knight Capital Americas LLC, Release No. 70694, October 16, 2013:
https://www.sec.gov/litigation/admin/2013/34-70694.pdf
[2] knowware (n.), the dictionary entry: https://knowware.press/definition

Knight consented to the SEC's order without admitting or denying its findings. Every factual claim in this episode comes from paragraph-numbered findings in [1]; the reading of the story as a missing "knowing" layer is the book's argument, not an SEC finding.

Knowware, by Khayyam Wakil: https://knowware.press
Errors: tell us in the comments and we will correct them in the pinned comment and the description.
```

### 4b. Pinned comment

```
Source for this episode: SEC Release No. 70694 (Oct 16, 2013), In the Matter of Knight Capital Americas LLC
https://www.sec.gov/litigation/admin/2013/34-70694.pdf
Paragraph numbers for each claim are in our accuracy checklist, linked on request.

Process: researched with AI, checked by a human, every claim linked above. A person is accountable for what this video says.

Note: Knight neither admitted nor denied the findings. Where the video says "the SEC found", it means the findings in that order.

Spotted a mistake? Reply here. Corrections go in this comment.
```

---

## 5. Diagram spec

Same schema as `diagram:` in `src/content/chapters/*.md` (3 by 3 grid, one latent node at `[1,2]`). Eight nodes.

```yaml
diagram:
  title: "The Eighth Server"
  caption: "New code reached seven servers. Old code woke on the eighth. The monitor watched positions after the fact. Nothing held what the system was doing."
  nodes:
    - id: "N"
      label: "New code"
      pos: [0, 0]
    - id: "S"
      label: "Seven\nservers"
      pos: [1, 0]
    - id: "E"
      label: "Eighth\nserver"
      pos: [2, 0]
    - id: "O"
      label: "Old code\n(Power Peg)"
      pos: [2, 1]
    - id: "M"
      label: "Market"
      pos: [2, 2]
    - id: "P"
      label: "Monitor\n(PMON)"
      pos: [0, 1]
    - id: "H"
      label: "People\nwatching"
      pos: [0, 2]
    - id: "K"
      label: "knowware"
      pos: [1, 2]
      latent: true
  arcs:
    - from: "N"
      to: "S"
      label: "deployed"
    - from: "O"
      to: "E"
      label: "still callable"
    - from: "S"
      to: "M"
      label: "correct orders"
    - from: "E"
      to: "M"
      label: "child orders"
    - from: "M"
      to: "P"
      label: "positions"
    - from: "P"
      to: "H"
      label: "human monitoring"
    - from: "N"
      to: "K"
      kind: "latent"
    - from: "O"
      to: "K"
      kind: "latent"
    - from: "P"
      to: "K"
      kind: "latent"
    - from: "H"
      to: "K"
      kind: "latent"
```

Overlay-only elements (not schema nodes): the `SMARS router` frame, the 45-minute clock, the stack of 97 envelopes, the `flag` marker, the counters.

### Build sequence

| Step | Line | Appears | Notes |
|---|---|---|---|
| 1 | N01 | Stack of 97 rectangles; mono `08:01` | Overlay |
| 2 | N02 | Top rectangle opens: `Power Peg disabled` | Overlay |
| 3 | N03 | Clock ring `00:45`; counter `397,000,000+` | Overlay |
| 4 | N05 | Counter `~10%` | Overlay |
| 5 | N06 | Dashed `SMARS router` frame; nodes **S**, **E**; arc **S to M** drawn faint until N12 | M appears at N14 |
| 6 | N07 | Node **N**; arc **N to S** `deployed` | |
| 7 | N08 | Node **O** as ghost at `[2,1]`; arc **O to E** ghost; `flag` marker N toward O | Dated `2003` |
| 8 | N09 | Faint dashed ring at `[1,2]` (K), unlabeled | On screen from here |
| 9 | N09 | Latent arc **O to K** stops at the ring's edge | First "who knew" beat |
| 10 | N10 | Seven server marks fill; arc N toward E starts and stops short | `07-27`, `no second reviewer` |
| 11 | N11 | Latent arc **N to K** stops at the ring's edge | Second beat |
| 12 | N12 | **O** solidifies; **E to M** pulses in blue | `08-01` |
| 13 | N13 | Orphan `order handling: filled` mark; arc stops short | Overlay |
| 14 | N14 | Node **M** at `[2,2]`; clock runs; counters | |
| 15 | N15 | Node **P, Monitor (PMON)** at `[0,1]`, node **H, People watching** at `[0,2]`; arcs **M to P**, **P to H** | Excerpt card `no automated alerts` |
| 16 | N15 | Latent arc **P to K** stops at the ring's edge | Third beat |
| 17 | N16 | Four callouts touch **O**, **N**, the envelope stack, **P** | Overlay |
| 18 | N17 | Latent arc **H to K** draws and stops; ring grows to full size | **Turn, about 60% of runtime.** All four latent arcs end at the ring; none enters; ring stays on screen to the end. Clock keeps running quietly |
| 19 | N18 | Bars `net long ~$3.5B, 80 stocks` and `net short ~$3.15B, 74 stocks` | Overlay; aftermath begins |
| 20 | N19 | Counter `75 stocks` | Overlay |
| 21 | N20 | Arc **H to P** pulses; `source of positions: unknown` | Overlay |
| 22 | N21 | Seven server marks turn blue and feed **M** | Overlay |
| 23 | N22 | Clock reaches `00:00`; counter `$460,000,000+` | Overlay |
| 24 | N23 | Excerpt card for the SEC order | Overlay |
| 25 | N24 | `45 min` and `$460,000,000+` counters slide together beside the ring | Never inside the ring |
| 26 | N25 | `knowware` types beneath the ring; ring stays empty | |
| 27 | N26 | Cut to the dictionary-entry card on cream | |
---

## 6. Accuracy checklist

**Method.** The SEC order was downloaded as a PDF from https://www.sec.gov/litigation/admin/2013/34-70694.pdf on 2026-10-16, converted to text, and read in full through ¶30. Locators are the order's own paragraph numbers. Fragments are short quotes or close paraphrases; open the PDF for the full passage. Status "confirmed" means I found the claim in that paragraph; no human has yet verified it.

| ID | Narration sentence | Source | Supporting passage (locator + fragment) | Status |
|---|---|---|---|---|
| N01.1 | August first, 2012. Before the market opens, ninety-seven emails arrive at Knight Capital. | SEC ¶1, ¶19 | ¶1: "On August 1, 2012, Knight Capital Americas LLC"; ¶19: system "sent 97 of these e-mail messages...before the 9:30 a.m. market open" | confirmed |
| N02.1 | Each one carries the same error: Power Peg disabled. | SEC ¶19 | "identified an error described as 'Power Peg disabled'" | confirmed |
| N02.2 | They aren't alerts. Knight never designed them to be, and generally nobody reads them. | SEC ¶19 | "Knight did not design these types of messages to be system alerts, and Knight personnel generally did not review them" | confirmed. "Generally nobody reads them" paraphrases "generally did not review" |
| N03.1 | In about forty-five minutes, Knight will send orders for more than three hundred ninety-seven million shares it never meant to trade. | SEC ¶1, ¶10, ¶17 | ¶17: "4 million executions in 154 stocks for more than 397 million shares in approximately 45 minutes"; ¶10: "unintended...portfolio" | confirmed. "Send orders for" means executions of that many shares; the order says "obtained over 4 million executions...for more than 397 million shares" |
| N04.1 | This is a story about code that was supposed to be gone, and about who knew it wasn't. | none | Framing, no factual claim. Code "intended to delete" is ¶13 | n/a |
| N05.1 | Knight Capital is a Wall Street broker-dealer. | SEC ¶11 | "U.S.-based broker-dealer...principal business operations in Jersey City" | confirmed ("Wall Street" is shorthand for US financial markets, not a claim about location) |
| N05.2 | In 2012, its trading made up roughly ten percent of all trading in US-listed stocks. | SEC ¶11 | "Throughout 2011 and 2012, Knight's aggregate trading...generally represented approximately ten percent of all trading in listed U.S. equity securities" | confirmed |
| N06.1 | Customer orders flow into a router called SMARS. | SEC ¶12 | "SMARS is an automated, high speed, algorithmic router that sends orders into the market" | confirmed |
| N06.2 | It sends smaller child orders to the exchanges, as liquidity allows. | SEC ¶12 | "as needed based on the available liquidity, send one or more representative (or 'child') orders to external venues" | confirmed |
| N07.1 | The New York Stock Exchange was starting a program for retail orders that day. | SEC ¶12 | "Retail Liquidity Program...at the New York Stock Exchange, which was scheduled to commence on August 1, 2012" | confirmed |
| N07.2 | To take part, Knight changed the router. The new code was meant to replace old code that sat unused. | SEC ¶12, ¶13 | ¶12: "made a number of changes...developing and deploying new software code in SMARS"; ¶13: "intended to replace unused code" | confirmed |
| N08.1 | That old code was called Power Peg. Knight had stopped using it in 2003. | SEC ¶13, ¶14 | ¶13: "functionality called 'Power Peg'"; ¶14: "In 2003, Knight ceased using the Power Peg functionality" | confirmed |
| N08.2 | It was still there, still callable. | SEC ¶13 | "the Power Peg functionality remained present and callable" | confirmed |
| N08.3 | And the new code reused the flag that used to switch it on. | SEC ¶13 | "The new RLP code also repurposed a flag that was formerly used to activate the Power Peg code" | confirmed |
| N09.1 | Who could say what that old code would do if it ran again? | none | Framing question; answered by N09.2 and N09.3 | n/a |
| N09.2 | In 2005, Knight moved the piece that counts how many shares have been filled. | SEC ¶14 | "In 2005, Knight moved the tracking of cumulative shares function in the Power Peg code to an earlier point" | confirmed |
| N09.3 | Knight did not retest the old code afterward. | SEC ¶14 | "Knight did not retest the Power Peg code after moving the cumulative quantity function" | confirmed |
| N10.1 | Starting July twenty-seventh, Knight rolled the new code out in stages across eight servers. | SEC ¶15 | "Beginning on July 27, 2012, Knight deployed the new RLP code...in stages...one of the eight SMARS computer servers" | confirmed |
| N10.2 | A technician missed one. | SEC ¶15 | "one of Knight's technicians did not copy the new code to one of the eight SMARS computer servers" | confirmed |
| N10.3 | No second person checked the deployment, because Knight had no written procedure that required it. | SEC ¶15, ¶26 | ¶15: "Knight did not have a second technician review...no written procedures that required such a review"; ¶26 | confirmed. "Because" is the narration's link; the order lists both facts together |
| N11.1 | Who knew the eighth server was different? | none | Framing question; answered by N11.2 | n/a |
| N11.2 | According to the SEC, no one at Knight realized. | SEC ¶15 | "no one at Knight realized that the Power Peg code had not been removed from the eighth server" | confirmed |
| N12.1 | On August first, orders carrying the repurposed flag reach the eighth server. The flag wakes the old code. | SEC ¶16 | "orders sent with the repurposed flag to the eighth server triggered the defective Power Peg code still present on that server" | confirmed |
| N12.2 | The seven updated servers handle their orders correctly. | SEC ¶16 | "The seven servers that received the new code processed these orders correctly" | confirmed |
| N12.3 | The eighth starts sending child orders, over and over, with no regard for how many shares have already been filled. | SEC ¶16 | "continuously sent child orders, in rapid sequence...without regard to the number of share executions Knight had already received" | confirmed |
| N13.1 | Somewhere in Knight's systems, one part knows those parent orders are already filled. That knowledge never reaches the router. | SEC ¶16 | "one part of Knight's order handling system recognized that the parent orders had been filled, this information was not communicated to SMARS" | confirmed |
| N14.1 | The market opens. Over about forty-five minutes, two hundred twelve small customer orders turn into millions of child orders: more than four million executions, in one hundred fifty-four stocks. | SEC ¶1, ¶17 | "212 incoming parent orders...SMARS sent millions of child orders, resulting in 4 million executions in 154 stocks...in approximately 45 minutes" | confirmed. "The market opens" is context (¶19 gives 9:30 a.m. open); the order does not state the 45 minutes began at the open |
| N15.1 | Senior people are watching. At the open, they see a large position building in one account. | SEC ¶25 | "At the opening of the market, senior Knight personnel observed a large volume of positions accruing in the 33 Account" | confirmed |
| N15.2 | But the monitoring tool only tracks positions after trades have happened. | SEC ¶25 | "PMON, is a post-execution position monitoring system" | confirmed |
| N15.3 | It sends no automated alerts, and it isn't connected to the orders going out. | SEC ¶25 | "Knight did not link this tool to its entry of orders"; "did not generate automated alerts regarding the firm's financial exposure" | confirmed |
| N15.4 | It doesn't display the limits, so whoever is looking has to already know them. | SEC ¶25 | "PMON also did not display the limits...the person viewing PMON had to know the applicable limits" | confirmed |
| N16.1 | An old function nobody had retested. | SEC ¶14 | as N09.3 | confirmed ("nobody" = Knight did not retest) |
| N16.2 | A deployment nobody was required to double-check. | SEC ¶15, ¶26 | as N10.3 | confirmed |
| N16.3 | Ninety-seven emails that were never designed to be alerts. | SEC ¶19 | as N02.2 | confirmed |
| N16.4 | A monitor that only helped someone who already knew the limits. | SEC ¶25 | as N15.4 | confirmed |
| N17.1 | In the book's reading, the information was never the problem. What was missing was a place where it was held, and someone placed to answer: what is this system doing right now, and what is it for? | book | Interpretation, labeled as the book's reading | interpretation, not a factual claim |
| N18.1 | Now the totals. | none | Framing | n/a |
| N18.2 | Knight ends up with a net long position of about three and a half billion dollars in eighty stocks. | SEC ¶1, ¶17 | "net long position in 80 stocks of approximately $3.5 billion" | confirmed |
| N18.3 | It also has a net short position of about three point one five billion in seventy-four others. | SEC ¶1, ¶17 | "a net short position in 74 stocks of approximately $3.15 billion" | confirmed |
| N19.1 | In seventy-five of those stocks, Knight's executions are more than twenty percent of the trading volume. | SEC ¶18 | "for 75 of the stocks, Knight's executions comprised more than 20 percent of the trading volume" | confirmed. "Those stocks" refers to the 154 stocks, not the 80 net long |
| N19.2 | Other market participants get worse prices, and some get better ones. | SEC ¶18 | "some participants receiving less favorable prices...and others receiving more favorable prices" | confirmed |
| N20.1 | Inside Knight, people can't quickly tell where the positions are coming from. | SEC ¶24 | "Knight personnel could not quickly determine the nature or source of the positions accumulating in the 33 Account" | confirmed |
| N20.2 | Knight has no procedures for an incident like this. | SEC ¶27 | "Knight did not have supervisory procedures concerning incident response" | confirmed |
| N20.3 | The technology team works the problem while the system keeps sending orders. | SEC ¶27 | "Knight relied primarily on its technology team...system continued to send millions of child orders while its personnel attempted to identify the source" | confirmed |
| N21.1 | In one attempt to fix it, they remove the new code from the seven good servers. | SEC ¶27 | "Knight uninstalled the new RLP code from the seven servers where it had been deployed correctly" | confirmed |
| N21.2 | That makes it worse: now those servers wake the old code too. | SEC ¶27 | "This action worsened the problem, causing additional incoming parent orders to activate the Power Peg code that was present on those servers" | confirmed |
| N22.1 | When Knight finally stops the orders, it has lost more than four hundred sixty million dollars. | SEC ¶1, ¶10 | "By the time that Knight stopped sending the orders...Knight lost over $460 million" | confirmed |
| N23.1 | In October 2013, the SEC found that Knight had violated the market access rule. | SEC cover, ¶9 | Release No. 70694 / October 16, 2013; ¶9: "Knight violated Rule 15c3-5" | confirmed |
| N23.2 | Knight agreed to pay a twelve million dollar penalty, without admitting or denying the findings. | SEC §II, order | §II: "without admitting or denying the findings"; order: "civil money penalty in the amount of $12,000,000" | confirmed |
| N24.1 | In the book's terms, that is what the missing layer costs: forty-five minutes, and four hundred sixty million dollars. | SEC ¶1, ¶17, book | Figures as N03.1 and N22.1 ("approximately 45 minutes"; "lost over $460 million"); the framing as the cost of a missing layer is the book's | interpretation of confirmed figures, not a factual claim |
| N25.1 | That layer has a name. The book calls it knowware. | DEF | https://knowware.press/definition, "The third body": "I call it knowware" | confirmed |
| N26.1 | Knowware, noun. One: ... Two: ... | DEF | Live https://knowware.press/definition, `def-senses` list, read verbatim 2026-10-16 | confirmed |
| N27.1 | The full entry is at knowware dot press slash definition. | DEF | Page is live | confirmed |

---

## 7. Flags and cuts

- **F1. Wall Street.** "Wall Street" in N05 is shorthand. The order places Knight's operations in Jersey City, New Jersey. Consider "a US broker-dealer" if the author wants it literal.
- **F2. The 45 minutes.** The order says SMARS produced the executions "in approximately 45 minutes" on August 1; it does not state that the window began at the 9:30 open. N14 says "The market opens. Over about forty-five minutes", which implies it. Consider "That morning, over about forty-five minutes" to match the order exactly.
- **F3. The 97 emails.** The order says Knight "generally did not review" them. N02 says "generally nobody reads them". If the author wants zero room for an objection, use "Knight's staff generally did not review them."
- **F4. The refrain.** N09, N11 and N15 end on the order's own findings; the interpretive turn is N17 and is labeled.
- **F5. What this episode does not claim.** It does not say the technician was at fault (the order frames it as a process gap: no written procedure, no second reviewer).
- **C1. Cut:** secondary retellings of the Knight story (blogs, talks) include figures such as how many shares per minute or a "dormant flag" colour narrative. None is used; every number comes from the order.
- **Not verified:** no human source check; time codes are word-count estimates; the episode has not been read aloud.

---

## 8. Human review log

- [ ] Author source check: open the SEC order PDF and tick each checklist row against its paragraph.
- [ ] Author listening pass: read the narration aloud once; mark any line that trips.
- [ ] Author decision on F1, F2 and F3 wording.
