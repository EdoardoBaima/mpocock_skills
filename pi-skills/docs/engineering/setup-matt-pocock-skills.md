Quickstart for pi:

Copy `pi-skills/engineering/setup-matt-pocock-skills` into your pi skills directory, then reload pi.

```bash
mkdir -p ~/.pi/agent/skills
cp -R pi-skills/engineering/setup-matt-pocock-skills ~/.pi/agent/skills/
```

Invoke it as `/skill:setup-matt-pocock-skills`.

[Pi-adapted source](../../engineering/setup-matt-pocock-skills/SKILL.md)

[Upstream source](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills)

## What it does

`setup-matt-pocock-skills` teaches one repo where issues live, what the triage labels are called and where the domain docs sit. It records those answers as **config** the other skills read.

It writes config, it does not hard-code behaviour. The engineering chain assumes three files under `docs/agents/`; this skill is the one-time bootstrap that produces them, discovered from your actual repo (`git remote`, installed skills, monorepo signals, existing domain docs) and confirmed with you rather than guessed. It is prompt-driven: explore, present what it found, confirm, then write. It is not a deterministic scaffold.

## When to reach for it

You invoke this by typing `/skill:setup-matt-pocock-skills`: the agent won't reach for it on its own.

Reach for it **once per repo, before the first use of any other engineering skill**. If [triage](https://aihero.dev/skills-triage), [to-spec](https://aihero.dev/skills-to-spec), or [to-tickets](https://aihero.dev/skills-to-tickets) start guessing where your issues live or applying labels that don't exist, they haven't been set up here yet. Re-run it only to switch issue trackers or start over, day-to-day tweaks are just edits to `docs/agents/*.md`.

## The three decisions

It leads each choice with a recommended answer you can accept in a word, and skips whatever it can already infer, so most runs need only a couple of quick confirmations:

- **Issue tracker**: where work is tracked, so `triage`/`to-spec`/`to-tickets` know whether to call `gh`, `glab`, write markdown under `.scratch/`, or follow a workflow you describe. It proposes the tracker that matches your `git remote`.
- **Triage labels**: the canonical defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) are always written because tracker-facing skills share them. If `triage` is installed, it asks whether to keep them; otherwise it writes them without asking.
- **Domain docs**: assumed single-context (one `CONTEXT.md` plus `docs/adr/` at the root), which fits almost every repo; it raises a multi-context map only when it spots monorepo signals.

The output is three files: `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, and `docs/agents/domain.md`: plus an `## Agent skills` block pointing to them. In pi, it prefers `AGENTS.md` when present, while preserving `CLAUDE.md` compatibility for repos that already use it. Those files are the shared substrate the rest of the toolkit stands on.

## It's working if

- Three files land under `docs/agents/`, and an `## Agent skills` section appears in your `AGENTS.md` or `CLAUDE.md`.
- The tracker it proposes matches your real `git remote`, and the labels match strings that already exist in your repo.
- Afterwards, `triage` and `to-tickets` act on the right place with the right labels instead of asking or guessing.

## Where it fits

`setup-matt-pocock-skills` is a **run-once setup**: the foundation the whole engineering set stands on, not a step you repeat. Its neighbours are the skills that read what it writes: [triage](https://aihero.dev/skills-triage), because it applies the label vocabulary configured here, and [to-spec](https://aihero.dev/skills-to-spec) / [to-tickets](https://aihero.dev/skills-to-tickets), because they publish into the issue tracker configured here. Run it first; everything downstream assumes it has. When you're unsure which skill or flow fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
