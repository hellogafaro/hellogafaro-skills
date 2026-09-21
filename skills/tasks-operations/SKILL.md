---
name: |-
  tasks-operations
description: |-
  Use when Notion work involves finding, creating, updating, completing, or reviewing tasks; extracting tasks from Meetings or Documents; planning workload; or logging and reporting task or meeting time.
notion_page_id: 3dffc798-2e43-81a1-a8a0-da8a2bb83323
---

# tasks-operations

Notion is the task system. Do not route this work through Linear, ClickUp, or another task system. Meetings and Documents are read-only sources for task context and time attribution. Never schedule or manage meetings or create or manage documents through this skill.

## Sources

| Source | Purpose | ID |
| --- | --- | --- |
| Tasks | Work records and status | `25ffc7982e4380c58df6fef037530baa` |
| Projects | Project context and workload commitments | `25ffc7982e438086a264e63214fd1a60` |
| Timesheets | Actual task and non-task time | `f2cc8e0db76a4e84a58d30df91bca65c` |
| Meetings | Read-only task and time context | `25ffc7982e438056969fff6a4672eaaa` |
| Documents | Read-only task context | `25ffc7982e438074aa69ecc16e69ada9` |

Use these database IDs as discovery entry points. Fetch a source's current database and data-source schema before querying or writing it during a run, then use the connector's current queryable ID. If an ID fails, rediscover the source by title. Never guess or store view IDs, page IDs, user IDs, property names, relation targets, templates, or options.

## Records

Use the selected Notion connection. Resolve live property names and option values. Never write formulas or read-only properties. Resolve Owner and Assignee through workspace users. Owner is the human accountable for the work; Assignee executes it.

Search before creating. Update the existing record when it owns the same work, even when thin or stale. Read related Projects, Meetings, Documents, tasks, and source links only when they affect scope, ownership, timing, or execution.

Apply an exact routine change when the user identifies the record and action. For ambiguous or bulk changes, workload judgment, unclear ownership, or a missing fact that could change the result, inspect Notion and ask one focused question. Never assume project, people, dates, duration, status, or relations.

After a write, fetch the affected page and confirm the change persisted. If the result is uncertain, read current state before retrying. Do not retry through another connector. Use the fetched canonical Notion page URL in output. Do not expose raw query URLs that omit `/p/`.

## Tasks

Create one task per real outcome. Do not turn vague ideas, passive information, or unowned discussion into tasks. An active task needs a clear name, Owner, Assignee, Project, Priority, Status, Recurrence, and Due date. Backlog work may omit the due date.

Start titles with a verb when natural. Use sentence case, normally no more than 12 words. Avoid colons, filler, and client or project names unless needed for clarity.

Write a short body with the work, why it matters, and enough context to execute it. Add constraints, evidence, unknowns, source pages, assets, files, or the GitHub repository only when useful. Do not repeat properties, prescribe obvious steps, speculate, or pad the task with generic sections or checklists. Add acceptance criteria only when they clarify done.

Internal tasks use English unless the user asks otherwise. Project language applies to client-facing work, not internal records by default.

Record a blocker only when a concrete condition prevents progress. Name its owner and smallest unblocking action. Change status when the user requests it or the source proves the new state. Cancel only from an explicit request or confirmed decision, and preserve the reason.

Extract only confirmed actions from Meetings, Documents, email, notes, or plans. Preserve real owners, dates, decisions, dependencies, constraints, and useful source links. Discussion alone is not work. For large requests, create the fewest tasks that represent distinct outcomes; use now, next, and later only when sequencing helps.

For work from a Meeting, read its Project relation. Use the single linked Project for tasks and time. If none or more than one is linked, ask which Project owns the work. Do not edit the Meeting. Keep other source systems read-only; use their specialist skill for any separately authorized change.

For work recorded after completion, write the task as it would originally have been assigned. Use the actual completion date for Due date and Timesheet date. When the date is missing, ask `Was this completed today?`; if not, ask for the date. Never default silently.

## Workload

Inspect the Project before planning or assignment. Use relevant ownership, client, status, dates, monthly hours, billing cycle, language, services, platforms, tasks, meetings, and documents.

Before assigning, review the Assignee's overdue work, due work for the week and month, active states, priority mix, project spread, and tracked time. Three or more active tasks is a warning, not proof of overload. State the conflict and recommend what to finish, move, reassign, or cancel.

Task counts are workload signals, not hour estimates. Use Timesheets for actual time and verified Project monthly hours for commitment context. Do not infer effort, untracked work, remaining hours, or balanced capacity.

For period or team reviews, include overdue carryover and separate overdue, today, later this week, later this month, future, and active undated work. Compare Owner with Assignee. Check deadline clusters, stale task debt, high-priority ordering, blocked work, recurring work, project spread, and tracked time by person and Project. When the data cannot support a capacity claim, name what is missing.

Start with `balanced`, `tight`, `overloaded`, or `unreliable`, followed by the main reason. Present tasks in lettered Project groups and numbered lists, ordered by operational urgency; use `Unassigned / Internal` when no Project exists. End with no more than three prioritized rebalance recommendations.

## Task journal and artifacts

Use each part of a task for one job. Properties hold operational state. The body holds the accepted current truth, including scope, definition of done, current implementation, blocker, next action, and durable links. Comments preserve the conversation and evidence over time. Update the body when accepted feedback makes it stale; do not turn it into a chronological log.

Record feedback, reviewable revisions, approvals, rejections, corrections, blocker changes, pushes, deployments, and final verification when they matter to someone following the task. Skip repeated handoffs and internal telemetry that changes nothing for the reader. Before posting, fetch the body and discussions and compare the new result with existing commits, approvals, artifacts, and state.

Reply to the discussion that owns the continuing conversation. Start a new page-level discussion only when the subject changes. A local revision and its later approved push may be separate replies when the approval between them matters, but the second reply must add only the new fact. Do not repeat the branch, tests, caveats, and history.

Treat specialist handoffs as internal evidence, not publishable copy. Write fresh prose in the task's language and apply `unslop`. State what changed, which feedback it addresses, what a teammate can review, and the next real step. Weave useful links into sentences. Keep agent names, command output, raw branch choreography, repeated test counts, and machine-local paths out of the comment. Put detailed QA in an attached report when it remains useful.

Upload every new or revised artifact named in the handoff. Keep repository commits, pull requests, and other durable source records as links. Turn a local HTML preview, image, video, PDF, archive, or report into a Notion attachment; never leave its local path as the only record. For small text files use the Notion attachment content upload. For local binary files use the Notion local file-upload flow, then attach the resulting upload. Use a direct public URL when it is already durable and needs no headers.

When a local file exceeds the MCP's 20 MiB limit, keep the original at its canonical source and create a review copy below the limit with format-appropriate compression or transcoding. The copy must preserve the text, captions, legibility, behavior, or visual evidence people need to review. Do not overwrite the original or optimize a file that already fits. Use `ntn` only when the exact original must be attached and cannot reasonably fit below the limit. Inject its credentials from the verified Sidekick Infisical project, and create the attachment or comment with the same Notion integration that uploaded it. Never mix file-upload IDs across integrations.

A comment supports three attachments. When an event has more, add the fewest natural replies needed in the same discussion. Attach changed files once; reference the earlier Notion attachment when a later event reuses an unchanged file.

After writing, fetch the page and affected discussion again. Confirm the body, properties, reply placement, links, and attachments. If the result is uncertain, read current state before retrying. A task journal update is complete only when Notion contains the human explanation and the evidence needed to review it without access to the agent's machine.

## Time and completion

Record actual time only in Timesheets. Ask when duration is missing and never infer it. Round reported time up to the next 15 minutes.

A task entry needs the task reference as its name, Owner, Task, Project, Date, and Minutes. A non-task entry such as a meeting omits Task, uses a short description, and uses the Meeting's single verified Project. Never set calculated Hours.

Before marking a task Done, verify the outcome, create and verify the time entry, then update Status. Add a concise result comment only when it preserves useful context such as what changed, what was found, the cause and fix, a decision, limitation, commit, pull request, file, or deliverable. Apply `unslop`: use plain factual prose and useful links without template labels, filler, or repetition of the task body. Repair missing time without reopening completed work.

For reports, query Timesheets for the requested dates, total Minutes, and group by the requested Project, person, task, day, week, or month.

Finish when the correct Notion records match the request, no duplicate exists, required relations are set, authorized status changes persisted, and time is in Timesheets.
