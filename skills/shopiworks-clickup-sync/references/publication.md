# Publish verified work to ClickUp

## Publish verified work to ClickUp

Update the already matched ClickUp task. Create one only for an authorized Notion outcome with no existing match after searching. Preserve useful customer-authored request context. Do not overwrite it with an internal task dump.

Write Spanish titles, descriptions, and useful comments for the provider. Include only the status, changes, decisions, constraints, checks, results, deliverables, and client-safe links they need. Keep the text short and easy to scan. Do not mention Notion, synchronization, internal workflows, private discussion, internal-only links, credentials, or unsupported claims.

Map a verified Notion state only to a live ClickUp status with the same meaning. Add a short completion comment only when it adds useful result context not already present. Do not repeat the task body or an existing comment. Close ClickUp only after verifying Notion completion and its outcome. Never infer completion, ownership, dates, or time from an external status.

If completed Notion work lacks required time or useful completion evidence, repair it through `tasks-operations` only when authorized and the facts are confirmed. Otherwise skip and report the affected publication. Do not reopen completed Notion work to repair missing time.

For time, read existing ClickUp entries first. Reconcile them against verified Notion Timesheets by task, exact date, minutes, person, and work described. Compare entries and per-date totals so a wording change or an existing aggregate does not duplicate time. Preserve the exact Notion dates and minutes without rounding again. Use confirmed timestamps and timezone when the live schema requires them. Never invent a start time. Skip and report unclear overlaps or missing required fields rather than adding guessed differences. Keep entries non-billable unless explicitly requested.

## Comment mentions do not work through Composio

ClickUp comments written through Composio (`CLICKUP_CREATE_TASK_COMMENT`, `CLICKUP_UPDATE_COMMENT`) only accept plain `comment_text`. Typing `@Name` in that text posts as inert plain text, not a real ClickUp mention. ClickUp's own API supports mentions through a separate `comment` array field with `type: tag` user objects, but Composio's wrapper silently drops that field even when supplied, confirmed by testing on a live task. Do not write `@Name` expecting a working mention. To notify the person instead, set the comment's `assignee` field to their ClickUp user ID, which triggers ClickUp's own comment-assignment notification.
