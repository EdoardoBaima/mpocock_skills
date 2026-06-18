# Pi-adapted Matt Pocock skills

This folder is the pi-native adaptation layer for upstream Matt Pocock skills. It is intentionally separate from `skills/` so upstream content stays clean.

## Adaptation policy

Mirror upstream's public skill model deliberately: names, removals, and user-invoked vs model-invoked taxonomy should follow upstream unless a pi-specific exception is written down.

Adapt content for pi, not for backwards compatibility: use `/skill:<name>`, pi-native tools, and this repo's workflow conventions. Do not keep aliases or removed skills just because they existed before.

Project-maintenance skills for this fork live under `.pi/skills/`, not in this globally installable adaptation layer.

## Included

### Engineering

- `engineering/ask-matt`
- `engineering/grill-with-docs`
- `engineering/triage`
- `engineering/improve-codebase-architecture`
- `engineering/setup-matt-pocock-skills`
- `engineering/to-issues`
- `engineering/to-prd`
- `engineering/prototype`
- `engineering/implement`
- `engineering/diagnosing-bugs`
- `engineering/tdd`
- `engineering/domain-modeling`
- `engineering/codebase-design`
- `engineering/resolving-merge-conflicts`

### Productivity

- `productivity/grill-me`
- `productivity/handoff`
- `productivity/teach`
- `productivity/writing-great-skills`
- `productivity/grilling`

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

Restart pi or run `/reload`. Invoke user-invoked skills with `/skill:<name>`, for example:

```text
/skill:ask-matt
/skill:grill-with-docs
/skill:writing-great-skills
```

## Pi-specific changes

- Slash-command references use pi's `/skill:<name>` form.
- `setup-matt-pocock-skills` prefers `AGENTS.md` for pi-native projects while preserving `CLAUDE.md` compatibility.
- `.claude-plugin/plugin.json` is intentionally not used.
