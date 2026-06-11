# Time tracking

Every completed substantive task needs time tracked.

- Log only against real tasks.
- Project relation is always required on time entries.
- Task relation is required when the work is task-related.
- Task relation is optional for non-task work such as meetings.
- When a task relation exists, the time entry title must be the task page reference.
- When no task relation exists, the title should be one clear sentence about what was done.
- Inbox items, reminders, alerts, and meeting prep placeholders are not tasks unless they link to a task page.
- If the item was only a reminder, remove or update it and do not create a time entry.
- Use 15-minute increments, rounded up.
- Task management counts.
- Context switching counts.
- If duration is unknown, ask before completing.
- For meeting time, read the meeting page Project relation first.
- If the meeting has one Project relation, use it for the time entry.
- If the meeting has no Project relation, ask for the project and update the meeting before logging time.
- If the meeting has multiple Project relations, ask which project owns the time.

## Log a time entry

`Name` is the title. `Minutes` is the canonical duration number. `Hours` is a formula, so do not set it. `Date` is editable and required for reporting.

Task-linked entries use a Notion task mention or task title as `Name`, plus `Task` and `Project`.

```
ntn api /v1/pages -d '{
  "parent": {"type":"data_source_id","data_source_id":"e6f1b1a0-0a27-434e-b220-00f79ee95859"},
  "properties": {
    "Name": {"title":[{"text":{"content":"Draft June email campaign"}}]},
    "Owner": {"people":[{"id":"<notion-user-id>"}]},
    "Task": {"relation":[{"id":"<task-page-id>"}]},
    "Project": {"relation":[{"id":"<project-page-id>"}]},
    "Date": {"date":{"start":"2026-06-04"}},
    "Minutes": {"number":45}
  }
}'
```

## Log meeting time without a task

Non-task meeting entries use one clear sentence-case name, no `Task`, and the meeting page `Project`.

```
ntn api /v1/pages -d '{
  "parent": {"type":"data_source_id","data_source_id":"e6f1b1a0-0a27-434e-b220-00f79ee95859"},
  "properties": {
    "Name": {"title":[{"text":{"content":"Met with Jol about Shopify size charts"}}]},
    "Owner": {"people":[{"id":"<notion-user-id>"}]},
    "Project": {"relation":[{"id":"<meeting-project-page-id>"}]},
    "Date": {"date":{"start":"2026-06-04"}},
    "Minutes": {"number":30}
  }
}'
```
