# shopiworks clickup sync worker

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

The sync path fills the required client-facing ClickUp fields every time:

- Closed status.
- Due date from the Notion timesheet date.
- Assignee, defaulting to Johan when no ClickUp assignee is provided.
- Non-billable time tracked from Notion Timesheets.
- A natural first-person Spanish completion comment.

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

Create a completed mirror task:

```bash
CLICKUP_API_TOKEN=... ntn workers exec -l createCompletedTask -d '{"listId":"CLICKUP_LIST_ID","clickupTaskTitle":"Ajustar el flujo de compra en la tienda","taskBodyParagraphs":["La experiencia de compra necesita un ajuste para reducir fricción y dejar el flujo más claro para el cliente."],"taskBodyBullets":["El flujo debe mantener una navegación simple y facilitar que el usuario complete la acción esperada."],"completionCommentParagraphs":["Hice el ajuste del flujo de compra y dejé la experiencia más clara para el cliente."],"completionCommentBullets":[],"minutes":60,"date":"2026-06-10"}'
```
