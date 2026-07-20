# Task queries

Use the local Composio CLI and the live Notion connection for every task query or update.

## Connection and schema

1. List live Notion connections.
2. Select the intended workspace explicitly with `--account` when more than one exists.
3. Find the Tasks database by name with `NOTION_SEARCH_NOTION_PAGE` or `NOTION_FETCH_DATA`.
4. Inspect the live schema with `NOTION_FETCH_DATABASE` before building filters or properties.
5. Never reuse a database ID, data-source ID, property name, option, or relation target without verifying it live in the current workspace.

## Search before creating

Query likely matches with `NOTION_QUERY_DATABASE_WITH_FILTER`. Search by title, project, owner, assignee, and active status as needed. Paginate until `has_more` is false.

If a likely duplicate exists, surface it and update it when it owns the same work.

## Create a task

Use `NOTION_INSERT_ROW_DATABASE` for the verified Tasks database. Set every required property from the fetched schema and use only verified relation row IDs and people values.

After creation, fetch the created row and confirm persisted values.

## Update a task

Fetch the current row immediately before the write. Use `NOTION_UPDATE_ROW_DATABASE` to update only intended properties.

Only update status after the responsible person confirms it or the source explicitly proves it.

Verify the row after every update. Treat a nominal HTTP success with `successful: false` as a failure.

## Active-count check

Query live Tasks for the intended Assignee where Status is In progress, Under review, or Blocked. Paginate fully and count the returned rows before assigning more work.

## Done-without-time check

Query live Tasks where Status is Done. Treat a task with an empty live Time tracked relation as missing a time entry.
