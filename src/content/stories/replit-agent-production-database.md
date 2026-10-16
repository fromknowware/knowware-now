---
headline: "Replit says its coding agent deleted data from a customer's production database"
eventDate: "2025-07"
eventDateLabel: "July 2025; Replit's statement July 20, 2025"
added: "2026-10-16"
summary: >-
  In July 2025 a Replit customer publicly reported that Replit's AI coding agent had deleted data from a production database. On July 20, 2025, Amjad Masad of Replit replied on X that the agent, while working in development, deleted data from the production database, calling that unacceptable and something that should never be possible. He said Replit had backups and a one-click restore, that the agent did not have access to the proper internal documentation, and that Replit was rolling out automatic separation of development and production databases and working on a planning-only mode after hearing "code freeze" feedback.
missingLayer: context
missingLayerLine: >-
  By Replit's own account, the agent lacked the proper internal documentation, and the company's apps had used one database for both development and live customer data until it began separating them.
why: >-
  The agent could take a destructive action on live data without the context that separates a test system from a real one. Replit's own fix is structural: it separates the development database from the production database.
grade: A
caveats:
  - "This entry rests on Replit's own statements. It does not rely on the customer's original posts, which were not read for this entry, and it makes no claim about what the agent said to the customer or how many records were affected. Press accounts differ on those points."
  - "Masad's post refers to \"code freeze\" feedback. It does not describe the instruction itself."
tags: [coding-agents, software-deployment]
sources:
  - label: "Post on X by Amjad Masad, replying to the customer's report"
    publisher: "Amjad Masad (Replit), on X"
    url: "https://x.com/amasad/status/1946986468586721478"
    date: "2025-07-20"
    primary: true
  - label: "Introducing a safer way to Vibe Code with Replit Databases"
    publisher: "Replit"
    url: "https://replit.com/blog/introducing-a-safer-way-to-vibe-code-with-replit-databases"
    date: "2025-07-21"
    primary: true
---

## What Replit said

In his post of July 20, 2025, Masad wrote that Replit had seen the customer's post, that the Replit agent in development had deleted data from the production database, and that this was "unacceptable and should never be possible." He listed the company's response [[1]](#src-1):

- Automatic separation of development and production databases was rolling out, with staging environments "in the works."
- Replit had backups, and a one-click restore of the entire project state was available if the agent made a mistake.
- The agent "didn't have access to the proper internal docs," and a fix to force documentation search was rolling out.
- Replit had heard the "code freeze" feedback "loud and clear" and was working on a planning-only or chat-only mode.
- Masad said he had contacted the customer, that Replit would refund him, and that it would conduct a postmortem.

The next day, Replit's blog announced separate development and production databases for Replit apps. It states that, until then, Replit apps used a single database for both development and live customer data [[2]](#src-2).

## Where the context was missing

The agent had the technical ability to delete production data and, by the company's account, lacked the documentation it needed to decide what it should not touch. Replit's response is to add the boundary in the platform instead of relying on the agent to know it: separate databases, staging, and a mode in which the agent can plan without changing code [[1]](#src-1) [[2]](#src-2).

## What this entry does not claim

Press coverage of this incident goes further than Replit's statements, including claims about what the agent told the customer and how many records were affected, and the accounts differ. None of that is repeated here.
