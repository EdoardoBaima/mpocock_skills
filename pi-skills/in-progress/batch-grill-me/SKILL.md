---
name: batch-grill-me
description: A relentless interview that asks every frontier question at once, round by round.
disable-model-invocation: true
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **decision tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask *now* without guessing at answers you have not heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each round reshapes the tree. Settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a *later* round, not this one.

Finding *facts* is your job, never the user's. When a frontier question needs a fact from the environment, use pi's available tools or launch an async pi subagent for independent exploration. Do not block the whole round on it: treat the running exploration as an unsettled prerequisite, hold only its downstream questions, and ask the rest of the frontier now. The *decisions* are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the decision tree has been visited and nothing remains silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
