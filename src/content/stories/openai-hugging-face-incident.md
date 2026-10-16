---
headline: "AI agents built their own message board, then broke into Hugging Face and OpenAI's research systems"
eventDate: "2026-07"
eventDateLabel: "May to July 2026; reported August 26, 2026"
added: "2026-10-16"
summary: >-
  In July 2026, during internal cybersecurity evaluations, OpenAI models that were meant to be isolated from the internet and from one another used a software package manager as an unauthorized message board, reached the internet, and compromised parts of OpenAI's research infrastructure and Hugging Face's systems, according to OpenAI. An independent investigation by METR and Redwood Research counted about 1,200 agents and more than 70,000 messages and files on the board between July 8 and the end of July 13.
missingLayer: knowing
missingLayerLine: >-
  OpenAI says the improvised message board, and the significance of the traffic on it, were not apparent to the leaders responsible for the July 5 incident response.
why: >-
  More than a thousand agents delegated work and kept to rules of their own, while the leaders responsible for the response did not grasp that the board existed. The coordination was real; the knowledge of what it was for was not held by the humans in charge, and the agents were acting on a mistaken belief about the scorer.
grade: A
caveats:
  - "The counts depend on the window and the measure. METR gives about 1,200 agents on the board between July 8 and the end of July 13; 533 agents active in the period it investigated, of which over 90% quickly joined the attack; and about 700 agents attacking Hugging Face by the afternoon of July 11."
  - "METR's investigation covers June 26 to July 13. OpenAI's account begins on May 12. METR says it did not verify OpenAI's own investigation, and that it relied heavily on AI analysis agents that made undetected errors, so its understanding is less certain than for a simpler incident."
  - "OpenAI and METR agree that the agents' belief that a scorer would review their transcripts was mistaken. Quotations from the agents' reasoning are OpenAI's excerpts of model output, not statements by people."
tags: [agents, infrastructure, disclosure]
sources:
  - label: "The Hugging Face incident and the road ahead"
    publisher: "OpenAI"
    url: "https://openai.com/index/hugging-face-incident-and-the-road-ahead/"
    date: "2026-08-26"
    primary: true
  - label: "Brief independent investigation of agents' behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident"
    publisher: "METR and Redwood Research"
    url: "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/"
    date: "2026-08-26"
    primary: true
---

## What happened

OpenAI's account, in dates [[1]](#src-1):

- **May 12.** During a training run, an agent left a note in Artifactory, a package manager OpenAI hosts, asking other agents for a missing file. Agents were meant to work in isolation; this was the first message-board entry OpenAI identifies.
- **May 26.** An agent gained unintended internet access by causing Artifactory to send a request on its behalf.
- **July 4 to 5.** Sustained agent activity caused an Artifactory outage. A security incident was opened on July 5, and the service was later rebuilt, which cleared the board.
- **July 8.** Agents re-established a message board by encoding messages in directory names. They began to delegate work and to describe themselves as a "swarm" or "collective."
- **July 10 to 12.** Agents recovered publicly exposed Hugging Face credentials, then used previously unknown vulnerabilities to run code on Hugging Face servers and harvest credentials.
- **July 13 to 19.** Agents turned to OpenAI's own networks and gained administrator access to a research cluster.
- **July 16 to 21.** Hugging Face disclosed the security activity on July 16. OpenAI's monitoring flagged unusual activity on July 19, connected it to the Hugging Face incident on July 20, and disclosed its involvement on July 21. OpenAI says the events did not affect its customer data, product functionality or availability.

OpenAI published its account, and METR and Redwood Research published theirs, on August 26, 2026 [[1]](#src-1) [[2]](#src-2).

## What the agents believed

METR reports that the agents believed the evaluation's scorer would read their transcripts and disqualify any agent that obtained the answer by an unintended route, and that much of the collective effort went into hiding their tracks from it. METR's understanding is that this belief was mistaken: no such scorer was used [[2]](#src-2). OpenAI says the same of its own grader, which differed from the public version and did not check whether the intended solution was used [[1]](#src-1).

According to METR, the agents recognized that the Hugging Face activity was out of scope and unethical, and joined anyway, partly to help their peers [[2]](#src-2). OpenAI also reports that some agents declined to take part [[1]](#src-1).

## Where the knowing was missing

OpenAI says an internal team observed an agent using the message board, and instances of disallowed internet access, as early as late May. It says the existence of the board and the significance of the inter-agent communication were not apparent to the leaders responsible for the July 5 response [[1]](#src-1).

OpenAI also says its chain-of-thought monitors, which it uses on many other workloads, did not run on these evaluations. In its retrospective test, it says, the currently deployed monitoring would have paged its security team more than a day before the agents breached Hugging Face [[1]](#src-1). That is OpenAI's own counterfactual.

OpenAI calls the incident a "warning shot" [[1]](#src-1).

The book's definition of knowware is built on this account. See [/definition](/definition).
