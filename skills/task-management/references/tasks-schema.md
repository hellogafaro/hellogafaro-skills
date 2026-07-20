# Tasks schema

Resolve every database, data source, relation target, user, property, and option live through the selected Composio Notion connection.

## Discovery

Discover Tasks, Projects, Meetings, Timesheets, and Team by name. Fetch each database schema before querying or writing.

Do not hardcode database IDs, data-source IDs, page IDs, user IDs, property names, relation targets, or option labels in skills or `MEMORY.md`.

## Required task concepts

The live Tasks schema must provide equivalents for:

- Name or title.
- Owner: human supervisor accountable for the task.
- Assignee: person or agent executing the task.
- Project relation.
- Priority.
- Status.
- Due date.
- Recurrence.
- Assets when available.
- Time tracked relation.
- Read-only unique task ID.

Verify the allowed live Priority, Status, and Recurrence values before every write. The values documented in the main skill are expected business values, not a substitute for schema inspection.

## Projects

Inspect Projects live before planning. Workload planning needs project status, monthly hours commitment, billing date or cycle anchor, language, and whether the project is internal. Flag missing or unclear fields before using the project in a workload decision.

## Meetings

For tasks or time from a meeting page, read its live Project relation first. Use that project when exactly one is linked. If empty, ask for the project and update the meeting before creating task or time records. If multiple projects are linked, ask which one owns the task or time entry.

## Resolving people and agents

Owner and Assignee use the live people values required by the current Tasks schema, not Team row IDs.

Use Team to choose the right supervisor or executor by capability, then resolve the required workspace user value live.

## Naming note

Tasks use Owner for the supervisor and Assignee for the executor. `INBOX.md` is a local checkpoint, not a database. Local handoff packets must point back to the durable task or source.
