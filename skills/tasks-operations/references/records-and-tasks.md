# Records and tasks

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
