# Worker tools

Run worker tools from `/Users/jg/Dev/hellogafaro-skills/workers/shopiworks-clickup-sync`.

Use read tools before writing:

```bash
ntn workers exec -l getMap
ntn workers exec -l getTask -d '{"taskId":"CLICKUP_TASK_ID"}'
ntn workers exec -l searchTasks -d '{"query":"SPANISH_OR_CLIENT_QUERY","includeClosed":true}'
ntn workers exec -l formatCompletionComment -d '{"completionCommentParagraphs":["Se completo el ajuste y la experiencia queda lista para revision del cliente."],"completionCommentBullets":[]}'
```

Preferred write tools:

```bash
ntn workers exec -l syncExistingCompletedTask -d '{"clickupTaskId":"CLICKUP_TASK_ID","clickupTaskTitle":"Ajustar flujo de compra","completionCommentParagraphs":["Se completo el ajuste y la experiencia queda lista para revision del cliente."],"completionCommentBullets":[],"minutes":60,"date":"2026-06-10"}'
ntn workers exec -l createCompletedTask -d '{"listId":"CLICKUP_LIST_ID","clickupTaskTitle":"Ajustar flujo de compra","taskBodyParagraphs":["La experiencia de compra necesitaba un ajuste para reducir friccion y dejar el flujo mas claro para el cliente.","El cambio debe mantener una navegacion simple y facilitar que el usuario complete la accion esperada."],"taskBodyBullets":[],"minutes":60,"date":"2026-06-10"}'
```

Repair tools are `updateTask`, `deleteTask`, `logTime`, `listTimeEntries`, `deleteTimeEntry`, and `commentTask`. Use them only for confirmed mistakes after reading the target task or time entry.
