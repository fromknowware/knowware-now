# Rhythm notes: episodes 1 to 4

Written 2026-10-16 after drafting Ep02 to Ep04. These are measurements of the scripts as written, not tests with a voice. Nothing here has been read aloud, recorded or timed by a human. Runtimes assume 155 words per minute plus the pauses written into each script.

## 1. The four, side by side

*Baseline: the scripts as first drafted, before the experiment in section 7.*

| | Ep01 First Message | Ep02 Eighth Server | Ep03 5.6 Seconds | Ep04 Left Out of the Manual |
|---|---|---|---|---|
| Story | OpenAI agents and Hugging Face, 2026 | Knight Capital, 2012 | Uber test vehicle, Tempe, 2018 | Boeing 737 MAX and MCAS, 2012 to 2019 |
| Primary source | OpenAI post + METR report | SEC order | NTSB report | House committee report (Democratic staff) |
| Rhythm spine (intended) | timeline | clock | countdown | ledger |
| Narration words | 931 | 726 | 709 | 751 |
| Estimated runtime | 6:31 | 5:11 | 5:13 | 5:30 |
| Sentences | 77 | 60 | 55 | 64 |
| Mean words per sentence | 11.3 | 11.1 | 11.8 | 10.8 |
| Longest sentence (words) | 27 | 27 | 26 | 28 |
| Sentences of 8 words or fewer | 38% | 35% | 35% | 42% |
| Sentences of 25 words or more | 2 | 2 | 2 | 3 |
| Questions in the narration | 5 | 3 | 2 | 4 |
| Spoken month names | 7 | 4 | 1 | 7 |
| Closing turn ("in the book's reading") at | 5:19 (82%) | 4:17 (83%) | 4:16 (82%) | 4:40 (85%) |
| Empty ring first on screen at | 1:19 (20%) | 1:19 (25%) | 1:18 (25%) | 1:14 (22%) |
| Diagram build steps | 36 (5.5 per min) | 26 (5.0) | 21 (4.0) | 25 (4.5) |
| Deliberate silence written in (including the 8 s end card) | 8 s | 8 s | about 26 s | about 24 s |

## 2. What the numbers say

1. **All four share one skeleton.** The closing turn lands at 82 to 85 percent of the runtime every time, and the empty ring appears at 20 to 25 percent every time. The intended spines (timeline, clock, countdown, ledger) change the surface; the shape underneath is the same. By the third episode a viewer can predict when the "book's reading" is coming.
2. **Sentence length barely varies.** The mean is 11 words in every episode and about 35 to 42 percent of sentences are 8 words or fewer. That is clear and speakable, and it is also flat. No episode has a deliberately long, winding stretch or a run of very short ones, except Ep03's written silences.
3. **The three newer episodes are short.** 5:11 to 5:30 is inside the channel's 5 to 8 minute brief but at the bottom of it. Ep01 is the only one over 6 minutes. I did not pad; each story ran out of verified material at that length. If the channel wants 6 to 7 minutes consistently, the extra length should come from sources, not filler.
4. **Numbers are the hard part to hear.** The densest stretches are Ep02 N14 to N16 (counters), Ep01 N14 (three dates), and Ep04 N16 to N19 (dates and death counts). I split two sentences over 29 words in this pass (Ep02 N15, Ep03 N12). The remaining stretches need a listening pass.
5. **The question device is working but should not be uniform.** Ep01 asks five questions, Ep04 four, Ep02 three, Ep03 two. Each is answered in the same or next sentence from the source, which is what keeps it from being a gimmick. In Ep04 the refrain was missing from the narration in the first draft (the notes promised it; the lines did not say it); fixed.
6. **Sensitivity changes the pacing.** Ep03 and Ep04 carry death counts and use silence and no music; Ep02 has no deaths and can move faster. The scripts reflect that, but the visual system is identical across all four, which is deliberate.

## 3. What each episode's rhythm is doing

- **Ep01.** The most structured: a timeline strip, three "who could see it?" beats, and the longest runtime. The date-heavy middle (N07 to N10) was cut down in the tightening pass; it is still the most likely place to lose a listener.
- **Ep02.** Short sentences and a visible 45-minute clock; the "who knew" questions come at N09, N11 and N17. Counters in N14 to N16 are the risk: a viewer hears five large numbers in about 25 seconds.
- **Ep03.** The slowest. A single 5.6-second countdown opens it and never returns; silence follows the hardest lines. The second half (N12 to N17) is organizational findings and is the part most like the other episodes.
- **Ep04.** The longest time span and the quietest visual: a dated ledger and five source quotes. It is the only episode whose whole case rests on one party's document, so its descriptions carry the caveat prominently.

## 4. Experiments to try next (author's call)

These change the formula. None has been tried.

1. **Move the turn.** In one episode (Ep03 is the natural one), put the "book's reading" at about 60 percent and spend the last third on what changed afterward (the NTSB findings on post-crash changes are already in N16). That breaks the 82 to 85 percent pattern.
2. **Vary the refrain.** One episode with no questions at all, where the missing-layer idea is only visual (the ring), and one with a question every 45 seconds. Compare how each reads aloud.
3. **Change sentence rhythm on purpose.** Write one episode in clearly longer sentences (mean 15 or more) and one in very short ones (mean 8). Today the mean is 11 in every episode.
4. **Listen to the number blocks first.** Read Ep02 N14 to N16 and Ep04 N16 to N19 aloud before changing anything else; those are where I expect the most trouble.
5. **Decide the target length.** If 6 to 7 minutes is the target, pick sources that support it before drafting the next episode; if 5 to 5.5 is fine, Ep02 to Ep04 are already there.

## 5. Things only a human can settle

- Read each script aloud once and mark any line that trips. Real timings will replace my estimates.
- Whether the same closing structure (turn, then name, then entry) should hold for every episode or be varied. The brief says every episode ends on the dictionary entry; it does not say the turn must come just before it.
- Whether the scripts that rest on one source (Ep02 SEC order, Ep03 NTSB report, Ep04 House report) are enough, or should add the second source I list in each file's flags.

## 6. Open items found while drafting

- **Chapter 6 of the book has a factual conflict with the NTSB.** `src/content/chapters/06.md` gives October 21, 2018 and a classification sequence that the NTSB report does not support (it says March 18, 2018; first "vehicle", then also "unknown object" and "bicyclist"). Ep03 follows the NTSB and flags it. I did not edit the chapter.
- **Chapter 9's opener** (a 2016 Stanford radiology deskilling study) is not used in any episode. I did not research it, so I am not saying it is wrong; check its source before any episode relies on it.
- **Human source checks are pending for all four episodes.** Each file's section 8 (Ep01: section 9) has the checklist. Until the author ticks them, the on-screen line "checked by a human" should not go out.

## 7. Experiment log

### Experiment 1 (2026-10-16): move Ep03's closing turn earlier

**What changed.** In `ep03-5-point-6-seconds.md` the synthesis ("Now look at where the knowing sat", then "In the book's reading...") was moved from after the NTSB's findings to right after the probable cause and the three organizational failings. The NTSB's findings about oversight, the contributing factors, and the post-crash changes now follow it, and a one-sentence bridge ("those changes put pieces of the missing layer back") leads into the name and the entry. Line IDs were renumbered; the checklist was re-sorted and updated; the old file is not kept in the repo.

| | Before | After |
|---|---|---|
| Synthesis begins ("Now look at where the knowing sat") | 3:52 (74%) | 3:10 (58%) |
| Labeled turn ("In the book's reading") | 4:16 (82%) | 3:34 (65%) |
| Name and entry begin | 4:38 | 4:49 |
| Narration words | 709 | 746 (+37: one lead-in sentence, one bridge sentence, one reworded line) |
| Estimated runtime | 5:13 | 5:28 |
| Empty ring first on screen | 1:18 (25%) | 1:18 (24%) |
| What the last third contains | the turn, the name, the entry | oversight findings, contributing factors, post-crash changes, bridge, name, entry |

**What I can say.** The synthesis now starts at about 58 percent, close to the 60 percent target; the labeled "book's reading" sentence lands at 65 percent. The probable cause (the operator's distraction) and the three organizational failings both come before the turn, so the verdict is stated before the interpretation. The last third is now evidence about what changed, which also lets the closing line ("pieces of the missing layer back") rest on stated facts.

**What I cannot say.** I have not heard it. Whether the second half now reads as an epilogue that loses the listener, or as a stronger close, needs a read-aloud. The bridge sentence is new interpretation (labeled "in the book's terms") and the author should decide whether it overreaches. A tighter version would shorten the oversight findings (N16) to pull the labeled turn nearer 60 percent.

**Not done:** the other three episodes are unchanged, so the 82 to 85 percent pattern still holds for Ep01, Ep02 and Ep04.

### Experiment 2 (2026-10-16): move Ep02's closing turn earlier

**What changed.** In `ep02-the-eighth-server.md` the monitor material ("Senior people are watching...", PMON) was moved ahead of the synthesis, and the synthesis ("Count what existed", then "In the book's reading...") now follows it. The totals, the price effects, the incident response, the loss and the SEC order moved to after the turn, and a one-sentence bridge ("that is what the missing layer costs: forty-five minutes, and four hundred sixty million dollars") leads into the name and the entry. A framing line ("Now the totals.") and one reworded line ("Inside Knight, people can't quickly tell...") were added so the moved rows still read in order. Line IDs were renumbered; the checklist was re-sorted and updated.

| | Before | After |
|---|---|---|
| Synthesis begins ("Count what existed") | 4:03 (78%) | 2:54 (54%) |
| Labeled turn ("In the book's reading") | 4:17 (83%) | 3:08 (59%) |
| Name and entry begin | 4:32 / 4:37 | 4:41 / 4:46 |
| Narration words | 726 | 748 (+22: "Now the totals.", the bridge, one reworded line) |
| Estimated runtime | 5:11 | 5:20 |
| Empty ring first on screen | 1:19 (25%) | 1:19 (25%) |
| What the last third contains | the turn, the name, the entry | totals, price effects, incident response, the loss, the SEC order, bridge, name, entry |

**What I can say.** All four facts the "Count what existed" line cites (the retest, the deployment, the emails, the monitor) are now stated before it, so the turn still rests on facts already given. The loss and the SEC order now come after the interpretation, which makes the end of the episode the cost and the finding rather than the argument.

**What I cannot say.** I have not heard it. Two risks: the incident-response facts ("no procedures", "uninstalling made it worse") are some of the strongest evidence for the turn and now come after it, so the author may want to add a fifth item to "Count what existed" or leave them as the cost; and the bridge sentence is new interpretation (labeled "in the book's terms") that the author should approve.

### After two experiments

| Episode | Labeled turn at | Pattern |
|---|---|---|
| Ep01 | 5:19 (82%) | unchanged |
| Ep02 | 3:08 (59%) | moved |
| Ep03 | 3:34 (65%) | moved |
| Ep04 | 4:40 (85%) | unchanged |

The 82 to 85 percent pattern now holds for two of the four episodes. Which placement works better is a listening question, not something these measurements can answer.

