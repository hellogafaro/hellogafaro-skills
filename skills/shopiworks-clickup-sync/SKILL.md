---
name: |-
  shopiworks-clickup-sync
description: |-
  Use when importing Minicoton or Somomu ClickUp requests assigned to Johan into Notion, or publishing verified Notion work and Timesheets to the provider's ClickUp tasks in Spanish.
notion_page_id: 3dffc798-2e43-8174-ab15-e851ed1722b5
---

# shopiworks-clickup-sync

Follow ClickUp intake, Notion execution, then ClickUp client-facing updates for the live Projects `Minicoton` and `Somomu`. Include another Project only when the user explicitly adds it. ClickUp is a customer input source like email, not an equal source of truth. Notion owns internal execution, status, completion, and Timesheets.

Use `tasks-operations` with the selected Notion connection for every Notion task, Project, completion, and Timesheet operation. Use Composio for every ClickUp read and write through the current host's supported interface. Never bypass it with another connector, token, or ad hoc API call.

Apply `unslop` to all English and Spanish prose. Write concise natural English in Notion and concise natural neutral Spanish for the external provider in ClickUp. Rewrite for the reader rather than copying raw Spanish into Notion or raw English into ClickUp.

## Resolve the scope

Determine whether the user wants intake, publication, or both. Do only the authorized parts. Use the requested tasks, Projects, dates, and range. For a weekly publication, use the user's current week and verified timezone unless specified otherwise. Ask one focused question when scope or a required fact remains materially ambiguous, or skip and report the affected item.

For intake, resolve Johan live and read the assigned ClickUp requests, descriptions, relevant comments, attachments, and links. Do not apply the outbound completed-work filter to intake. For publication, query relevant Notion tasks, result comments, deliverables, and Timesheets. Default to completed work supported by Timesheets. Publish incomplete work only when requested.

Resolve the live Notion Projects and required schemas through `tasks-operations`. Through the intended Composio connection, discover ClickUp's workspace, space, folder, lists, statuses, members, task fields, and time-entry schema. Match Project destinations by live name and hierarchy. Never guess or store mutable IDs, status labels, or member mappings in this skill. Follow pagination until the scoped search, comments, and time entries are complete.

## Match before creating

Use the canonical ClickUp URL or task ID recorded on Notion as the durable match. Verify that the linked task owns the same outcome and Project. Do not match by title alone.

For intake, search Notion for that URL or ID first, then search the resolved Project by outcome and relevant terms. Read plausible tasks and their comments before creating, including completed, thin, or stale records outside the intake period. For publication without a recorded match, search the confirmed ClickUp list and read plausible matches. Ambiguous or conflicting matches need input, not another task.

Reuse the existing task for the same outcome. When first matched or created, record the canonical ClickUp URL once in a concise English Notion confirmation comment. Check existing content and comments first. Reuse a URL already recorded rather than adding it again, and do not add it to the task body. Fetch the comment to verify the link.

Read current tasks, comments, and time before writing. Skip unchanged content and comments whose meaning is already present. After an uncertain write in either system, read current state before retrying. Never replay a write blindly or delete tasks or time entries.

## Bring requests into Notion

A ClickUp task assigned to Johan is customer input to review, not proof of work performed. Import only a clear request with an owned outcome. Do not create work from passive discussion, vague ideas, or unowned comments.

Create one Notion task per real outcome, or update the matched task. Follow all `tasks-operations` rules. Use a concise verb-led sentence-case title, normally no more than 12 words, and a short useful body explaining the work, why it matters, and verified context needed to execute it. Preserve useful source links, constraints, and decisions without copying the conversation or repeating properties.

Resolve Owner and Assignee separately through live users. Johan's ClickUp assignment can establish the executor only after a verified Notion user match. It does not establish the accountable Owner. Before assigning, follow the workload checks in `tasks-operations`.

An active task needs Name, Owner, Assignee, Project, Priority, Status, Recurrence, and Due date using live properties and options. Only confirmed backlog work may omit Due date. Preserve a real deadline, priority, or intake status only when its meaning and mapping are clear. Never invent missing fields or silently default a date, timezone, person, recurrence, or status. Ask one focused question or skip and report when required information is missing.

External comments and statuses are request context. They must not silently override verified Notion execution state. A closed ClickUp task is not proof of internal completion. Reopening, cancellation, or other execution changes need a confirmed decision or execution evidence handled through `tasks-operations`. Preserve confirmed dates and actual time exactly as recorded there. Do not import ClickUp time as internal actuals.

Fetch each affected Notion page after writing. Confirm its English content, required properties, relations, and canonical ClickUp match before any authorized publication.

## Publish verified work to ClickUp

Update the already matched ClickUp task. Create one only for an authorized Notion outcome with no existing match after searching. Preserve useful customer-authored request context. Do not overwrite it with an internal task dump.

Write Spanish titles, descriptions, and useful comments for the provider. Include only the status, changes, decisions, constraints, checks, results, deliverables, and client-safe links they need. Keep the text short and easy to scan. Do not mention Notion, synchronization, internal workflows, private discussion, internal-only links, credentials, or unsupported claims.

Map a verified Notion state only to a live ClickUp status with the same meaning. Add a short completion comment only when it adds useful result context not already present. Do not repeat the task body or an existing comment. Close ClickUp only after verifying Notion completion and its outcome. Never infer completion, ownership, dates, or time from an external status.

If completed Notion work lacks required time or useful completion evidence, repair it through `tasks-operations` only when authorized and the facts are confirmed. Otherwise skip and report the affected publication. Do not reopen completed Notion work to repair missing time.

For time, read existing ClickUp entries first. Reconcile them against verified Notion Timesheets by task, exact date, minutes, person, and work described. Compare entries and per-date totals so a wording change or an existing aggregate does not duplicate time. Preserve the exact Notion dates and minutes without rounding again. Use confirmed timestamps and timezone when the live schema requires them. Never invent a start time. Skip and report unclear overlaps or missing required fields rather than adding guessed differences. Keep entries non-billable unless explicitly requested.

## Verify and report

Fetch every affected task, comment, and time entry after writing. Confirm Notion properties and English content, ClickUp destination and Spanish content, status, safe links, exact dates and minutes, the requested billing flag, and the single canonical match. Rerunning the same scope must add no duplicate tasks, comments, or time.

Report only changed, skipped, failed, or needs-input items in lettered Project groups with numbered items. Identify the direction and what changed, or the reason and missing input. Include canonical task links and exact minutes only when relevant. Omit unchanged items.

```txt
A. Minicoton
   1. Task title · Changed · ClickUp to Notion · Created request · Notion URL · ClickUp URL

B. Somomu
   1. Task title · Changed · Notion to ClickUp · Published result · 60 min · ClickUp URL
```

Finish when every authorized intake or publication is verified without duplicates, or reported with its blocker. Notion must remain the execution record throughout.
