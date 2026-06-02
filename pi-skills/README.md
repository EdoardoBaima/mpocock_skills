# Pi-adapted Matt Pocock skills

This folder is a pi-native copy of the selected upstream skills. It is intentionally separate from `skills/` so upstream content stays clean.

## Included

- `productivity/*` — including `handoff` for durable cross-session continuity and `skills-inventory-report` for visual inventory comparisons
- `engineering/setup-matt-pocock-skills`
- `engineering/grill-with-docs`
- `engineering/diagnose`
- `engineering/improve-codebase-architecture`
- `engineering/prototype`
- `engineering/tdd`
- `engineering/to-issues`
- `engineering/to-prd`
- `engineering/triage`
- `engineering/zoom-out`

## Install globally in pi

Copy the skill directories into pi's global skills folder:

```bash
mkdir -p ~/.pi/agent/skills
cp -R pi-skills/productivity/* ~/.pi/agent/skills/
cp -R pi-skills/engineering/* ~/.pi/agent/skills/
```

PowerShell equivalent:

```powershell
New-Item -ItemType Directory -Force "$HOME/.pi/agent/skills" | Out-Null
Copy-Item -Recurse -Force pi-skills/productivity/* "$HOME/.pi/agent/skills/"
Copy-Item -Recurse -Force pi-skills/engineering/* "$HOME/.pi/agent/skills/"
```

Restart pi or run `/reload`. Invoke skills with `/skill:<name>`, for example:

```text
/skill:tdd
/skill:diagnose
/skill:grill-with-docs
```

## Pi-specific changes

- Slash-command references use pi's `/skill:<name>` form.
- `setup-matt-pocock-skills` prefers `AGENTS.md` for pi-native projects while preserving `CLAUDE.md` compatibility.
- Claude-specific `Agent tool` wording was replaced with direct pi tool exploration, with optional `pi-subagents` wording where useful.
- `.claude-plugin/plugin.json` is intentionally not used.
