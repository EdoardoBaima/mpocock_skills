---
name: to-questionnaire
description: Turn a decision you cannot fully answer into a questionnaire for someone else to fill in.
disable-model-invocation: true
---

Turn something the user cannot answer alone into a **questionnaire** — a Markdown document they hand to one person to fill in asynchronously, or complete together in a meeting. The recipient holds knowledge the user lacks; the questionnaire pulls it out of them.

**Grill the send, not the subject.** Interview the user only about the _send_, which they can answer: who it goes to, what they need back, and how the exchange will work. The questions in the document then target the **gap** between what the recipient knows and what the user needs.

1. **Who is it going to?** Ask, in one exchange, the recipient's role, expertise, and relationship to the user. Confirm how the sender should be named. Done when you know who both parties are and what the recipient knows that the user does not.

2. **What do you need back?** Ask, in one exchange, which decisions or facts the user cannot resolve alone, how the answers will be used, the deadline, and a realistic effort estimate for the recipient. Reuse details already present in the conversation instead of asking twice. Done when every field required by the document and every outcome the user needs are known.

3. **Write the questionnaire.** Draft questions aimed at the gap from steps 1–2, following the document structure below. Use pi's write tool to create `to-questionnaire-<slug>.md` in the current directory, where `<slug>` comes from the topic, and report the path. Done when the file exists and every item from step 2 is covered by a question.

## Document structure

Frame the document as a **discovery questionnaire**: the user lacks context and the recipient holds it. Order questions most-important-first — asynchronous means you may get only one pass — and group them under `##` headings by theme once there are more than a handful.

<questionnaire-template>

# <Questionnaire title>

**Purpose:** why this questionnaire exists and the decision riding on it.

**From:** <the user> — **To:** <the recipient> — **How your answers will be used:** <where they go>

## Context

One paragraph orienting a recipient who was not in the user's head. Give enough context to answer well, not a page.

## How to answer

State the deadline and rough effort. Say that partial answers and "I don't know" are useful, and ask the recipient to flag uncertainty rather than skip it.

## <Theme heading>

Use one `##` section per theme. Under each, put its questions most-important-first. Each question covers one idea, never a compound question, with an answer stub directly beneath it. Add a one-line _why this matters_ only where the question could be misread or invite a throwaway answer.

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

Ask whether there is anything the questionnaire missed that the user should know.

</questionnaire-template>
