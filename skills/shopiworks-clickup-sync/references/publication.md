# Publish verified work to ClickUp

## Publish verified work to ClickUp

Update the already matched ClickUp task. Create one only for an authorized Notion outcome with no existing match after searching. Preserve useful customer-authored request context. Do not overwrite it with an internal task dump.

Write Spanish titles, descriptions, comments, and time entry notes for the provider. Include only the status, changes, decisions, constraints, checks, results, deliverables, and client-safe links they need. Keep the text short and easy to scan. Do not mention Notion, synchronization, internal workflows, private discussion, internal-only links, credentials, or unsupported claims.

Map a verified Notion state only to a live ClickUp status with the same meaning. Add a short completion comment only when it adds useful result context not already present. Do not repeat the task body or an existing comment. Close ClickUp only after verifying Notion completion and its outcome. Never infer completion, ownership, dates, or time from an external status.

If completed Notion work lacks required time or useful completion evidence, repair it through `tasks-operations` only when authorized and the facts are confirmed. Otherwise skip and report the affected publication. Do not reopen completed Notion work to repair missing time.

## Tag the right person

Use the connected ClickUp MCP's dedicated tools: `clickup_get_task`, `clickup_get_task_comments`, `clickup_create_comment`, and `clickup_update_comment`. To give someone a real, clickable mention (not inert `@Name` text), resolve their numeric user ID first with `clickup_resolve_assignees` or `clickup_get_workspace_members`, then write the mention inline inside `comment_text` as `[@Name](#user_mention#USER_ID)`. Also set the comment's `assignee` field to that same user ID; it notifies them independently of the inline mention and shows as "Assigned to X" on the comment.

`clickup_get_task_comments` does not echo the name back inside a rendered mention's `comment_text` (it reads as surrounding blank space where the mention sits); that is a read-side quirk of that getter, not proof the write failed or succeeded. Confirm a mention visually in the ClickUp UI when it matters, do not infer success or failure from the getter's text alone.

## Sync time on every publication

A ClickUp publication is a full sync, adapted to ClickUp's own time-tracking fields. Whenever a Notion Timesheets entry is new or changed for the task being published, mirror it to ClickUp with `clickup_add_time_entry` (or fix an existing one through Composio's `CLICKUP_UPDATE_TIME_ENTRY` until this MCP exposes an update/delete tool for time entries). Read existing entries first with `clickup_get_time_entries` scoped to the task. Reconcile them against verified Notion Timesheets by task, exact date, minutes, person, and work described. Compare entries and per-date totals so a wording change or an existing aggregate does not duplicate time. Preserve the exact Notion dates and minutes without rounding again. Use confirmed timestamps and timezone when the live schema requires them. Never invent a start time. Skip and report unclear overlaps or missing required fields rather than adding guessed differences. Keep entries non-billable unless explicitly requested, and write the entry's description in Spanish, same as the task.
