# clickup sync worker

Notion worker for Shopiworks ClickUp sync.

It exposes a small, deterministic ClickUp API for completed Notion task sync:

- Read the fixed workspace map.
- Fetch ClickUp tasks by id.
- Search tasks.
- Create a completed task.
- Complete an existing task.
- Log manual time.
- Leave completion comments.
- Sync a completed Notion task in one call.

Prefer:

- `syncExistingCompletedTask` when the ClickUp task already exists.
- `createCompletedTask` when creating a new ClickUp mirror.

## Environment

Set `CLICKUP_API_TOKEN` in the worker environment before live execution.

The token must have access to the Jol Ebrahim ClickUp workspace.

## Local checks

```bash
npm install
npm run check
npm test
ntn workers exec -l getMap
```

Live calls require:

```bash
CLICKUP_API_TOKEN=... ntn workers exec -l getTask -d '{"taskId":"869djg7ff"}'
```
