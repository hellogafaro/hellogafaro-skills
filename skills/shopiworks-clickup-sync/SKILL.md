---
name: |-
  shopiworks-clickup-sync
description: |-
  Use when replicating verified Minicoton or Somomu work from Notion tasks and Timesheets into the external provider's ClickUp workspace in Spanish.
notion_page_id: 3dffc798-2e43-8174-ab15-e851ed1722b5
---

# shopiworks-clickup-sync

Notion is the internal work record. ClickUp is the external provider's client-facing record. Replicate verified work for the live Notion Projects named `Minicoton` and `Somomu`. Do not include another Project unless the user explicitly adds it to the request.

Use `tasks-operations` with the selected Notion connection for Project, task, completion, and Timesheet context. Use Composio for every ClickUp read and write through whichever supported interface the current host exposes. Do not bypass Composio with another connector, token, or ad hoc API call.

## Resolve the scope

Use the exact date or range requested. For a weekly sync, use the user's current week and timezone unless they specify another period. Default to completed work supported by Timesheets. Include incomplete tasks only when requested.

Resolve the live Minicoton and Somomu Projects in Notion. Query their relevant tasks and Timesheets for the period. Group Timesheet minutes by task and date. Read each task, its result comments, useful links, and related context that changes what the external provider should know.

Do not infer missing completion dates, time, ownership, Project, or outcome. If a task is Done without the required Timesheet or useful completion context, repair the Notion record through `tasks-operations` only when authorized. Otherwise report the missing fact and skip that part of the ClickUp write.

## Resolve ClickUp

Use the intended Composio ClickUp connection. Discover the current workspace, space, folder, list, statuses, members, tasks, and time-entry schema at runtime. Never store or guess mutable IDs, status labels, or member mappings.

Resolve the destination for each Project by live name and hierarchy. Ask one focused question if more than one destination is plausible. Reuse a verified ClickUp task URL or ID already recorded in Notion. Otherwise search the confirmed list before creating and read every plausible match. A thin or stale mirror should be updated, not duplicated.

After an uncertain Composio result, read the destination before retrying. Never replay a write blindly. Do not delete ClickUp tasks or time entries through this workflow.

## Write client-facing work

Create one ClickUp task per real Notion outcome. Write the title, description, completion comment, and any useful links in natural neutral Spanish. Apply `unslop`.

Include as much verified execution context as the provider needs: the requested outcome, why it mattered, what changed, relevant decisions, constraints, checks, results, deliverables, and client-safe source links. Keep the description easy to scan. Use short paragraphs and bullets only when they help.

Do not mention Notion, synchronization, internal workflows, private discussion, internal-only links, credentials, or unsupported claims. Do not copy raw English titles or internal task text. Do not repeat the task body in the completion comment.

For completed work:

1. Create or update the matching ClickUp task.
2. Add a short Spanish completion comment when it preserves useful result context.
3. Set the task to the live closed status only after verifying the Notion outcome is complete.
4. Replicate confirmed Timesheet entries with their exact date and minutes. Keep entries non-billable unless the user explicitly says otherwise.

Read existing ClickUp time entries before writing. Match by task, date, duration, and description so rerunning the period does not create duplicates.

## Confirm the result

Fetch every affected ClickUp task and time entry after writing. Confirm the Project destination, Spanish content, status, links, dates, and minutes.

When a ClickUp task was created or first matched, add one concise English confirmation comment to the Notion task with its canonical ClickUp URL. Do not add the URL to the Notion task body or repeat the comment on later runs.

Report results in lettered Project groups with numbered items:

```txt
A. Minicoton
   1. Task title · Created · 60 min · ClickUp URL

B. Somomu
   1. Task title · Updated · ClickUp URL
```

Show only changed, skipped, failed, or needs-input work. Finish when each authorized item has one verified ClickUp task, no duplicate time, client-safe Spanish context, and a canonical URL recorded in Notion.
