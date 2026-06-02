---
name: skills-inventory-report
description: Generate a visual inventory comparing skill presence across upstream, this branch, pi adaptations, chezmoi, and installed pi skills. Use when auditing skills, comparing upstream/local-origin/chezmoi state, checking which skills are installed, or creating an HTML skills overview report.
---

# Skills Inventory Report

Create or update a beautiful, readable, standalone HTML page that compares skill locations across:

- `upstream/main` `skills/`
- current branch `skills/`
- current branch `pi-skills/`
- current branch `.pi/skills/`
- chezmoi source `~/.local/share/chezmoi/home/dot_pi/agent/skills/`
- installed runtime `~/.pi/agent/skills/`

## Quick start

From the repository root, run:

```bash
node pi-skills/productivity/skills-inventory-report/scripts/skills-inventory-report.mjs
```

Default output:

```text
docs/skills-inventory-report.html
```

The script updates the HTML file in place and opens it in the default browser.

## Workflow

1. **Orient first**

   ```bash
   git status --short --branch
   git remote -v
   ```

   If `upstream/main` may be stale, run `git fetch upstream` before generating the report.

2. **Generate or update the report**

   ```bash
   node pi-skills/productivity/skills-inventory-report/scripts/skills-inventory-report.mjs
   ```

3. **Review the report**

   The HTML should show:

   - counts per source
   - a comparison matrix for all discovered skills
   - macro folder/topic, such as `engineering`, `productivity`, `misc`, `personal`, `in-progress`, `deprecated`, or `local`
   - notable differences, including missing chezmoi/runtime skills and local-only skills
   - exact paths for each skill source

4. **Commit if appropriate**

   The report is intentionally persisted under version control. Review and commit changes when useful:

   ```bash
   git add docs/skills-inventory-report.html
   git commit -m "Update skills inventory report"
   ```

## Options

```bash
node pi-skills/productivity/skills-inventory-report/scripts/skills-inventory-report.mjs --no-open
node pi-skills/productivity/skills-inventory-report/scripts/skills-inventory-report.mjs --output docs/custom-report.html
```

## Quality bar

- Prefer deterministic script output over hand-built tables.
- Keep the report standalone: inline CSS and JavaScript only.
- Make discrepancies obvious and easy to scan.
- Do not modify chezmoi or installed runtime skills; this skill reports only.
- If a source is missing, report it clearly instead of failing silently.
