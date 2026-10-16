# Episode 03: 5.6 Seconds

**Channel:** faceless causal explainers of real systems that failed because nobody held the knowing. Look spec, palette, type and motion rules: see `ep01-the-first-message-was-a-question.md`, section 0a (locked 2026-10-16). This file repeats only what differs.
**System:** Uber ATG's developmental automated driving system and its vehicle operator, Tempe, Arizona, March 18, 2018.
**Status:** DRAFT. Not published, not pushed. "Confirmed" means confirmed by me against the NTSB report text on 2026-10-16. No human has source-checked it yet (section 8).
**Target length:** about 5:28 including pauses and the 8-second end card (746 words of narration at 155 words per minute, plus about 26 seconds of deliberate silence, including the end card).
**Rhythm spine:** the countdown. Slowest of the first four episodes: long holds, short sentences, silence after the hardest facts. A visible `5.6` runs down to `0.0` once, in the first third, then does not return.
**Structure experiment (2026-10-16):** the closing turn ("in the book's reading") was moved from about 82% of the runtime to about 60%, so the last third is the NTSB's findings about oversight, the contributing factors, and what changed after the crash, ending on the name and the entry. See `rhythm-notes.md`, section 7.

---

## 0. Production notes

- **Narrator:** human voice only. No AI voice, no cloning. Read it slowly and plainly. A person died. No music, no sound design, no reconstruction of the crash.
- **Process line, once on screen** at N05: *"Researched with AI, checked by a human, every claim linked below."* Do not publish with it until the human source check in section 8 is ticked.
- **No reconstruction, no footage.** Do not show the dashcam video, the vehicle, or any depiction of the victim. The frames are the diagram and cards only.
- **The victim.** The NTSB report does not name her (it says "the pedestrian", a 49-year-old woman). The narration says "a woman" and does not name her. If the author wishes to name her, add a source for the name (the Tempe Police Department or Maricopa County Attorney records) to section 6 first.
- **Fairness.** The probable cause names the operator's distraction, and the narration states it in the NTSB's words (N12) alongside the organizational findings (N13 and N16) and the pedestrian's and the state's contributing factors (N17). Do not cut N12 or N17 for time.
- **Not said:** nothing about the pedestrian's toxicology or history; nothing about the operator beyond the NTSB's findings; no claim about the later criminal case.

---

## 1. Script

| Line | Time | Narration | On screen | Source key |
|---|---|---|---|---|
| N01 | 0:00 | March eighteenth, 2018. Tempe, Arizona. Nine fifty-eight at night. | Navy. Mono `2018-03-18 21:58` types in. Silence under it. | NTSB-SUM |
| N02 | 0:07 | A woman is walking her bicycle across North Mill Avenue, where there is no crosswalk. A test vehicle is approaching at forty-five miles an hour. Its computer detects her 5.6 seconds before impact. | Large mono `5.6` in cream counts down smoothly toward `0.0` over the next two lines. Node **A, Automated driving system** at `[0,1]`. | NTSB-SUM |
| N03 | 0:20 | It never correctly classifies her as a pedestrian. It never correctly predicts her path. | Countdown continues. Label on A: `never: pedestrian`. Pause 3 s after the line. | NTSB-SUM |
| N04 | 0:29 | This is the story of those 5.6 seconds, and of who was able to use them. | Title card: **5.6 Seconds**. The counter has reached `0.0`; it fades and does not return. | none (framing) |
| N05 | 0:39 | The vehicle is a modified Volvo SUV, operated by Uber's Advanced Technologies Group. Uber's own self-driving software is in control, and has been for about nineteen minutes. One person sits in the driver's seat: the vehicle operator. | Process line lower-third (5 s). Node **P, Operator** at `[1,0]`. Arc A to P is absent; label under P `driver's seat`. Mono `19 min autonomous`. | NTSB-SUM |
| N06 | 0:54 | Here is what the software does with those seconds. It first classifies her as a vehicle. Later, it also classifies her as an unknown object, and as a bicyclist. | Three mono tags appear at A in sequence: `vehicle`, `unknown object`, `bicyclist`. | NTSB-SUM, NTSB-1.5 |
| N07 | 1:06 | Each time its classification of her changes, the system stops using the record of where she has been when it predicts where she is going. | A faint trail of dots behind a small mark; at each tag change the trail erases. Pause 2 s. | NTSB-1.5 |
| N08 | 1:18 | Who can act on what it sees? Not the brakes. In Uber's design, when the system detects an emergency, it holds back braking for one second while it checks the hazard. It gives the operator no alert during that second. Uber ATG said it did this because it was worried about false alarms. | Node **B, Brakes** at `[2,1]`. Arc A to B drawn and stopped by a short bar labeled `1 s hold`. Mono `no alert to operator`. A latent arc from A toward the empty ring begins and stops at it. The empty node K appears faintly at `[1,2]`, unlabeled. | NTSB-1.5 |
| N09 | 1:39 | At 1.2 seconds before impact, the system determines a collision is imminent. By then the situation is beyond what its braking can do, and its design leaves it to the operator to intervene. The design does not allow emergency braking for crash mitigation alone. | Mono `T-1.2 s` marker on a thin horizontal timeline strip. Arc A to P draws, labeled `relies on`, in signal blue. Pause 3 s. | NTSB-SUM |
| N10 | 2:00 | Not the car's own safety systems, either. When Uber's software is engaged, the Volvo's built-in collision warning and automatic emergency braking are switched off. Both companies viewed running them together as incompatible. | Node **V, Volvo safety systems** at `[2,0]` drawn as ghost, with `off while ADS engaged`. Mono lines: `same radar frequencies`, `brake module: no priority`. | NTSB-1.6 |
| N11 | 2:13 | Who else? The operator. Video from inside the car shows her looking toward the bottom of the center console, where she had placed her phone. She looks back at the road about one second before impact. | Node P brightens. Mono `looks up: T-1 s` on the timeline strip. No video, no imagery of the operator. | NTSB-SUM |
| N12 | 2:28 | The NTSB's probable cause is the operator's failure to monitor the driving environment and the system. The report says she was visually distracted throughout the trip by her personal cell phone. It found that an attentive operator would likely have had enough time to detect the pedestrian and react. | Excerpt card (NTSB excerpt, under 15 words): `visually distracted throughout the trip`. Source line `NTSB/HAR-19/03`. | NTSB-PC, NTSB-FIND |
| N13 | 2:49 | But the board goes further. It names three failings at Uber: inadequate safety risk assessment, ineffective oversight of operators, and no adequate way to address automation complacency. Automation complacency is attention drifting away from a system that usually works. The board says all three were a consequence of an inadequate safety culture. | Node **U, Uber ATG oversight** at `[0,0]`, drawn as a dashed outline. Three mono tags in sequence beside it: `risk assessment`, `operator oversight`, `complacency`. | NTSB-PC |
| N14 | 3:10 | Now look at where the knowing sat. The system saw her, and lost the record of where she had been each time it changed its mind. The design expected false alarms, and answered with a pause and no alert. The operator was left the last move. And, the NTSB found, Uber had little in place to check whether operators were watching. | Four callouts, each touching its node in turn: A, B, P, U. | NTSB-1.5, NTSB-FIND |
| N15 | 3:34 | In the book's reading, each piece of the knowing was held by something that could not act on it, or by someone not placed to look. No one held all of it. And no one was placed to ask whether the person at the wheel could. | Latent arcs from B, P and U to K draw and stop at the ring; with A's earlier stub, four latent arcs, none enters. The ring comes to full size and stays on screen to the end. | book's argument (interpretation) |
| N16 | 3:52 | Here is what the NTSB found about that oversight. Uber had removed a second vehicle operator from its test cars. The NTSB says that raised the demands on the sole operator and removed a safety redundancy. And although Uber could review how operators behaved, it rarely did. | A second operator mark at P fades out. Mono `2 operators to 1`, `retroactive review: rarely`. Arc U to P drawn dashed and thin, labeled `rarely`. | NTSB-FIND |
| N17 | 4:11 | The NTSB also lists, as contributing factors, the pedestrian's crossing outside a crosswalk, and Arizona's insufficient oversight of automated vehicle testing. | Two plain mono lines. Node **S, State oversight** at `[2,2]` drawn as a dashed outline. No emphasis, no glow. | NTSB-PC |
| N18 | 4:20 | After the crash, Uber added a second operator and real-time monitoring of operator attentiveness. It also made the Volvo's own collision warning and braking available while the software drives. The NTSB says these changes begin to address the problems that contributed to the crash. | V changes from ghost to cream. P gains a second mark. Mono `after: second operator`, `after: attentiveness monitor`. | NTSB-FIND |
| N19 | 4:38 | In the book's terms, those changes put pieces of the missing layer back: a second person, a check on the operator, and the car's own collision warning and braking. | Three small cream marks attach to nodes P and V in turn: `second operator`, `attentiveness monitor`, `Volvo braking on`. They sit at the nodes, never inside the ring. The ring stays empty. | NTSB-FIND, book's argument (interpretation) |
| N20 | 4:49 | That layer has a name. The book calls it knowware. | `knowware` types beneath the ring. The ring stays empty. | book's argument |
| N21 | 4:54 | Here is the entry. Knowware, noun. One: the layer of knowing between people and machines: what the work is for, what the context is, and who answers for the result. Two: what goes missing when systems coordinate perfectly and nobody knows what they are doing. | Closing entry card on cream (frame type 6, Ep01 look spec). No animation. | DEF |
| N22 | 5:14 | Sources are linked below. The full entry is at knowware dot press slash definition. | End card, 8 seconds of silence. | DEF |

**Narration word count:** 746 words across N01 to N22.

---

## 2. Title options

1. **5.6 Seconds** (working title; recommended)
2. **What the Self-Driving System Saw: The Tempe Crash, From the NTSB Report**
3. **A Computer Saw Her 5.6 Seconds Before Impact. Then What?**

Note: no title uses the victim's name or the word "killer".

---

## 3. Thumbnail concept (text only, dictionary-entry style)

Navy ground. No imagery of a vehicle, a road or a person.

```
ENTRY · 2018-03-18                            (JetBrains Mono, cream, small, top left)

5.6 seconds, n.                               (Helvetica Neue 800, cream, very large)

1. how long the system could see her.         (Helvetica Neue 400, cream, medium)
2. who was able to use it.                    (Helvetica Neue 400, cream, medium)
   ┌ ─ ─ ─ ─ ─ ─ ─ ┐
   │   (empty)     │                          (dashed blue-tint #6BADFF box, nothing inside)
   └ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## 4. Description and pinned comment

### 4a. YouTube description

```
On March 18, 2018, an Uber test vehicle driven by its automated driving system struck and killed a woman crossing a road in Tempe, Arizona. The system detected her 5.6 seconds before impact. This episode follows the NTSB's report on what the system, its design, the vehicle operator and the company each could do in those seconds.

Researched with AI, checked by a human, every claim linked below.

CHAPTERS
0:00 The night
0:39 The vehicle
0:54 What the system saw
1:18 Who could act
2:28 The NTSB's findings
3:10 The missing layer
3:52 What the NTSB found about oversight
4:20 After the crash
4:54 The entry: knowware

SOURCES
[1] NTSB, Highway Accident Report NTSB/HAR-19/03, Collision Between Vehicle Controlled by Developmental Automated Driving System and Pedestrian, Tempe, Arizona, March 18, 2018 (adopted November 19, 2019):
https://ntsb.gov/investigations/accidentreports/reports/har1903.pdf
[2] knowware (n.), the dictionary entry: https://knowware.press/definition

Every factual claim comes from [1]. The reading of the story as a missing "knowing" layer is the book's argument, not an NTSB finding. We do not name the victim because the NTSB report does not; she was a 49-year-old woman who died in the crash.

Knowware, by Khayyam Wakil: https://knowware.press
Errors: tell us in the comments and we will correct them in the pinned comment and the description.
```

### 4b. Pinned comment

```
Source: NTSB Highway Accident Report NTSB/HAR-19/03 (adopted Nov 19, 2019)
https://ntsb.gov/investigations/accidentreports/reports/har1903.pdf
Section locators for each claim are in our accuracy checklist, available on request.

Process: researched with AI, checked by a human, every claim linked above. A person is accountable for what this video says.

The NTSB's probable cause is the operator's failure to monitor, with Uber ATG's organizational failings and other factors contributing. We tried to state all of them.

Spotted a mistake? Reply here. Corrections go in this comment.
```

---

## 5. Diagram spec

Same schema as `diagram:` in `src/content/chapters/*.md` (3 by 3 grid, one latent node at `[1,2]`). Seven nodes; `[0,1]` through `[2,2]` partly used.

```yaml
diagram:
  title: "5.6 Seconds"
  caption: "The system saw her, the design held back the brakes, the operator was left the last move, and no one was placed to ask whether the operator could."
  nodes:
    - id: "U"
      label: "Uber ATG\noversight"
      pos: [0, 0]
    - id: "P"
      label: "Operator"
      pos: [1, 0]
    - id: "V"
      label: "Volvo safety\nsystems"
      pos: [2, 0]
    - id: "A"
      label: "Automated\ndriving system"
      pos: [0, 1]
    - id: "B"
      label: "Brakes"
      pos: [2, 1]
    - id: "S"
      label: "State\noversight"
      pos: [2, 2]
    - id: "K"
      label: "knowware"
      pos: [1, 2]
      latent: true
  arcs:
    - from: "A"
      to: "B"
      label: "1 s hold"
    - from: "A"
      to: "P"
      label: "relies on"
    - from: "U"
      to: "P"
      label: "rarely checks"
    - from: "A"
      to: "K"
      kind: "latent"
    - from: "B"
      to: "K"
      kind: "latent"
    - from: "P"
      to: "K"
      kind: "latent"
    - from: "U"
      to: "K"
      kind: "latent"
```

Overlay-only elements: the `5.6` countdown, the horizontal timeline strip with `T-1.2 s` and `T-1 s`, classification tags, the trail of dots, excerpt cards.

### Build sequence

| Step | Line | Appears | Notes |
|---|---|---|---|
| 1 | N01 | Mono date and time | Silence |
| 2 | N02 | `5.6` countdown; node **A** at `[0,1]` | Countdown runs through N03 |
| 3 | N03 | Label `never: pedestrian` on A | Pause 3 s |
| 4 | N04 | Title card; countdown ends | Counter does not return |
| 5 | N05 | Node **P** at `[1,0]`; `19 min autonomous` | |
| 6 | N06 | Tags `vehicle`, `unknown object`, `bicyclist` at A | Overlay |
| 7 | N07 | Trail of dots erasing at each tag change | Overlay; pause 2 s |
| 8 | N08 | Node **B** at `[2,1]`; arc **A to B** with `1 s hold` bar | |
| 9 | N08 | Faint dashed ring at `[1,2]` (K), unlabeled; latent arc **A to K** stops at the ring | First beat; ring on screen from here |
| 10 | N09 | Timeline strip `T-1.2 s`; arc **A to P** `relies on` | Pause 3 s |
| 11 | N10 | Node **V** at `[2,0]` as ghost | Overlay lines |
| 12 | N11 | Node **P** brightens; `T-1 s` marker | No imagery of the operator |
| 13 | N12 | Excerpt card | Overlay |
| 14 | N13 | Node **U** at `[0,0]` as dashed outline; three tags | |
| 15 | N14 | Callouts touch A, B, P, U in turn | **Turn begins, about 60% of runtime** |
| 16 | N15 | Latent arcs **B to K**, **P to K**, **U to K** draw and stop at the ring; ring grows to full size | Four latent arcs total; none enters; ring stays on screen to the end |
| 17 | N16 | Second operator mark at P fades; arc **U to P** `rarely checks` dashed | Aftermath begins |
| 18 | N17 | Node **S** at `[2,2]` as dashed outline | No emphasis, no glow |
| 19 | N18 | **V** to cream; **P** second mark | Post-crash changes |
| 20 | N19 | Three small marks attach to P and V | Never inside the ring |
| 21 | N20 | `knowware` types beneath the ring; ring stays empty | |
| 22 | N21 | Cut to the dictionary-entry card on cream | |
---

## 6. Accuracy checklist

**Method.** The NTSB report (NTSB/HAR-19/03, adopted November 19, 2019) was downloaded from https://ntsb.gov/investigations/accidentreports/reports/har1903.pdf on 2026-10-16, converted to text and searched. Locators: SUM = Executive Summary (Crash Summary), PC = Probable Cause (p. v), FIND = Findings (pp. vi to vii), 1.5 = the automated driving system description, 1.6 = vehicle/Volvo ADAS section. Fragments are short quotes or close paraphrases. "Confirmed" means I found the claim there; no human has verified it yet.

| ID | Narration sentence | Source | Supporting passage (locator + fragment) | Status |
|---|---|---|---|---|
| N01.1 | March eighteenth, 2018. Tempe, Arizona. Nine fifty-eight at night. | NTSB-SUM | "On March 18, 2018, at 9:58 p.m....Tempe, Arizona" | confirmed |
| N02.1 | A woman is walking her bicycle across North Mill Avenue, where there is no crosswalk. | NTSB-SUM | "a female pedestrian walking across the northbound lanes of N. Mill Avenue"; "pushing a bicycle"; "no crosswalk" | confirmed |
| N02.2 | A test vehicle is approaching at forty-five miles an hour. | NTSB-SUM | "approached the collision site...at a speed of 45 mph, as recorded by the ADS" | confirmed |
| N02.3 | Its computer detects her 5.6 seconds before impact. | NTSB-SUM | "The ADS detected the pedestrian 5.6 seconds before impact" | confirmed |
| N03.1 | It never correctly classifies her as a pedestrian. It never correctly predicts her path. | NTSB-SUM | "never accurately classified her as a pedestrian or predicted her path" (summary); 1.5: "did not correctly predict her path" | confirmed |
| N04.1 | This is the story of those 5.6 seconds, and of who was able to use them. | none | Framing, no factual claim | n/a |
| N05.1 | The vehicle is a modified Volvo SUV, operated by Uber's Advanced Technologies Group. | NTSB-SUM | "modified 2017 Volvo XC90 sport utility vehicle...operated by the Advanced Technologies Group of Uber Technologies" | confirmed |
| N05.2 | Uber's own self-driving software is in control, and has been for about nineteen minutes. | NTSB-SUM | "proprietary developmental automated driving system...operating about 19 minutes in autonomous mode" | confirmed |
| N05.3 | One person sits in the driver's seat: the vehicle operator. | NTSB-SUM | "A female operator occupied the driver's seat" | confirmed |
| N06.1 | Here is what the software does with those seconds. It first classifies her as a vehicle. | NTSB-SUM, NTSB-1.5 | "It initially classified the pedestrian as a vehicle" | confirmed |
| N06.2 | Later, it also classifies her as an unknown object, and as a bicyclist. | NTSB-1.5 | "subsequently also as an unknown object and a bicyclist" | confirmed. The report's wording is "subsequently also"; the order of the last two is not stated, so the narration does not give one |
| N07.1 | Each time its classification of her changes, the system stops using the record of where she has been when it predicts where she is going. | NTSB-1.5 | "If the perception process changed the classification of a detected object, it no longer considered the tracking history of that object when generating a new trajectory" | confirmed |
| N08.1 | Who can act on what it sees? Not the brakes. | none | Framing question; answered by N08.2 to N08.4 | n/a |
| N08.2 | In Uber's design, when the system detects an emergency, it holds back braking for one second while it checks the hazard. | NTSB-1.5 | "When the system detected an emergency situation, it initiated action suppression. That was a 1-second period during which the ADS would suppress braking while (1) the system verified the nature of the detected hazard" | confirmed |
| N08.3 | It gives the operator no alert during that second. | NTSB-1.5 | "No alert was given to the operator when action suppression was initiated" | confirmed |
| N08.4 | Uber ATG said it did this because it was worried about false alarms. | NTSB-1.5 | "ATG stated that it implemented action suppression because of concerns about false alarms" | confirmed |
| N09.1 | At 1.2 seconds before impact, the system determines a collision is imminent. | NTSB-SUM | "By the time the system determined that a collision was imminent...1.2 seconds before impact" | confirmed. The report's summary box says the system "detected" at 5.6 s and "determined" at 1.2 s; the narration follows that wording |
| N09.2 | By then the situation is beyond what its braking can do, and its design leaves it to the operator to intervene. | NTSB-SUM | "exceeded the response specifications of the ADS braking system...the design of the system relied on the vehicle operator to take control" | confirmed |
| N09.3 | The design does not allow emergency braking for crash mitigation alone. | NTSB-SUM | "the design of the ATG ADS precluded emergency braking for crash mitigation alone" | confirmed |
| N10.1 | Not the car's own safety systems, either. When Uber's software is engaged, the Volvo's built-in collision warning and automatic emergency braking are switched off. | NTSB-1.6 | "Because ATG disengaged the Volvo ADASs during ATG ADS operation, the Volvo ADASs were not active"; ADAS defined as FCW and AEB | confirmed |
| N10.2 | Both companies viewed running them together as incompatible. | NTSB-1.6 | "According to both Volvo and ATG, simultaneous operation...was viewed as incompatible" | confirmed. The two stated reasons (same radar frequencies; brake module could not prioritize two braking commands) appear on screen as mono lines |
| N11.1 | Who else? The operator. | none | Framing question; answered by N11.2 | n/a |
| N11.2 | Video from inside the car shows her looking toward the bottom of the center console, where she had placed her phone. | NTSB-SUM | "she was looking toward the bottom of the SUV's center console, where she had placed her cell phone at the start of the trip" | confirmed |
| N11.3 | She looks back at the road about one second before impact. | NTSB-SUM | "The operator redirected her gaze to the road ahead about 1 second before impact" | confirmed |
| N12.1 | The NTSB's probable cause is the operator's failure to monitor the driving environment and the system. | NTSB-PC | "the failure of the vehicle operator to monitor the driving environment and the operation of the automated driving system" | confirmed |
| N12.2 | The report says she was visually distracted throughout the trip by her personal cell phone. | NTSB-PC | "because she was visually distracted throughout the trip by her personal cell phone" | confirmed |
| N12.3 | It found that an attentive operator would likely have had enough time to detect the pedestrian and react. | NTSB-FIND | "Had the vehicle operator been attentive, she would likely have had sufficient time to detect and react to the crossing pedestrian to avoid the crash or mitigate the impact" | confirmed |
| N13.1 | But the board goes further. It names three failings at Uber: inadequate safety risk assessment, ineffective oversight of operators, and no adequate way to address automation complacency. | NTSB-PC | "Contributing to the crash were the Uber Advanced Technologies Group's (1) inadequate safety risk assessment procedures, (2) ineffective oversight of vehicle operators, and (3) lack of adequate mechanisms for addressing operators' automation complacency" | confirmed |
| N13.2 | Automation complacency is attention drifting away from a system that usually works. | none | A plain-language gloss added by the narration, not a quote. The report treats "automation complacency" as the cause of the operator's prolonged distraction ("a typical effect of automation complacency") | gloss, not a source claim |
| N13.3 | The board says all three were a consequence of an inadequate safety culture. | NTSB-PC | "all a consequence of its inadequate safety culture" | confirmed |
| N14.1 | The system saw her, and lost the record of where she had been each time it changed its mind. | NTSB-SUM, NTSB-1.5 | as N02.3 and N07.1 | confirmed |
| N14.2 | The design expected false alarms, and answered with a pause and no alert. | NTSB-1.5 | as N08.2 to N08.4 | confirmed |
| N14.3 | The operator was left the last move. | NTSB-SUM | "the design of the system relied on the vehicle operator to take control" | confirmed (paraphrase) |
| N14.4 | And, the NTSB found, Uber had little in place to check whether operators were watching. | NTSB-PC, NTSB-FIND | "ineffective oversight of vehicle operators" (probable cause, N13); "lack of risk assessment mechanisms, of oversight of vehicle operators, and of personnel with backgrounds in safety management" | confirmed. The evidence for "little in place" is given in full at N13 and N16
| N15.1 | In the book's reading, each piece of the knowing was held by something that could not act on it, or by someone not placed to look. No one held all of it. And no one was placed to ask whether the person at the wheel could. | book | Interpretation, labeled as the book's reading | interpretation, not a factual claim |
| N16.1 | Here is what the NTSB found about that oversight. | none | Framing sentence; the findings follow in N16.2 and N16.3 | n/a |
| N16.2 | Uber had removed a second vehicle operator from its test cars. The NTSB says that raised the demands on the sole operator and removed a safety redundancy. | NTSB-FIND | "the decision to remove the second vehicle operator increased the task demands on the sole operator and also reduced the safety redundancies" | confirmed |
| N16.3 | And although Uber could review how operators behaved, it rarely did. | NTSB-FIND | "Although the Uber Advanced Technologies Group had the means to retroactively monitor the behavior of vehicle operators...it rarely did so" | confirmed |
| N17.1 | The NTSB also lists, as contributing factors, the pedestrian's crossing outside a crosswalk, and Arizona's insufficient oversight of automated vehicle testing. | NTSB-PC | "Further factors contributing to the crash were (1) the impaired pedestrian's crossing of N. Mill Avenue outside a crosswalk, and (2) the Arizona Department of Transportation's insufficient oversight of automated vehicle testing" | confirmed. The report's wording includes "impaired"; the narration deliberately omits toxicology |
| N18.1 | After the crash, Uber added a second operator and real-time monitoring of operator attentiveness. | NTSB-FIND | "postcrash inclusion of a second vehicle operator...along with real-time monitoring of operator attentiveness" | confirmed |
| N18.2 | It also made the Volvo's own collision warning and braking available while the software drives. | NTSB-FIND | "making Volvo's forward collision warning and automatic emergency braking available during operation of the automated driving system" | confirmed |
| N18.3 | The NTSB says these changes begin to address the problems that contributed to the crash. | NTSB-FIND | "begins to address the oversight deficiencies"; "added a layer of safety redundancy that reduces the safety risks" | confirmed. The report says the first change "begins to address the oversight deficiencies" and the second "added a layer of safety redundancy"; the narration combines them |
| N19.1 | In the book's terms, those changes put pieces of the missing layer back: a second person, a check on the operator, and the car's own collision warning and braking. | NTSB-FIND, book | The three changes are as N18.1 and N18.2 (second operator, real-time monitoring of operator attentiveness, Volvo FCW and AEB available while the ADS drives); the framing as "pieces of the missing layer" is the book's | interpretation of confirmed facts, not a factual claim |
| N20.1 | That layer has a name. The book calls it knowware. | DEF | https://knowware.press/definition, "The third body" | confirmed |
| N21.1 | Knowware, noun. One: ... Two: ... | DEF | Live https://knowware.press/definition, read verbatim 2026-10-16 | confirmed |
| N22.1 | The full entry is at knowware dot press slash definition. | DEF | Page is live | confirmed |

---

## 7. Flags and cuts

- **F1. The book's own opener disagrees with the NTSB.** The Chapter 6 opener on knowware.press (file `src/content/chapters/06.md`) gives the date as "October 21, 2018" and says the system classified her as "unknown object, then vehicle, then bicycle, then unknown object again" over "six long seconds." The NTSB report says March 18, 2018; first classification "vehicle", then also "unknown object" and "bicyclist"; detected 5.6 seconds before impact; collision judged imminent 1.2 seconds before. This episode follows the NTSB. The chapter should be corrected or the discrepancy explained. This is the author's decision; I have not edited the chapter.
- **F2. Naming the victim.** The NTSB does not name her; the narration does not. Add a source if the author wants to.
- **F3. "Automation complacency" gloss (N13.2).** A plain-language definition not taken from the report. Delete if the author prefers to let the term stand.
- **F4. "The board" (N13).** Means the National Transportation Safety Board. Consider saying "the NTSB" every time for clarity.
- **F5. Fairness.** N12 and N17 state the probable cause and the pedestrian's and the state's contributing factors in the NTSB's terms. Do not cut them for time.
- **C1. Cut:** the pedestrian's toxicology and the specific recommendations to NHTSA and the state. The NHTSA response (March 2020) was seen only in a search summary and not read; it is not in the narration.
- **Not verified:** no human source check; time codes are word-count estimates; not read aloud.

---

## 8. Human review log

- [ ] Author source check: open the NTSB PDF and tick each checklist row against its section.
- [ ] Author listening pass: read the narration aloud once; mark any line that trips.
- [ ] Author decision on F1: correct Chapter 6 or note the discrepancy.
- [ ] Author decision on F2 to F4.
