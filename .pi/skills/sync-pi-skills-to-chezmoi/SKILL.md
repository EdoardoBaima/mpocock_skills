---
name: sync-pi-skills-to-chezmoi
description: Mirror this repo's curated pi-skills/ tree into the chezmoi source state so installed pi skills track the fork. Use after a pi-skills change is committed, when the user asks to sync skills to chezmoi, update dotfiles skills, or align chezmoi with pi-skills.
---

# Sync pi-skills to chezmoi

The chezmoi repo is the distribution channel for the curated skills: it deploys `pi-skills/` to `~/.pi/agent/skills/matt-pocock/` via `chezmoi apply`.

The flow is one direction only: **this repo → chezmoi**. Never edit skills in the chezmoi copy; fix them here and re-sync.

## Process

1. **Use one chezmoi target.** Define these variables once and use them for every command in this run.

   ```bash
   CHEZMOI_SOURCE="${CHEZMOI_SOURCE:-$HOME/.local/share/chezmoi}"
   MATT_POCOCK_TARGET="$CHEZMOI_SOURCE/home/dot_pi/agent/skills/matt-pocock"
   ```

2. **Sync from a committed state.** `pi-skills/` must be clean. The script exports `HEAD:pi-skills`, not the filesystem working tree. If this command prints anything, commit here first (see `/skill:commit`).

   ```bash
   git status --short -- pi-skills
   ```

3. **Preview, then mirror.** The dry run is the canonical preview: it compares the same committed snapshot the mirror will install.

   ```bash
   bash .pi/skills/sync-pi-skills-to-chezmoi/scripts/sync-pi-skills-to-chezmoi.sh --chezmoi-source "$CHEZMOI_SOURCE" --dry-run
   bash .pi/skills/sync-pi-skills-to-chezmoi/scripts/sync-pi-skills-to-chezmoi.sh --chezmoi-source "$CHEZMOI_SOURCE"
   ```

   The mirror deletes target entries missing from `pi-skills/`. It refuses to run over uncommitted chezmoi changes in the target subtree; resolve those in the chezmoi repo first.

4. **Review the chezmoi diff.** Every change must trace to a `pi-skills/` change you recognise. A deletion you cannot explain means someone edited the chezmoi copy directly — stop and reconcile before committing.

   ```bash
   git -C "$CHEZMOI_SOURCE" diff -- home/dot_pi/agent/skills/matt-pocock
   ```

5. **Verify the source copy.** Re-run the script dry-run against the same target. It must print `(no differences)`. If it prints a diff, stop and reconcile before committing the chezmoi repo.

   ```bash
   bash .pi/skills/sync-pi-skills-to-chezmoi/scripts/sync-pi-skills-to-chezmoi.sh --chezmoi-source "$CHEZMOI_SOURCE" --dry-run
   ```

6. **Deploy and handle orphans before committing chezmoi.** `chezmoi apply` never deletes deployed files. A renamed or removed skill can leave a stale live directory under `~/.pi/agent/skills/matt-pocock/`.

   ```bash
   chezmoi apply
   diff -rq "$MATT_POCOCK_TARGET" ~/.pi/agent/skills/matt-pocock
   ```

   If `diff` prints `Only in ~/.pi/...`, remove that stale deployed file or directory, or list it in `.chezmoiremove` and run `chezmoi apply` again. Because `.chezmoiremove` sits outside the skill subtree, the final commit check covers the whole chezmoi repo.

7. **Commit in the chezmoi repo.** Use a subject that names the source commit, e.g. `chore(pi-skills): sync matt-pocock skills from mpocock_skills <short-sha>`. Push only with user approval.

   ```bash
   git -C "$CHEZMOI_SOURCE" status --short
   git -C "$CHEZMOI_SOURCE" add -A
   git -C "$CHEZMOI_SOURCE" commit -m "chore(pi-skills): sync matt-pocock skills from mpocock_skills <short-sha>"
   ```

Done when these checks pass:

- `git status --short -- pi-skills` prints nothing
- the sync script's `--chezmoi-source "$CHEZMOI_SOURCE" --dry-run` prints `(no differences)` after mirroring
- `diff -rq "$MATT_POCOCK_TARGET" ~/.pi/agent/skills/matt-pocock` prints nothing after `chezmoi apply`
- `git -C "$CHEZMOI_SOURCE" status --short` is clean after the chezmoi commit
