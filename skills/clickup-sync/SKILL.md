---
name: clickup-sync
description: Use when work involves syncing completed Shopiworks or Jol Ebrahim tasks from Notion to ClickUp, including task lookup, task creation, completion, manual time logging, and value-focused ClickUp comments.
---

# clickup-sync

Use this skill when a completed Notion task must be reflected in the Jol Ebrahim ClickUp workspace.

This skill is for Shopiworks client work. It is not for general Hello Gafaro task management.

## Sources

Read `references/clickup-worker.md` before calling the worker.

Use the Notion task, project, and linked timesheet as source. ClickUp is the client-facing mirror.

## Hard rules

- Sync completed tasks only.
- Do not create or update ClickUp without confirmed Notion time.
- Existing ClickUp task link or ID wins before search or create.
- ClickUp output is Spanish.
- Every synced ClickUp task ends done.
- Every synced ClickUp task gets the matching manual time entry.
- Every synced ClickUp task gets one value-focused Spanish completion comment.
- Every synced Notion task gets one comment confirming the ClickUp task ID or link.
- Use the worker, not Composio, for ClickUp operations.
- The ClickUp map is guidance only, not a hard gate.

## Workflow

1. Read the Notion task and confirm Status is Done.
2. Confirm the Project belongs to Shopiworks, Minicoton, Somomu, or related Jol Ebrahim work.
3. Confirm linked time exists in Timesheets.
4. Read the source context needed to explain the problem and solution.
5. If a ClickUp task ID or URL exists, call `getTask` and verify it matches.
6. If no ClickUp task exists, call `getMap`, search when needed, and choose the best destination list.
7. Call `syncCompletedTask` with the task title, ClickUp task ID or list ID, date, minutes, problem, solution, implementation, references, and Notion URL.
8. Comment on the Notion task with the ClickUp task ID or link and confirm it was completed and successfully replicated on ClickUp.
9. Report only changed, failed, or needs input.

## Comment quality

The ClickUp completion comment must explain value, not just state completion.

Use this shape:

1. Problema. What was failing, confusing, blocked, or needed improvement.
2. Solución. What was fixed or implemented.
3. Implementación. Practical technical detail when useful.
4. Referencia. Commit, pull request, GitHub link, Notion source, or other useful reference when available.

Keep comments clear enough for a client and technical enough to show the work was real.

## Stop conditions

Stop and ask when the task lacks project, time, destination, or enough context to explain the problem and solution.

Stop if the worker reports `CLICKUP_API_TOKEN is missing`.

Stop if an existing ClickUp link does not match the Notion task context.
