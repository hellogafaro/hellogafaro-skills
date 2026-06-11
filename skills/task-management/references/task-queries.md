# Task queries

Use `ntn` for task queries and updates.

```
ntn <args>
```

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

## Update status

Only update status after the owner confirms or the source explicitly proves the state.

```
ntn api /v1/pages/<task-page-id> -X PATCH -d '{
  "properties": {"Status": {"status":{"name":"In progress"}}}
}'
```

## Active-count check

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
