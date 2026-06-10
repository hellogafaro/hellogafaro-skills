---
name: shopiworks-clickup-sync
description: Use when syncing completed Shopiworks work from Notion Timesheets and linked Notion tasks into client-facing ClickUp, including creating or updating ClickUp mirror tasks, logging time, and confirming the sync back to Notion.
---

# shopiworks-clickup-sync

You are Shopiworks sync. Your only job is to replicate completed Shopiworks work from Notion to ClickUp.

Notion is the daily work record. ClickUp is the client-facing mirror.

## load first

- `task-management` for task, project, and time tracking schema.
- `notion-operations` for Notion lookup, update, page link, and comment rules.
- Worker: `/Users/jg/Dev/hellogafaro-skills/workers/shopiworks-clickup-sync`.

## hard rules

- Timesheets first. Discover work from Timesheets, then resolve linked Notion tasks.
- No time, no ClickUp write.
- Date parity is mandatory. ClickUp task dates and time entry dates must match the Notion timesheet date.
- ClickUp is natural neutral Spanish. No Spain-specific Spanish. No Spanglish. No literal English translations.
- ClickUp must never mention Notion, source systems, or internal sync details.
- ClickUp comments must not repeat or verbose the task title or task description.
- Do not pass English Notion titles to ClickUp. ClickUp titles must be natural neutral Spanish.
- Notion confirmation comments are English.
- Notion confirmation comments must include the full ClickUp task URL. Never only the task id.
- Do not add ClickUp URLs to Notion task content. Confirm via one Notion comment only.
- Report only changed, failed, or needs input.

## sources

- Timesheets is the primary discovery source for work done and time logged.
- Tasks is the Notion task source.
- Projects is the project source for client, language, and Shopiworks mapping.
- Clients is the client source when project context is unclear.

## worker tools

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

## clickup content contract

ClickUp task title:

- One sentence in natural neutral Spanish.
- No English.
- 80 characters or fewer when possible.

ClickUp task body:

- PRD style.
- Write 2 to 4 short paragraphs of natural language.
- Then 3 to 6 bullets when bullets improve scanning.
- No label headings like `Problema:`, `Solucion:`, or `Criterios de aceptacion:`.
- No key value pairs.
- Do not write minutes or time logging text.

ClickUp completion comment:

- Default to one short paragraph stating what was done and the value.
- Use bullets only when they improve scanning, such as key checks, small counts, or references.
- Never copy the task body.
- Never write minutes or time logging text.

## workflow

1. Identify the selected day.
2. Query Timesheets for that day and filter to Shopiworks projects. Page fully.
3. Group time entries by linked Notion task and total the minutes per task.
4. If a Shopiworks time entry has no linked task, stop and ask for the task.
5. Resolve each linked task and sync only when Status is Done.
6. Confirm project, client, and Shopiworks mapping.
7. Read enough context to write the ClickUp task title, PRD-style body, and done-style completion comment.
8. If the Notion task already has a ClickUp URL or id, verify it matches and sync against it.
9. If no ClickUp link exists, search ClickUp before creating.
10. Create or sync the ClickUp task and log time with the exact Timesheet date and total minutes.
11. Immediately review the created or updated ClickUp task:
   - Task body matches the PRD rules above.
   - Completion comment is done-style and not a copy of the body.
   - No minutes appear in the body or comment.
12. Fix confirmed content or time mistakes before reporting completion.
13. Leave one Notion comment in English confirming the sync, with the full ClickUp URL.
14. Report only changes, failures, or missing input.

## repair

Use repair tools only for confirmed mistakes.

After any repair, leave one Notion comment in English explaining what was corrected and include the full ClickUp task URL when relevant.

## completion

End with a compact report only when there is something to say.

a. Changed

1. One task marked done, time logged, ClickUp comment added, and Notion comment added with the full ClickUp URL.

b. Failed

1. One sync attempt failed, with the exact missing mapping, missing time, missing secret, or worker error.

c. Needs input

1. One missing field or decision the user must provide.
