# ClickUp worker

Use the Notion worker in `workers/shopiworks-clickup-sync`.

## Worker tools

- `getMap` returns the Jol Ebrahim ClickUp map.
- `formatCompletionComment` previews the Spanish completion comment.
- `getTask` fetches a ClickUp task by ID.
- `searchTasks` searches tasks across the workspace and returns compact matches.
- `completeTask` marks an existing task done.
- `logTime` creates a manual time entry.
- `commentTask` adds a ClickUp task comment.
- `syncExistingCompletedTask` marks an existing task done, logs time, and comments.
- `createCompletedTask` creates a completed task, logs time, and comments.
- `syncCompletedTask` is the advanced nullable-field tool. Avoid it unless the simple tools cannot express the case.

## Main call

Use `syncExistingCompletedTask` when a ClickUp task ID or link already exists.

Use `createCompletedTask` when no ClickUp task exists and the destination list is confirmed.

Do not call `completeTask`, `logTime`, and `commentTask` separately for the normal flow. The main tools already do all three writes in order.

Required input:

- `notionTaskTitle`
- `notionTaskUrl`, use an empty string when unavailable.
- `problem`
- `solution`
- `implementation`, use an empty string when not useful.
- `referencesText`, use commit links, PR links, Notion links, or an empty string.
- `minutes`
- `date`

Additional required input:

- `clickupTaskId` for `syncExistingCompletedTask`.
- `listId` for `createCompletedTask`.

Main tool output:

- `taskId`
- `taskUrl`
- `status`
- `timeLoggedMs`
- `createdTask`
- `markedDone`
- `loggedTime`
- `commented`
- `comment`

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
