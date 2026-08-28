---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. Suggest improvements to the coding agent's **environment** that would improve future runs.

## Steps

1. Use the `/skill:writing-for-agents` guidance when assessing or proposing changes to skills, `AGENTS.md`, `CLAUDE.md`, or documents reached through context pointers.

2. Read the primary sources for the session the user names. If the user does not name one, use the current session. Use Pi session search and query tools for past sessions. Read the files, diffs, commands, tool results, and review findings that support each candidate.

3. Look for improvement candidates in these categories:

- **Navigation**: could the agent find the right files quickly? Were dependencies hidden? Would a navigation pointer help? Use this when the session spent too long finding information.
- **Automated checks**: could linting, typing, tests, filesystem checks, or repository scripts have caught an error earlier? Use this when the agent made a preventable mistake.
- **Coding standards**: should the review agent enforce, remove, or clarify a rule? Use this when review missed a mistake or repeatedly flags a false positive.
- **Global or repository AGENTS.md**: should a steering instruction move into coding standards, an automated check, or a referenced document? Use this when an `AGENTS.md` or `CLAUDE.md` file carries too much always-loaded detail.
- **Tool economy**: did the agent make expensive or repeated tool calls that a script, focused query, or better tool contract could replace? Use this when tool use consumed avoidable time or context.
- **No-ops**: do steering files contain instructions that do not change agent behaviour? Use this when instructions are large, repeated, or ignored.
- **Information access**: could the agent gain safe read-only access to missing information, such as development server logs or a third-party service? Use this when unavailable evidence blocked or delayed the work.

4. Present candidates in severity order. For each candidate, cite the session evidence, name the proposed file or check, explain the expected improvement, and state the maintenance cost or risk. Separate observed problems from hypotheses.

5. Do not change the environment during the retrospective unless the user approves specific candidates. End with the smallest change you recommend testing first.

## Reference

### Implementation and review

Work has two stages: implementation and review. The implementation agent has more context pressure because it explores, writes code, and diagnoses failures. The review agent starts from a diff and usually has less context pressure.

Put enforceable coding standards in review or automated checks where possible. Keep implementation instructions focused on navigation, contracts, and the work itself.

### Files

- `AGENTS.md` and `CLAUDE.md` enter an agent's context. Use them sparingly, usually for navigation pointers.
- `CODING_STANDARDS.md` is review guidance. Add pointers to supporting documents when it becomes difficult to scan.
- Documentation files hold reference material. Look for an existing home before creating another file.
- Skills hold reusable agent workflows or user-invoked commands. Follow `/skill:writing-for-agents` when changing them.
