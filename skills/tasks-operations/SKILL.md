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

## Hard rules

- Search before creating. Update the existing record when it owns the same work, even when thin or stale.
- Never assume project, people, dates, duration, status, or relations. Ask one focused question when a missing fact could change the result.
- After a write, fetch the affected page and confirm the change persisted.
- Record actual time only in Timesheets. Ask when duration is missing and never infer it.

## Workflow

1. Resolve the live schema, Owner, and Assignee, then find, create, or update the task: [records-and-tasks.md](references/records-and-tasks.md).
2. Before assigning or planning, inspect the Project and the Assignee's load: [workload.md](references/workload.md).
3. Keep the task body, comments, and attachments current: [journal-and-artifacts.md](references/journal-and-artifacts.md).
4. Log time, mark Done, and report: [time-and-completion.md](references/time-and-completion.md).

Finish when the correct Notion records match the request, no duplicate exists, required relations are set, authorized status changes persisted, and time is in Timesheets.
