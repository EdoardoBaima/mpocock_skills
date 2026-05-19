---
name: handoff
description: Compact the current pi session into a durable handoff document so another agent or future session can continue. Use when the user says "handoff", "write a handoff", "summarize for next session", "compact this conversation", or wants to pause/resume work later.
argument-hint: "What should the next session focus on?"
---

# Handoff

Write a concise handoff document for a fresh pi agent. The goal is not to summarize everything — it is to preserve exactly what the next session needs to continue safely.

## Process

1. **Create a temporary markdown file outside the workspace.** Save the handoff in the OS temp directory, not the current repository or workspace. Prefer:

   ```bash
   mktemp -t handoff-XXXXXX.md
   ```

   If `mktemp` is unavailable, create an equivalent temp file named `handoff-<random>.md` in the OS temp directory. Read the file once before writing, even if it is empty.

2. **Inspect durable artifacts before duplicating them.** If the work is already captured in a PRD, issue, ADR, plan, commit, diff, or file, reference it by path/URL instead of copying it into the handoff.

3. **Tailor to the user's argument.** If the user invoked the skill with a focus like "next session should implement the parser", optimize the handoff for that next task.

4. **Redact sensitive information.** Do not include API keys, passwords, secrets, tokens, private URLs, or personally identifiable information. If such details matter, describe where the next session can find them safely.

5. **Suggest next-session skills.** Mention any relevant `/skill:<name>` invocations, for example `/skill:diagnose`, `/skill:tdd`, `/skill:triage`, `/skill:grill-with-docs`, or `/skill:prototype`.

6. **Write the file, then report the path.** Do not paste the whole handoff back unless the user asks. Give the file path and a 1–2 sentence summary of what it contains.

## Handoff template

```markdown
# Handoff: <short title>

## Next session goal

<What the next agent/session should accomplish.>

## Current state

- <What has been decided or completed.>
- <What is in progress.>
- <What is intentionally not done.>

## Key context

- <Domain terms, constraints, user preferences, and important conclusions.>
- <Avoid re-explaining artifacts that already exist; link them below.>

## Durable artifacts

- `<path-or-url>` — <why it matters>
- `<path-or-url>` — <why it matters>

## Commands / checks already run

- `<command>` — <result>

## Open questions

- <Question or decision still unresolved.>

## Recommended next steps

1. <Concrete next action.>
2. <Concrete next action.>
3. <Concrete next action.>

## Suggested pi skills

- `/skill:<name>` — <why it helps>
```

## Quality bar

- Be compact, factual, and operational.
- Prefer bullets over prose.
- Preserve user intent and decisions, not conversational filler.
- Include exact file paths, branch names, issue numbers, and commands where they matter.
- Redact sensitive information before writing.
- Flag uncertainty explicitly instead of smoothing it over.
- Do not invent status. If you did not verify something, say so.
