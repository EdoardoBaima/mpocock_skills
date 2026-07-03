---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **pi subagent** to do the research, so you keep working while it reads.

For online sources, have the subagent use pi's web tools — `web_search`, `fetch_content`, or `agent_browser` for live docs — as the way to reach the primary source. The search result is not the source; cite the official page, spec, source file, or first-party API that owns the claim.

Its job:

1. Investigate the question against **primary sources** — official docs, source code, specs, first-party APIs — not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
