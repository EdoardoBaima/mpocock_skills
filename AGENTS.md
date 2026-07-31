# Agent Context

This fork exists to keep Matt Pocock's `skills` repository usable in the pi coding agent.

## Why this file exists

Pi loads `AGENTS.md` before `CLAUDE.md` when both exist in the same directory. Therefore this file is the pi-native project context. Keep upstream `CLAUDE.md` in the repo for compatibility and as the upstream rule source, but do not rely on pi loading it automatically.

## Repository model

- `upstream/main` is Matt Pocock's source repository.
- `origin/main` is this fork's pi-compatible distribution.
- The upstream `skills/` tree should stay close to upstream.
- The `pi-skills/` tree is a curated, pi-native adaptation layer.
- Use `main` as the long-lived pi-adapted branch.

## Normal workflow

When upstream changes are fetched:

1. Merge `upstream/main` into `main`.
2. Review what changed under `skills/`.
3. Decide whether any new or changed upstream skills should be adapted into `pi-skills/`.
4. Do not automatically mirror every upstream skill into `pi-skills/`; add only skills that are useful in pi.

## Upstream `skills/` rules

When editing `skills/`, top-level `README.md`, bucket READMEs, or `.claude-plugin/plugin.json`, follow the upstream rules from `CLAUDE.md`. The essential rules are:

- Skills are bucketed under `skills/engineering`, `skills/productivity`, `skills/misc`, `skills/personal`, `skills/in-progress`, and `skills/deprecated`.
- Every skill in `engineering` or `productivity` must appear in the top-level `README.md` and `.claude-plugin/plugin.json`.
- Skills in `misc`, `personal`, `in-progress`, and `deprecated` must not appear in either.
- Each skill entry in the top-level `README.md` must link to that skill's `SKILL.md`.
- Each bucket `README.md` must list every skill in that bucket with a one-line description linked to `SKILL.md`.
- Every `engineering` and `productivity` skill must have a matching human-facing page under `docs/<bucket>/`.
- Keep `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` aligned with the upstream packaging rules in `CLAUDE.md`.

Prefer preserving upstream wording in `skills/` unless intentionally updating the upstream copy.

## Pi-adapted `pi-skills/` rules

For `pi-skills/`:

- Treat it as a curated adaptation layer, not a full mirror.
- Use pi slash-command wording: `/skill:<name>`.
- Prefer pi-native agent/tool language over Claude-specific terms.
- Do not use `.claude-plugin/plugin.json`; pi skills are installed by copying from `pi-skills/` into pi's skills directory.
- Keep `pi-skills/README.md` and the relevant bucket README updated when adding or removing curated pi skills.
- When adapting an upstream skill, preserve the intent but make the workflow concrete for pi.

## Branching model

Use short-lived feature branches only for experiments or larger changes, then merge them back into `main`.
