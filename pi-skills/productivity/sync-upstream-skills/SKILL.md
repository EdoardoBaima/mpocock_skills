---
name: sync-upstream-skills
description: Sync this fork with Matt Pocock's upstream skills repo and curate any useful changes into pi-skills. Use when maintaining this fork, after `git fetch upstream`, or when the user asks to summarize upstream changes, merge them, and adapt new skills for pi.
---

# Sync Upstream Skills

Keep this fork's `main` as the pi-compatible distribution of Matt Pocock's upstream `skills` repo.

## Mental model

- `upstream/main` is Matt Pocock's source repository.
- `origin/main` is this fork's pi-adapted distribution.
- `skills/` should stay close to upstream.
- `pi-skills/` is curated. Do not mirror everything automatically.

## Process

1. **Orient safely**

   ```bash
   git status --short --branch
   git remote -v
   git branch -vv
   ```

   If there is uncommitted work, ask whether to commit, stash, or stop. Do not merge over unclear local work.

2. **Fetch and summarize upstream news**

   ```bash
   git fetch upstream
   git log --oneline --decorate HEAD..upstream/main
   git diff --stat HEAD..upstream/main
   git diff --name-status HEAD..upstream/main
   ```

   Explain the changes in user language: new skills, promoted skills, renamed files, docs changes, and behavior changes.

3. **Merge upstream into this fork**

   On `main`:

   ```bash
   git merge upstream/main
   ```

   If conflicts happen, preserve both intentions:

   - upstream rules and content in `skills/`
   - pi-specific adaptation rules in `pi-skills/` and `AGENTS.md`

4. **Evaluate pi adaptation candidates**

   For each upstream change, decide:

   - **Port to `pi-skills/` now** — broadly useful in pi and mature enough.
   - **Leave upstream-only** — not useful for pi, experimental, or not worth maintaining.
   - **Defer** — useful but needs design time.

   Say the decision explicitly. Do not silently skip new upstream skills.

5. **Adapt selected skills for pi**

   When porting a skill:

   - Preserve the upstream intent.
   - Replace Claude-specific wording with pi-native wording.
   - Use `/skill:<name>` examples.
   - Prefer concrete pi tool/process guidance.
   - Keep the skill concise; split references only if needed.
   - Update `pi-skills/README.md` and the relevant bucket `README.md`.

6. **Review and finish**

   ```bash
   git status --short
   git diff --stat
   git diff
   ```

   Summarize:

   - upstream commits merged
   - files changed by upstream
   - pi skills added/updated/deferred
   - any unresolved follow-up

   Then, with user approval or prior instruction:

   ```bash
   git add <files>
   git commit -m "Sync upstream skills and update pi adaptations"
   git push origin main
   ```

## Quality bar

- Keep `AGENTS.md` as the pi-native operating context.
- Preserve `CLAUDE.md` for upstream/Claude compatibility.
- Do not use `.claude-plugin/plugin.json` for `pi-skills/`.
- Be explicit about branch state before and after the sync.
- Prefer one clean sync/adaptation commit unless the user asks for finer history.
