Quickstart for pi:

Copy `pi-skills/engineering/research` into your pi skills directory, then reload pi.

```bash
mkdir -p ~/.pi/agent/skills
cp -R pi-skills/engineering/research ~/.pi/agent/skills/
```

Invoke it as `/skill:research`.

[Pi-adapted source](../../engineering/research/SKILL.md)

[Upstream source](https://github.com/mattpocock/skills/tree/main/skills/engineering/research)

## What it does

`research` answers a question by reading the sources that own the answer and leaving a cited Markdown file behind. It works only from **primary sources**: official docs, source code, specs, first-party APIs, never a secondary write-up of them, so what it saves is traceable back to something authoritative rather than a summary of a summary.

## When to reach for it

Type `/skill:research`, or the agent reaches for it automatically when a task turns into reading legwork.

Reach for it when the next step is *finding something out*, such as how an API behaves, what a spec says or whether a claim holds, and you'd rather not stall your own thread doing the reading. For sharpening a plan by interview instead of by reading, use [grilling](https://aihero.dev/skills-grilling); for exploring what to build with throwaway code, use [prototype](https://aihero.dev/skills-prototype).

## Delegated legwork

The defining move is that the reading runs as a **pi subagent**. You keep working; it goes off, follows each claim back to its primary source, and drops a single cited Markdown file into wherever the repo keeps such notes. Research is legwork you delegate, not thinking you outsource, you get back a document to react to, with its sources attached.

For online material, the subagent should use pi's web tools, such as `web_search`, `fetch_content` or `agent_browser` for live docs, to reach the primary source. The search result is not the source; the cited source is the official page, spec, source file, or first-party API that owns the claim.

## Where it fits

A reach-for-it-anytime standalone that feeds the thinking skills: the file it produces is something to grill, plan, or design against, so it sits upstream of work like [grilling](https://aihero.dev/skills-grilling) and [to-spec](https://aihero.dev/skills-to-spec) rather than in the build chain. For the whole map, see [ask-matt](https://aihero.dev/skills-ask-matt).
