---
name: shopiworks-clickup-sync
description: Use when reading or changing client-facing Shopiworks work in ClickUp from Notion task and Timesheet context, including finding, creating, updating, completing, commenting on, or logging time against ClickUp tasks.
---

# shopiworks-clickup-sync

Use Notion as the daily work record and ClickUp as the client-facing mirror. Choose the smallest ClickUp operation that satisfies the request. Do not run a fixed end-to-end sync when one task creation, update, comment, or time entry is enough.

## References

- Use `task-management` for task, project, and time-tracking schema.
- Use `notion-operations` for Notion lookup, page links, updates, and confirmation comments.
- Read `references/clickup-operations.md` before running `scripts/clickup.ts`.
- Read `references/clickup-content.md` before writing ClickUp content.
- Read `references/clickup-routing.md` when the workspace, space, folder, list, status, or member is not already confirmed.
- Read `references/clickup-safety.md` before repairs or destructive actions.

## Hard rules

- Discover work from Notion Timesheets first when the request is a completed-work sync.
- No time entry without confirmed positive minutes.
- A ClickUp time-entry date must match the source Timesheet date.
- Use natural neutral Spanish for client-facing ClickUp content. Do not pass raw English Notion titles to ClickUp.
- ClickUp must never mention Notion, source systems, internal sync mechanics, or time-tracking minutes in task bodies or comments.
- Comments must add useful completion context and must not repeat the task title or description.
- Do not guess mutable workspace, list, status, member, task, or time-entry identifiers. Discover or confirm them at runtime.
- Read the exact target before any update, comment, time entry, or repair.
- After an uncertain write result, verify destination state before retrying. Never replay blindly.
- Notion confirmation comments are English and must contain the full ClickUp task URL.
- Add the ClickUp URL to one Notion confirmation comment, never to the Notion task body.

## Workflow

1. Resolve the requested action and its Notion context.
2. If this is completed work, query the selected day's Timesheets, group minutes by linked task, and continue only for tasks with Status `Done`.
3. Resolve the ClickUp destination or existing task. Search before creating when duplication is possible.
4. Read the relevant reference and run one or more focused `scripts/clickup.ts` commands.
5. Review the normalized JSON result. Verify any write whose result is incomplete or unclear.
6. When the workflow originated in Notion, leave one English Notion confirmation comment with the full ClickUp task URL.
7. Report only changed, failed, or needs-input items.

## Completion

- Changed: state the ClickUp action performed and target URL.
- Failed: state the exact missing mapping, connection, schema, or command error.
- Needs input: request only the missing target or decision required to proceed safely.

## Validation

After changing the adapter, run `bun test scripts/clickup.test.ts` from this skill directory.
