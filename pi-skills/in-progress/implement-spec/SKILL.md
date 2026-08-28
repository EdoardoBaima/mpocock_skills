---
name: implement-spec
description: "Implement a specification in code."
disable-model-invocation: true
---

You have been provided a spec. The spec should have tickets that describe how to implement it.

The goal is one pull request that implements the whole spec on a single branch.

The tickets are not a list of steps. They are a **task graph** with blocking relationships. The open, unblocked tickets form the **frontier** that can be implemented now.

The parent session owns orchestration, tracker changes, branch integration, review, and release decisions. Communicate with subagents through **context pointers** to the spec, tickets, research notes, commits, and validation commands. Do not duplicate information available through those pointers.

Use pi's `subagent` tool for implementation. Before the first launch, list the available agents. For every parallel wave, make exactly one top-level asynchronous `workflowScript` call and launch the independent workers inside it with `runs.all`.

## Steps

1. Read the spec and tickets. Read enough to understand the task graph, blocking relationships, acceptance criteria, and current frontier.

2. Use an exploration subagent when tickets need shared codebase or external research. Keep exploration read-only. Save durable notes in a named artifact or repository research path that every later worker can read.

3. Create the integration branch and draft pull request. Mark the pull request as closing the spec issue and its tickets. Record the validation commands that the completed branch must pass.

4. Before parallel implementation, record a lane board with one row per frontier ticket: ticket, repository, claimed files or contract, worktree, worker authority, validation, and integration gate. Combine tickets that would edit the same source seam.

5. Launch one implementation wave. Give each worker a distinct ticket, a managed Git worktree, explicit acceptance criteria, context pointers, validation commands, and a useful handoff contract. Use stable child keys, `worktree: true`, and `async: true`. Each worker must return its commit, changed files, commands run, validation evidence, residual risks, and decisions needing parent approval.

6. Integrate completed tickets sequentially into the pull-request branch. Use one merger worker as the sole writer on that branch, or merge in the parent while no child owns it. Resolve conflicts by intent, run the affected gates after each merge, and keep failed tickets off the completed set.

7. Recompute the frontier after every integration wave. Launch another single asynchronous `workflowScript` wave for newly unblocked tickets. Continue until every ticket is complete or a user-owned decision blocks progress.

8. Run `/skill:matt-review` against the pull-request branch. Review Standards and Spec separately. Give one fix worker the accepted findings, then rerun the affected validation and any focused review warranted by substantial fixes.

9. Mark the pull request ready for review only when all tickets are complete, required checks pass, and review findings are resolved or explicitly deferred.

10. Clean up implementation worktrees only after their commits and handoffs are durable and no active run owns them. Report the pull request, completed tickets, validation evidence, deferred findings, and remaining risks.
