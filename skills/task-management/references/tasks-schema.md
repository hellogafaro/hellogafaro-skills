# Tasks schema and query recipes

Exact ids, property types, and the `ntn` calls behind the task-management skill.

```
ntn <args>
```

## Database and data source ids

Notion 2025-09 keeps properties on the DATA SOURCE. Query the data source id; link relations by the page id of a row.

- Tasks: db `25ffc7982e4380c58df6fef037530baa`, data source `25ffc798-2e43-801b-9eed-000b4bc5f349`
- Projects: data source `25ffc798-2e43-80fe-acb3-000bc6d73ce7`
- Timesheets: data source `e6f1b1a0-0a27-434e-b220-00f79ee95859`
- Team: data source `18824c2f-3b29-4c8b-91ab-7e5010683a2a`
- Inbox: db `372fc7982e438049b196d61a407c314d`

## Tasks properties

- `Name` (title)
- `Owner` (people): the assignee, a Notion user
- `Agent` (relation to Team): AI-agent assignment, empty for human tasks
- `Project` (relation to Projects)
- `Priority` (select): High, Medium, Low
- `Status` (status): Backlog, Not started, In progress, Under review, Blocked, Completed, Canceled
- `Due date` (date)
- `Recurrence` (select): One-time, Daily, Weekly, Monthly, Quarterly
- `Assets` (files)
- `Time tracked` (relation to Timesheets)
- `ID` (unique_id, read-only)

## Projects properties

Inspect the Projects data source live before planning. Dash needs, at minimum, the project status, monthly hours commitment, billing date or cycle anchor, language, and whether the project is internal. If any of these fields are missing or unclear, flag that gap before using the project in workload planning.

## Resolving a person

`Owner` is a people property and takes a Notion user id, not a Team row. The Team database holds Name, Slack, and Role for the roster and for choosing an owner by capability. To map a Slack sender or a name to the Notion user:

- List workspace users: `api /v1/users page_size==100`, then match by name.
- Use the Team database to pick who should own the work (capability, role), then resolve that name to a user id as above.

## Create a task

```
ntn api /v1/pages -d '{
  "parent": {"type":"data_source_id","data_source_id":"25ffc798-2e43-801b-9eed-000b4bc5f349"},
  "properties": {
    "Name": {"title":[{"text":{"content":"Draft June email campaign"}}]},
    "Owner": {"people":[{"id":"<notion-user-id>"}]},
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

Query active tasks for one owner and count the results:

```
ntn api /v1/data_sources/25ffc798-2e43-801b-9eed-000b4bc5f349/query -X POST -d '{
  "filter": {"and": [
    {"property":"Owner","people":{"contains":"<notion-user-id>"}},
    {"or": [
      {"property":"Status","status":{"equals":"In progress"}},
      {"property":"Status","status":{"equals":"Under review"}},
      {"property":"Status","status":{"equals":"Blocked"}}
    ]}
  ]}
}'
```

## Completed-without-time check

Query completed tasks, then treat any with an empty `Time tracked` relation as missing a time entry:

```
ntn api /v1/data_sources/25ffc798-2e43-801b-9eed-000b4bc5f349/query -X POST -d '{
  "filter": {"property":"Status","status":{"equals":"Completed"}}
}'
```

## Log a time entry (Timesheets)

`Time` is the title and holds a duration string. Hours and Minutes are formulas that parse it, so do not set them. Accepted forms: `15m`, `30m`, `45m`, `1h`, `1h 30m`. Log in 15-minute increments, rounding up.

```
ntn api /v1/pages -d '{
  "parent": {"type":"data_source_id","data_source_id":"e6f1b1a0-0a27-434e-b220-00f79ee95859"},
  "properties": {
    "Time": {"title":[{"text":{"content":"45m"}}]},
    "Owner": {"people":[{"id":"<notion-user-id>"}]},
    "Task": {"relation":[{"id":"<task-page-id>"}]},
    "Project": {"relation":[{"id":"<project-page-id>"}]}
  }
}'
```

## Naming note

The spec calls the assignee field "Assignee". The Tasks database field is `Owner`. The Inbox database uses `Assignee`. They mean the same thing. Use the real field name per database.
