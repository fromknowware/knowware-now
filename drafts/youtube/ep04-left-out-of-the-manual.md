# Episode 04: Left Out of the Manual

**Channel:** faceless causal explainers of real systems that failed because nobody held the knowing. Look spec, palette, type and motion rules: see `ep01-the-first-message-was-a-question.md`, section 0a (locked 2026-10-16). This file repeats only what differs.
**System:** Boeing 737 MAX and its MCAS flight control software, certification through the Lion Air 610 and Ethiopian Airlines 302 crashes (2012 to 2019).
**Status:** DRAFT. Not published, not pushed. "Confirmed" means confirmed by me against the House committee report text on 2026-10-16. No human has source-checked it yet (section 8). Single-source caveat in section 7 (F1).
**Target length:** about 5:30 including pauses and the 8-second end card (751 words of narration at 155 words per minute).
**Rhythm spine:** the ledger. Years are the pulse: a dated line is added on each beat, and the refrain "who held it?" returns after each dated entry. The longest time span of the four episodes, told with the least motion.

---

## 0. Production notes

- **Narrator:** human voice only. No AI voice, no cloning. Read it level and unhurried. 346 people died; no music, no sound of aircraft, no imagery of wreckage or aircraft in flight.
- **Process line, once on screen** at N05: *"Researched with AI, checked by a human, every claim linked below."* Do not publish with it until the human source check in section 8 is ticked.
- **Single source, attributed.** Every fact comes from the House Transportation and Infrastructure Committee's report, which its own text says was "produced by Democratic staff of the Committee." The narration says so (N06) and says the responses of Boeing and the FAA were not read. Some facts are the report quoting other documents (the JATR review; Boeing emails); the narration attributes those where it uses them.
- **Not said:** no claim about any individual's intent; no use of the committee's characterizations of Boeing's honesty ("deceived", "concealed") as fact; the narration uses the report's descriptive findings only. Names of Boeing personnel in the report are not used.
- **The refrain:** "Who held that?" is spoken three times (N09, N11, N15). Each is answered in the same or next sentence from the report, in this order: a Boeing employee acting for the FAA, with the FAA having delegated; a picture the FAA's staff saw only in fragments (per the joint review panel); Boeing, for more than fourteen months.

---

## 1. Script

| Line | Time | Narration | On screen | Source key |
|---|---|---|---|---|
| N01 | 0:00 | November 2012. A Boeing test pilot sits in a flight simulator. A flight control function called MCAS activates without a command. It takes him more than ten seconds to respond. He calls the condition catastrophic. | Navy. A single dated line in mono, `2012-11`, with a short cream bar growing to `>10 s`. Silence. | HOUSE-6, HOUSE-9 |
| N02 | 0:16 | The FAA's guidance says pilots should be able to respond to a condition like that within four seconds. | A second, shorter bar beside the first: `4 s (FAA guidance)`. | HOUSE-9 |
| N03 | 0:24 | Within five months of each other, two Boeing 737 MAX jets crash minutes after takeoff. Three hundred forty-six people die. | Counter `346`. No imagery. Pause 3 s. | HOUSE-1 |
| N04 | 0:35 | This is the story of what each part of the system knew about MCAS, and where that knowing was held. | Title card: **Left Out of the Manual**. | none (framing) |
| N05 | 0:46 | Here is the system. The 737 MAX was the fourth generation of Boeing's 737. MCAS is software designed to push the airplane's nose down automatically in certain conditions. | Process line lower-third (5 s). Node **M, MCAS** at `[1,0]`; node **T, Stabilizer** at `[1,1]`; arc M to T `nose down`. | HOUSE-1, HOUSE-2 |
| N06 | 0:58 | The report this story draws on was produced by Democratic staff of the House Transportation Committee. We have not read Boeing's or the FAA's responses to it. | Source card, mono: `House T&I Committee · Sept 2020 · Democratic staff report`. | HOUSE-2 |
| N07 | 1:09 | It describes a Boeing directive to avoid simulator training for MAX pilots. | Mono tag on M: `goal: no new simulator training`. | HOUSE-9 |
| N08 | 1:14 | In 2015, a Boeing authorized representative raised the question of whether MCAS was vulnerable to single sensor failures. The airplane was delivered with MCAS dependent on a single angle-of-attack sensor. | Ledger line `2015`. Node **S, AOA sensor** at `[0,1]`; arc S to M `one input`. Refrain beat 1 (N08 to N09): a faint dashed ring appears at `[1,2]` (K), unlabeled. Latent arc from S toward K stops at the ring. | HOUSE-5 |
| N09 | 1:26 | Who held that question? Authorized representatives are Boeing employees who act on the FAA's behalf. A joint review panel wrote that the FAA extensively delegated compliance findings on the 737-8 to Boeing. | Node **F, FAA** at `[0,0]`; arc F to M `delegated`, thin. Mono `JATR · Joint Authorities Technical Review`. | HOUSE-2, HOUSE-4 |
| N10 | 1:39 | March 2016. Boeing's test pilots find the MAX isn't handling well near stalls at lower speeds. Boeing redesigns MCAS to activate at lower speeds. The new version can move the horizontal stabilizer up to two and a half degrees, instead of the six tenths of a degree in the original design. | Ledger line `2016-03`. Arc M to T thickens in signal blue. Mono `0.6° → 2.5°`. | HOUSE-5 |
| N11 | 2:00 | Who held the whole picture? The FAA was not completely unaware of MCAS. But the joint review panel wrote that the information was fragmented, delivered to disconnected groups, and hard to recognize for what it implied. | Refrain beat 2 (N11): arc F to M breaks into three short dashes. Latent arc F to K stops at the ring. Excerpt card (JATR via House report): `fragmented`. | HOUSE-4 |
| N12 | 2:14 | That same March, Boeing asked the FAA for permission to remove MCAS from the pilots' operating manual. It told the FAA that MCAS "only operates WAY outside of the normal operating envelope." The FAA permitted the references to be removed. | Node **L, Pilot manual** at `[2,2]`; a small mark labeled `MCAS` is erased from it. Excerpt card (Boeing email, as quoted by the House report): `only operates WAY outside of the normal operating envelope`. | HOUSE-5, HOUSE-5b |
| N13 | 2:30 | The committee also found that Boeing did not classify MCAS as safety-critical, which would have drawn more FAA scrutiny. And it says pilots were largely unaware that the system existed. | Node **P, Pilots** at `[2,1]`; arc L to P `no MCAS`; arc T to P `nose down`. Mono `not classified safety-critical`. | HOUSE-2 |
| N14 | 2:43 | August 2017. Five months after certification, Boeing finds that an alert meant to warn pilots when the plane's two angle-of-attack sensors disagree doesn't work on most of the fleet. It was tied to an optional display. Boeing files a problem report with its supplier. | Ledger line `2017-08`. Node **A, AOA Disagree alert** at `[0,2]` drawn as ghost, `inoperative on most of fleet`. Arc A to P ghost, `should warn`. Refrain beat 3 (N15): latent arc A to K stops at the ring when the question is asked. | HOUSE-6 |
| N15 | 3:00 | Who held that? Boeing did. It does not tell the FAA or its customers. According to the committee, that lasts more than fourteen months, until after the first crash. | A mono timer `14+ months` runs along the ledger from `2017-08`. | HOUSE-6, HOUSE-9 |
| N16 | 3:12 | October twenty-ninth, 2018. Lion Air flight 610 crashes into the Java Sea thirteen minutes after takeoff. All one hundred eighty-nine people aboard die. | Ledger line `2018-10-29`. Counter `189`. No imagery. Pause 3 s. | HOUSE-1 |
| N17 | 3:24 | Eight days later, Boeing issues an operations manual bulletin, and the FAA an emergency airworthiness directive. Neither mentions MCAS. On November tenth, Boeing sends airlines a message that describes it. It is not otherwise made public. | Ledger lines `2018-11-06`, `2018-11-07`, `2018-11-10`, each with its mono label. | HOUSE-9 |
| N18 | 3:39 | Boeing's CEO later told Congress the aim was to give pilots what they needed to fly, not to teach them system details. The committee said that doesn't match Boeing's own meeting minutes from 2013. | Excerpt card (CEO testimony, as paraphrased): no direct quote on screen. Source line `Oct 2019 hearing`. | HOUSE-9 |
| N19 | 3:53 | March tenth, 2019. Ethiopian Airlines flight 302 crashes six minutes after takeoff. All one hundred fifty-seven people aboard die. | Ledger line `2019-03-10`. Counter `157`. No imagery. Pause 3 s. | HOUSE-1 |
| N20 | 4:04 | The committee's report concludes the crashes were not the result of a single failure, mistake, or event. It describes faulty assumptions by Boeing's engineers, a lack of transparency from Boeing's management, and, in its words, grossly insufficient oversight by the FAA. | Source card: `House T&I Committee report, Sept 2020`. | HOUSE-2 |
| N21 | 4:20 | Follow the knowing. A test pilot found ten seconds catastrophic in 2012. A representative asked about a single sensor in 2015. The FAA saw MCAS in fragments. A broken alert went unreported for more than fourteen months. And pilots were largely unaware MCAS existed. Each fact was held somewhere. | The ledger lines light in turn, each touching its node: P, S, F, A, P. | HOUSE-2, HOUSE-4, HOUSE-5, HOUSE-6, HOUSE-9 |
| N22 | 4:40 | In the book's reading, no one held them together, or was placed to answer: what is this system doing, who has been told, and what is it for? | Latent arc P to K draws and stops; L to K likewise. Four latent arcs, none enters. The ring comes to full size. | book's argument (interpretation) |
| N23 | 4:51 | That layer has a name. The book calls it knowware. | `knowware` types beneath the ring. The ring stays empty. | book's argument |
| N24 | 4:56 | Here is the entry. Knowware, noun. One: the layer of knowing between people and machines: what the work is for, what the context is, and who answers for the result. Two: what goes missing when systems coordinate perfectly and nobody knows what they are doing. | Closing entry card on cream (frame type 6, Ep01 look spec). No animation. | DEF |
| N25 | 5:16 | Sources are linked below. The full entry is at knowware dot press slash definition. | End card, 8 seconds of silence. | DEF |

**Narration word count:** 751 words across N01 to N25.

---

## 2. Title options

1. **Left Out of the Manual** (working title; recommended)
2. **The 737 MAX: What Each Part of the System Knew About MCAS**
3. **A Simulator Test in 2012, Two Crashes in 2018 and 2019**

---

## 3. Thumbnail concept (text only, dictionary-entry style)

Navy ground. No aircraft, no wreckage.

```
ENTRY · 2016-03-30                            (JetBrains Mono, cream, small, top left)

MCAS, n.                                      (Helvetica Neue 800, cream, very large)

1. software that moves the nose down.         (Helvetica Neue 400, cream, medium)
2. removed from the manual.                   (Helvetica Neue 400, cream, medium)
   ┌ ─ ─ ─ ─ ─ ─ ─ ┐
   │   (empty)     │                          (dashed blue-tint #6BADFF box, nothing inside)
   └ ─ ─ ─ ─ ─ ─ ─ ┘
```

The thumbnail date `2016-03-30` is the date of the Boeing email quoted in the House report asking that MCAS references be removed. Confirm against the report before using.

---

## 4. Description and pinned comment

### 4a. YouTube description

```
Two Boeing 737 MAX jets crashed within five months of each other, in October 2018 and March 2019, killing 346 people. This episode follows the House Transportation and Infrastructure Committee's staff report on what each part of the system knew about the MCAS flight control software, and where that knowledge was held.

Researched with AI, checked by a human, every claim linked below.

CHAPTERS
0:00 A simulator test, 2012
0:46 The system
1:14 2015: the single sensor
1:39 2016: the redesign
2:43 2017: the alert
3:12 The first crash
3:53 The second crash
4:20 The missing layer
4:56 The entry: knowware

SOURCES
[1] U.S. House Committee on Transportation and Infrastructure, "The Design, Development & Certification of the Boeing 737 MAX," final committee report, September 2020 (produced by Democratic staff of the Committee):
https://democrats-transportation.house.gov/imo/media/doc/final_boeing_737_max_report.pdf
[2] knowware (n.), the dictionary entry: https://knowware.press/definition

Important: [1] is a staff report from one party's side of the committee. We have not read Boeing's or the FAA's responses, nor the official crash investigation reports from Indonesia and Ethiopia. Where the report quotes other documents (the JATR review, Boeing emails), the narration says so. The reading of the story as a missing "knowing" layer is the book's argument, not the committee's finding.

Knowware, by Khayyam Wakil: https://knowware.press
Errors: tell us in the comments and we will correct them in the pinned comment and the description.
```

### 4b. Pinned comment

```
Source: U.S. House Committee on Transportation and Infrastructure, final report on the Boeing 737 MAX (Sept 2020)
https://democrats-transportation.house.gov/imo/media/doc/final_boeing_737_max_report.pdf
It is a Democratic staff report. We have not read Boeing's or the FAA's responses, or the Indonesian and Ethiopian crash investigation reports. We would welcome corrections or additions from people who have.

Process: researched with AI, checked by a human, every claim linked above. A person is accountable for what this video says.

Spotted a mistake? Reply here. Corrections go in this comment.
```

---

## 5. Diagram spec

Same schema as `diagram:` in `src/content/chapters/*.md` (3 by 3 grid, one latent node at `[1,2]`). Eight nodes.

```yaml
diagram:
  title: "Left Out of the Manual"
  caption: "A sensor, a flight control function, the FAA, a manual and a warning that did not work were all connected. Nothing held what the pilots had been told."
  nodes:
    - id: "F"
      label: "FAA"
      pos: [0, 0]
    - id: "M"
      label: "MCAS"
      pos: [1, 0]
    - id: "S"
      label: "AOA\nsensor"
      pos: [0, 1]
    - id: "T"
      label: "Stabilizer"
      pos: [1, 1]
    - id: "P"
      label: "Pilots"
      pos: [2, 1]
    - id: "A"
      label: "AOA Disagree\nalert"
      pos: [0, 2]
    - id: "L"
      label: "Pilot\nmanual"
      pos: [2, 2]
    - id: "K"
      label: "knowware"
      pos: [1, 2]
      latent: true
  arcs:
    - from: "S"
      to: "M"
      label: "one input"
    - from: "M"
      to: "T"
      label: "nose down"
    - from: "T"
      to: "P"
      label: "pilots respond"
    - from: "F"
      to: "M"
      label: "delegated"
    - from: "L"
      to: "P"
      label: "no MCAS"
    - from: "A"
      to: "P"
      label: "should warn"
    - from: "S"
      to: "K"
      kind: "latent"
    - from: "F"
      to: "K"
      kind: "latent"
    - from: "A"
      to: "K"
      kind: "latent"
    - from: "L"
      to: "K"
      kind: "latent"
```

Overlay-only elements: the dated ledger down the right side, bars for 10 s and 4 s, counters, source cards. All nodes are cream and static; there is no motion on the aircraft or crash events.

### Build sequence

| Step | Line | Appears | Notes |
|---|---|---|---|
| 1 | N01 | Ledger line `2012-11`; bar `>10 s` | Overlay |
| 2 | N02 | Bar `4 s (FAA guidance)` | Overlay |
| 3 | N03 | Counter `346` | Pause 3 s; no imagery |
| 4 | N05 | Node **M** at `[1,0]`; node **T** at `[1,1]`; arc **M to T** `nose down` | |
| 5 | N06 | Source card | Overlay |
| 6 | N07 | Tag on M: `goal: no new simulator training` | Overlay |
| 7 | N08 | Ledger `2015`; node **S** at `[0,1]`; arc **S to M** `one input` | |
| 8 | N08 | Faint dashed ring at `[1,2]` (K), unlabeled; latent arc **S to K** stops at the ring | First "who held it" beat |
| 9 | N09 | Node **F** at `[0,0]`; arc **F to M** `delegated` thin | |
| 10 | N10 | Ledger `2016-03`; arc **M to T** thickens; `0.6° → 2.5°` | |
| 11 | N11 | Arc **F to M** breaks into three dashes; latent arc **F to K** stops at the ring | Second beat |
| 12 | N12 | Node **L** at `[2,2]`; `MCAS` mark erased; Boeing-email excerpt card | |
| 13 | N13 | Node **P** at `[2,1]`; arcs **L to P** `no MCAS`, **T to P** `pilots respond` | |
| 14 | N14 | Ledger `2017-08`; node **A** at `[0,2]` as ghost; arc **A to P** ghost `should warn` | |
| 15 | N14 | Latent arc **A to K** stops at the ring | Third beat |
| 16 | N15 | Timer `14+ months` along the ledger | Overlay |
| 17 | N16 | Ledger `2018-10-29`; counter `189` | Pause 3 s |
| 18 | N17 | Ledger lines `2018-11-06`, `-07`, `-10` | Overlay |
| 19 | N18 | Source line `Oct 2019 hearing` | Overlay |
| 20 | N19 | Ledger `2019-03-10`; counter `157` | Pause 3 s |
| 21 | N20 | Source card | Overlay |
| 22 | N21 | Ledger lines light in turn, touching P, S, F, A, P | Overlay |
| 23 | N22 | Latent arc **L to K** draws and stops; ring grows to full size | Four latent arcs total (S, F, A, L); none enters |
| 24 | N23 | `knowware` types; ring stays empty | |
| 25 | N24 | Cut to dictionary-entry card on cream | |

---

## 6. Accuracy checklist

**Method.** The House report ("The Design, Development & Certification of the Boeing 737 MAX", September 2020) was downloaded as a PDF from https://democrats-transportation.house.gov/imo/media/doc/final_boeing_737_max_report.pdf on 2026-10-16, converted to text and searched. Locators are the report's chapter headings: HOUSE-1 Introduction; HOUSE-2 Executive Summary; HOUSE-4 FAA Oversight and Delegation; HOUSE-5 MCAS chapter (5b: the footnotes on the manual removal); HOUSE-6 AOA Disagree Alert chapter; HOUSE-9 Post-Accident Response chapter. Page numbers are not given because the PDF text did not preserve them reliably. The JATR passages are quoted in the House report; I have **not** read the JATR report itself. "Confirmed" means I found the claim in the House report; no human has verified it yet.

| ID | Narration sentence | Source | Supporting passage (locator + fragment) | Status |
|---|---|---|---|---|
| N01.1 | November 2012. A Boeing test pilot sits in a flight simulator. | HOUSE-9 | "In November 2012...it took a Boeing test pilot more than 10 seconds to respond to uncommanded MCAS activation during a flight simulator test" | confirmed |
| N01.2 | A flight control function called MCAS activates without a command. It takes him more than ten seconds to respond. | HOUSE-9, HOUSE-6 | as N01.1; Executive Summary: "more than 10 seconds to diagnose and respond to uncommanded MCAS activation in a flight simulator" | confirmed |
| N01.3 | He calls the condition catastrophic. | HOUSE-9 | "a condition the pilot found to be 'catastrophic'" | confirmed (1-word quote, attributed in the report to the pilot) |
| N02.1 | The FAA's guidance says pilots should be able to respond to a condition like that within four seconds. | HOUSE-9 | "The FAA has provided guidance that pilots should be able to respond to this condition within four seconds" | confirmed |
| N03.1 | Within five months of each other, two Boeing 737 MAX jets crash minutes after takeoff. | HOUSE-1 | "346 people killed in two separate crashes within five months of each other"; Lion Air "13 minutes after takeoff"; Ethiopian "six minutes after takeoff" | confirmed |
| N03.2 | Three hundred forty-six people die. | HOUSE-1 | "the tragic deaths of 346 people killed in two separate crashes" | confirmed. The report adds one rescue diver who died during recovery, not included in the 346 |
| N04.1 | This is the story of what each part of the system knew about MCAS, and where that knowing was held. | none | Framing, no factual claim | n/a |
| N05.1 | The 737 MAX was the fourth generation of Boeing's 737. | HOUSE-1 | "The MAX is the 4th generation 737 model airplane" | confirmed |
| N05.2 | MCAS is software designed to push the airplane's nose down automatically in certain conditions. | HOUSE-2 | "MCAS—software designed to automatically push the airplane's nose down in certain conditions" | confirmed |
| N06.1 | The report this story draws on was produced by Democratic staff of the House Transportation Committee. | HOUSE-2 | "This report was produced by Democratic staff of the Committee" | confirmed |
| N06.2 | We have not read Boeing's or the FAA's responses to it. | none | A statement about our own research; true as of 2026-10-16 | confirmed (by me, as a statement of what I read) |
| N07.1 | It describes a Boeing directive to avoid simulator training for MAX pilots. | HOUSE-9 | "one technology that could have affected Boeing's directive to avoid simulator training" | confirmed. Wording now matches the report ("new" removed) |
| N08.1 | In 2015, a Boeing authorized representative raised the question of whether MCAS was vulnerable to single sensor failures. | HOUSE-5 | "In 2015, a Boeing AR raised the question of whether MCAS was 'vulnerable to single AOA sensor failures'" | confirmed |
| N08.2 | The airplane was delivered with MCAS dependent on a single angle-of-attack sensor. | HOUSE-5 | "Despite this, the aircraft was delivered with MCAS dependent on a single AOA sensor" | confirmed |
| N09.1 | Who held that question? | none | Framing question; answered by N09.2 and N09.3 | n/a |
| N09.2 | Authorized representatives are Boeing employees who act on the FAA's behalf. | HOUSE-2 | "Boeing Authorized Representatives (ARs)—Boeing employees who are granted special permission to represent the interests of the FAA and to act on the agency's behalf" | confirmed |
| N09.3 | A joint review panel wrote that the FAA extensively delegated compliance findings on the 737-8 to Boeing. | HOUSE-4 | JATR, as quoted in the House report: "The FAA extensively delegated compliance findings on the B737-8 MAX project to the Boeing ODA"; JATR = Joint Authorities Technical Review | confirmed as quoted in the House report; JATR itself not read. "Later" removed because the passage does not date the JATR report |
| N10.1 | March 2016. Boeing's test pilots find the MAX isn't handling well near stalls at lower speeds. | HOUSE-5 | "in March 2016...when Boeing test pilots found the MAX was not handling well when nearing stalls at lower speeds" | confirmed |
| N10.2 | Boeing redesigns MCAS to activate at lower speeds. | HOUSE-5 | "Boeing redesigned MCAS to enable it to activate at lower speeds" | confirmed |
| N10.3 | The new version can move the horizontal stabilizer up to two and a half degrees, instead of the six tenths of a degree in the original design. | HOUSE-5 | "capable of moving the horizontal stabilizer a maximum of 2.5 degrees (as opposed to 0.6 degrees as originally designed)" | confirmed |
| N11.1 | Who held the whole picture? | none | Framing question; answered by N11.2 and N11.3 | n/a |
| N11.2 | The FAA was not completely unaware of MCAS. | HOUSE-4 | JATR, as quoted: "The FAA was not completely unaware of MCAS" | confirmed as quoted |
| N11.3 | But the joint review panel wrote that the information was fragmented, delivered to disconnected groups, and hard to recognize for what it implied. | HOUSE-4 | JATR, as quoted: "the information and discussions about MCAS were so fragmented and were delivered to disconnected groups within the process, it was difficult to recognize the impacts and implications of this system" | confirmed as quoted in the House report; JATR itself not read |
| N12.1 | That same March, Boeing asked the FAA for permission to remove MCAS from the pilots' operating manual. | HOUSE-5b | "in March of 2016, Boeing requested permission from the FAA to remove MCAS from the Flight Crew Operations Training Manual (FCOM)" | confirmed. The report names the "Flight Crew Operations Training Manual (FCOM)"; the narration says "pilots' operating manual" |
| N12.2 | It told the FAA that MCAS "only operates WAY outside of the normal operating envelope." | HOUSE-5b | "telling the FAA that MCAS, 'only operates WAY outside of the normal operating envelope'" | confirmed (9-word quote, from a Boeing email as quoted by the report) |
| N12.3 | The FAA permitted the references to be removed. | HOUSE-5 | "The FAA ultimately permitted Boeing to remove references to MCAS" | confirmed |
| N13.1 | The committee also found that Boeing did not classify MCAS as safety-critical, which would have drawn more FAA scrutiny. | HOUSE-2 | "Boeing also failed to classify MCAS as a safety-critical system, which would have attracted greater FAA scrutiny" | confirmed |
| N13.2 | And it says pilots were largely unaware that the system existed. | HOUSE-2 | "pilots, who were largely unaware that the system existed" | confirmed |
| N14.1 | August 2017. Five months after certification, Boeing finds that an alert meant to warn pilots when the plane's two angle-of-attack sensors disagree doesn't work on most of the fleet. | HOUSE-6 | "In August 2017, five months after the 737 MAX was certified by the FAA...Boeing issued a problem report...AOA Disagree alert...not functioning on the vast majority of the 737 MAX fleet"; alert purpose: "to notify the crew if the aircraft's two AOA sensor readings disagree" | confirmed |
| N14.2 | It was tied to an optional display. | HOUSE-6 | "tied to the optional AOA Indicator" | confirmed |
| N14.3 | Boeing files a problem report with its supplier. | HOUSE-6 | "Boeing issued a problem report to its supplier" | confirmed |
| N15.1 | Who held that? Boeing did. | HOUSE-6, HOUSE-9 | Framing question; answered by N15.2. The report describes Boeing's own problem report in August 2017 (N14.3) | confirmed (framing of N14.3 and N15.2) |
| N15.2 | It does not tell the FAA or its customers. According to the committee, that lasts more than fourteen months, until after the first crash. | HOUSE-9 | "Boeing...had also decided not to inform the FAA or its customers about the non-functioning alert for more than 14 months – until after the Lion Air crash" | confirmed |
| N16.1 | October twenty-ninth, 2018. Lion Air flight 610 crashes into the Java Sea thirteen minutes after takeoff. All one hundred eighty-nine people aboard die. | HOUSE-1 | "On October 29, 2018, Lion Air flight 610...crashed into the Java Sea 13 minutes after takeoff, killing all 189 passengers and crew" | confirmed |
| N17.1 | Eight days later, Boeing issues an operations manual bulletin, and the FAA an emergency airworthiness directive. Neither mentions MCAS. | HOUSE-9 | "On November 6, 2018, Boeing issued an Operations Manual Bulletin...did not mention MCAS...The next day FAA issued an Emergency Airworthiness Directive...did not mention MCAS" | confirmed. The bulletin is eight days after October 29 (the AD is nine); the narration says "eight days later" for the first |
| N17.2 | On November tenth, Boeing sends airlines a message that describes it. It is not otherwise made public. | HOUSE-9 | "Boeing...described MCAS in a Multi Operator Message (MOM), on November 10, 2018, that went to Boeing's MAX customers but was not otherwise made public" | confirmed |
| N18.1 | Boeing's CEO later told Congress the aim was to give pilots what they needed to fly, not to teach them system details. | HOUSE-9 | "Dennis Muilenburg, then-CEO...'[T]he intent was to provide the training materials that the pilots would need to fly the airplane, rather than try to educate them on the system details'" | confirmed (paraphrase of testimony quoted in the report; October 2019 hearing) |
| N18.2 | The committee said that doesn't match Boeing's own meeting minutes from 2013. | HOUSE-9 | "That explanation, however, does not comport with the rationale provided in the June 2013 meeting minutes for not referencing MCAS externally" | confirmed |
| N19.1 | March tenth, 2019. Ethiopian Airlines flight 302 crashes six minutes after takeoff. All one hundred fifty-seven people aboard die. | HOUSE-1 | "on March 10, 2019...Ethiopian Airlines flight 302 crashed six minutes after takeoff...killing all 157 passengers and crew" | confirmed |
| N20.1 | The committee's report concludes the crashes were not the result of a single failure, mistake, or event. | HOUSE-2 | "The MAX crashes were not the result of a singular failure, technical mistake, or mismanaged event" | confirmed (paraphrase) |
| N20.2 | It describes faulty assumptions by Boeing's engineers, a lack of transparency from Boeing's management, and, in its words, grossly insufficient oversight by the FAA. | HOUSE-2 | "a series of faulty technical assumptions by Boeing's engineers, a lack of transparency on the part of Boeing's management, and grossly insufficient oversight by the FAA" | confirmed |
| N21.1 | A test pilot found ten seconds catastrophic in 2012. | HOUSE-9 | as N01 | confirmed |
| N21.2 | A representative asked about a single sensor in 2015. | HOUSE-5 | as N08.1 | confirmed |
| N21.3 | The FAA saw MCAS in fragments. | HOUSE-4 | as N11.3 | confirmed as quoted |
| N21.4 | A broken alert went unreported for more than fourteen months. | HOUSE-9 | as N15.1 | confirmed |
| N21.5 | And pilots were largely unaware MCAS existed. Each fact was held somewhere. | HOUSE-2 | as N13.2; the last sentence is the narration's framing | confirmed (first); framing (second) |
| N22.1 | In the book's reading, no one held them together, or was placed to answer: what is this system doing, who has been told, and what is it for? | book | Interpretation, labeled as the book's reading | interpretation, not a factual claim |
| N23.1 | That layer has a name. The book calls it knowware. | DEF | https://knowware.press/definition, "The third body" | confirmed |
| N24.1 | Knowware, noun. One: ... Two: ... | DEF | Live https://knowware.press/definition, read verbatim 2026-10-16 | confirmed |
| N25.1 | The full entry is at knowware dot press slash definition. | DEF | Page is live | confirmed |

---

## 7. Flags and cuts

- **F1. One source, one party.** The episode rests on a single document, a Democratic staff report. It is detailed and quotes primary documents, but it is not neutral and it is not the official crash investigation. The narration says so (N06). Before publishing, the author should consider reading the Indonesian KNKT and Ethiopian ECAA final reports and the JATR report, and Boeing's and the FAA's responses, and either adding them to the checklist or softening claims that only the House report supports.
- **F2. Two quotes via the House report.** The JATR passages (N09, N11) and the Boeing email (N12) are quoted inside the House report; I did not read the originals.
- **F3 (resolved). N07 "new simulator training".** "New" removed to match the report's phrase.
- **F4 (resolved). N11 "not unaware".** Now "not completely unaware", matching the quoted JATR wording.
- **F5 (resolved). N09 "later".** Removed; the passage does not date the JATR report.
- **F6 (resolved). N17 "about a week".** Now "Eight days later" (the bulletin; the AD followed the next day).
- **F7. The 2012 simulator test.** The report places it in November 2012, at which point MCAS in this form may not yet have existed in the same design (the redesign is dated March 2016). The report itself describes it as "uncommanded MCAS activation" in 2012; the narration follows the report. If the author wants to be careful, say "a Boeing test pilot, according to the report".
- **F8. The thumbnail date `2016-03-30`.** It is the date of the quoted email; I read it from a footnote ("Sent: Wednesday, March 30, 2016"). Confirm before use.
- **C1. Cut:** Boeing employees' names and internal messages that characterize the airplane or colleagues; the committee's words "deceived" and "concealed"; any claim about what happened inside either cockpit (the report does not need it for this story).
- **Not verified:** no human source check; time codes are word-count estimates; not read aloud.

---

## 8. Human review log

- [ ] Author source check: open the House report PDF and tick each checklist row.
- [ ] Author decision on F1: whether to add the KNKT, ECAA and JATR reports as sources before publishing.
- [ ] Author listening pass.
- [ ] Author decision on F3 to F8 wording.
