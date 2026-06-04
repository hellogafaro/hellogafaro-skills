# ClickUp worker

Use the Notion worker in `workers/clickup-sync`.

## Worker tools

- `getMap` returns the Jol Ebrahim ClickUp map.
- `formatCompletionComment` previews the Spanish completion comment.
- `getTask` fetches a ClickUp task by ID.
- `searchTasks` searches tasks across the workspace.
- `completeTask` marks an existing task done.
- `logTime` creates a manual time entry.
- `commentTask` adds a ClickUp task comment.
- `syncCompletedTask` creates or updates a task, marks it done, logs time, and comments.

## Main call

Use `syncCompletedTask` for normal completed-task sync.

Required input:

- `notionTaskTitle`
- `problem`
- `solution`
- `minutes`
- `date`

Use either:

- `clickupTaskId` when the task already exists in ClickUp.
- `listId` when creating a new ClickUp task.

Recommended input:

- `notionTaskUrl`
- `implementation`
- `references`
- `assigneeIds`
- `priority`

## Map notes

Workspace is Jol Ebrahim. Team ID is `20421257`.

Account label is `jolebrahim`.

The map is guidance only. Search ClickUp when the destination is not obvious.

Closed statuses found are `cerrada` and `Closed`.

Validated example:

- `869djg7ff` is `Problema con el Charm ABC de colour me`.
- It lives in `Apps > Colour me`.
- It is closed as `cerrada`.
- It has `3600000` milliseconds tracked.
