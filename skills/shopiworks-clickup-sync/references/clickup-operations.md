# ClickUp operations

Run commands from the skill directory with Bun:

```bash
bun scripts/clickup.ts <command> -d '{"field":"value"}'
```

Use `-d @payload.json` for a file or `-d -` for stdin. Add `--dry-run` to validate and print the planned Composio call without executing it. Set `COMPOSIO_BIN` only when `composio` is not on `PATH`.

## Read commands

```bash
bun scripts/clickup.ts get-task -d '{"taskId":"TASK_ID"}'
bun scripts/clickup.ts search-tasks -d '{"listId":"LIST_ID","query":"texto","includeClosed":true}'
bun scripts/clickup.ts get-comments -d '{"taskId":"TASK_ID"}'
bun scripts/clickup.ts list-time -d '{"workspaceId":"WORKSPACE_ID","taskId":"TASK_ID","startDate":"2026-07-01","endDate":"2026-07-31"}'
bun scripts/clickup.ts get-workspaces -d '{}'
bun scripts/clickup.ts get-spaces -d '{"workspaceId":"WORKSPACE_ID"}'
bun scripts/clickup.ts get-folders -d '{"spaceId":"SPACE_ID"}'
bun scripts/clickup.ts get-folderless-lists -d '{"spaceId":"SPACE_ID"}'
bun scripts/clickup.ts get-list -d '{"listId":"LIST_ID"}'
```

`search-tasks` pages through one confirmed list and performs a case-insensitive title match locally. Narrow the list first instead of searching an entire workspace blindly.

## Write commands

```bash
bun scripts/clickup.ts create-task -d '{"listId":"LIST_ID","name":"Ajustar el flujo de compra","description":"Texto natural.","dueDate":"2026-07-18","assigneeIds":[123]}'
bun scripts/clickup.ts update-task -d '{"taskId":"TASK_ID","name":"Nuevo titulo","description":"Nueva descripcion"}'
bun scripts/clickup.ts complete-task -d '{"taskId":"TASK_ID"}'
bun scripts/clickup.ts add-comment -d '{"taskId":"TASK_ID","body":"Hice el ajuste y deje el flujo listo para revision."}'
bun scripts/clickup.ts log-time -d '{"workspaceId":"WORKSPACE_ID","taskId":"TASK_ID","date":"2026-07-18","minutes":60,"description":"Trabajo completado. Ajuste del flujo de compra."}'
```

`complete-task` reads the task and its list, selects the list status whose type is `closed`, then updates only the status. `add-comment` uses Composio's authenticated ClickUp proxy because the dedicated Composio comment tool requires assigning the comment; the proxy preserves an unassigned comment with `notify_all: false`. `list-time` also uses the authenticated proxy because the dedicated date-range tool does not reliably honor task filters on this connection. When both a task and dates are supplied, the script fetches that task's entries and applies the date bounds locally.

## Repair commands

```bash
bun scripts/clickup.ts delete-task -d '{"taskId":"TASK_ID","confirm":"DELETE TASK_ID"}'
bun scripts/clickup.ts delete-time -d '{"workspaceId":"WORKSPACE_ID","timeEntryId":"ENTRY_ID","confirm":"DELETE ENTRY_ID"}'
```

Read `references/clickup-safety.md` first. The exact confirmation string is mandatory.

## Composition

There is no all-in-one sync command. For completed work, compose only the required primitives in order: locate or create the task, complete it if needed, add the completion comment if needed, log confirmed time if needed, and then leave the Notion confirmation comment.
