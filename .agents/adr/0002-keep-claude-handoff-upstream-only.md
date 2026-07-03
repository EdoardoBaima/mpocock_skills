# Keep `claude-handoff` upstream-only until pi needs its own equivalent

Upstream added `skills/in-progress/claude-handoff`, which launches a fresh Claude background agent with `claude --bg --name` and tells the user to manage it with `claude agents`.

We receive that skill in `skills/` as upstream content.

We do not copy it into `pi-skills/` now.

A direct pi port would not be a small wording change. It would define a different execution path, because pi uses its own session and subagent tools rather than the Claude CLI. That makes a pi version new product work, not an upstream compatibility fix.

The pi adaptation layer should stay thin. It should correct only the parts of an upstream skill that affect how pi consumes it.

If we later want a pi-native handoff skill that starts or seeds a fresh pi session, track that as separate work and design it deliberately.
