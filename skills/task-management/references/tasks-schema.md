# Tasks schema and query recipes

Exact ids, property types, and the `ntn` calls behind the task-management skill.

```
ntn <args>
```

## Database and data source ids

Notion 2025-09 keeps properties on the DATA SOURCE. Query the data source id; link relations by the page id of a row.

- Tasks: db `25ffc7982e4380c58df6fef037530baa`, data source `25ffc798-2e43-801b-9eed-000b4bc5f349`
- Projects: data source `25ffc798-2e43-80fe-acb3-000bc6d73ce7`
- Meetings: db `25ffc7982e438056969fff6a4672eaaa`, data source `25ffc798-2e43-805b-a32c-000b3f8ea454`
- Timesheets: data source `e6f1b1a0-0a27-434e-b220-00f79ee95859`
- Team: data source `18824c2f-3b29-4c8b-91ab-7e5010683a2a`
- Inbox: db `372fc7982e438049b196d61a407c314d`

## Tasks properties

- `Name` (title)
- `Owner` (people): the human supervisor accountable for the task
- `Assignee` (people): the person or agent executing the task
- `Project` (relation to Projects)
- `Priority` (select): High, Medium, Low
- `Status` (status): Backlog, Not started, In progress, Under review, Blocked, Done, Canceled
- `Due date` (date)
- `Recurrence` (select): One-time, Daily, Weekly, Monthly, Quarterly
- `Assets` (files)
- `Time tracked` (relation to Timesheets)
- `ID` (unique_id, read-only)

## Projects properties

Inspect the Projects data source live before planning. Dash needs, at minimum, the project status, monthly hours commitment, billing date or cycle anchor, language, and whether the project is internal. If any of these fields are missing or unclear, flag that gap before using the project in workload planning.

## Meetings properties

- `Name` (title)
- `Project` (relation to Projects)

For tasks or time from a meeting page, read the meeting `Project` relation first. Use that project for task creation and meeting time. If empty, ask for the project and update the meeting before creating task or time records. If multiple projects are linked, ask which one owns the task or time entry.

## Resolving people and agents

`Owner` and `Assignee` are people properties and take Notion user ids, not Team row ids.

Owner is usually a human supervisor. Assignee is the executing person or agent.

The Team database holds each person's or agent's Notion value. Use Team to choose the right owner or assignee by capability, then use its Notion people value in the task property.

To resolve a missing user id:

- List workspace users: `api /v1/users page_size==100`, then match by name.
- Use the Team database to pick who should supervise or execute the work, then resolve that Notion value.

## Create a task

```
ntn api /v1/pages -d '{
  "parent": {"type":"data_source_id","data_source_id":"25ffc798-2e43-801b-9eed-000b4bc5f349"},
  "properties": {
    "Name": {"title":[{"text":{"content":"Draft June email campaign"}}]},
    "Owner": {"people":[{"id":"<owner-user-id>"}]},
    "Assignee": {"people":[{"id":"<assignee-user-or-agent-id>"}]},
    "Project": {"relation":[{"id":"<project-page-id>"}]},
    "Priority": {"select":{"name":"Medium"}},
    "Status": {"status":{"name":"Not started"}},
    "Recurrence": {"select":{"name":"One-time"}},
    "Due date": {"date":{"start":"2026-06-15"}}
  }
}'
```

## Update status (only after the owner confirms)

```
ntn api /v1/pages/<task-page-id> -X PATCH -d '{
  "properties": {"Status": {"status":{"name":"In progress"}}}
}'
```

## Active-count check (the 3-active limit)

Query active tasks for one assignee and count the results:

```
ntn api /v1/data_sources/25ffc798-2e43-801b-9eed-000b4bc5f349/query -X POST -d '{
  "filter": {"and": [
    {"property":"Assignee","people":{"contains":"<assignee-user-or-agent-id>"}},
    {"or": [
      {"property":"Status","status":{"equals":"In progress"}},
      {"property":"Status","status":{"equals":"Under review"}},
      {"property":"Status","status":{"equals":"Blocked"}}
    ]}
  ]}
}'
```

## Done-without-time check

Query done tasks, then treat any with an empty `Time tracked` relation as missing a time entry:

```
ntn api /v1/data_sources/25ffc798-2e43-801b-9eed-000b4bc5f349/query -X POST -d '{
  "filter": {"property":"Status","status":{"equals":"Done"}}
}'
```

## Log a time entry (Timesheets)

`Name` is the title. `Minutes` is the canonical duration number. `Hours` is a formula, so do not set it. `Date` is editable and required for reporting. Log in 15-minute increments, rounding up.

Task-linked entries use a Notion task mention or task title as `Name`, plus `Task` and `Project`.

Non-task meeting entries use one clear sentence-case name, no `Task`, and the meeting page `Project`.

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

## Naming note

Tasks use `Owner` for the supervisor and `Assignee` for the executor. Inbox and Handoffs use their own fields. Use the real field name per database.
