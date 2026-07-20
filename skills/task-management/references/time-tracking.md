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

## Resolve the live schema

Use the selected Composio Notion connection.

1. Discover the Timesheets database live.
2. Inspect its schema with `NOTION_FETCH_DATABASE`.
3. Confirm the exact title, Owner, Task, Project, Date, and Minutes property names and types.
4. Resolve task, project, meeting, and people values from live rows or workspace users.

Never store or reuse workspace IDs in the skill.

## Log task time

Use `NOTION_INSERT_ROW_DATABASE` with the verified Timesheets database and schema.

The entry needs the task title or reference as its title, the responsible Owner, the Task relation, the Project relation, the work date, and the rounded Minutes value. Do not set formula properties.

## Log meeting time without a task

Use one clear sentence-case title, no Task relation, and the meeting page's single verified Project relation.

Fetch the created row after every write and confirm that relations, date, and minutes persisted.
