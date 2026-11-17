---
name: |-
  somomu-clickup-sync
description: |-
  Syncs Somomu ClickUp with Notion: imports requests assigned to the workspace owner and publishes done or cancelled Somomu work with closed status, per-day time, attachments and a Spanish summary.
notion_page_id: 41afc798-2e43-81e5-a052-f1986bebc48e
disable-model-invocation: true
---

# somomu-clickup-sync

Project: [Somomu](https://app.notion.com/p/28dfc7982e4380dbabc3eed218c34c2d). Keeps Somomu's ClickUp in step with Notion. Intake brings ClickUp requests assigned to the workspace owner into Notion; publication pushes done or cancelled Somomu work to ClickUp with the closed status, per-day time, attachments and a Spanish `## Resultado` summary. Notion stays the execution record; ClickUp is the client's view of the work. Somomu shares its client team with Minicoton but has its own space, lists and statuses.

## Hard rules

- **Done work syncs.** When a Somomu Notion task is Done or Canceled, publish it to ClickUp: the list's closed status, missing time, client-usable attachments and a `## Resultado` summary in Spanish. These record writes need no extra approval. Never publish work that is Not started, Backlog, In progress, Under review or Blocked in Notion. If the ClickUp request is broader than the done Notion work, log the done time but leave its status alone.
- **Closure comments are approved; other comments and mentions need the workspace owner's approval.** Exception: the workspace owner gave standing permission on 16 Nov 2026 for one kind of ClickUp comment only, the closure comment posted when a done or cancelled task is closed (workflow step 4), with no @mentions, no questions and no assignee. Before any other ClickUp comment, reply or @mention, show the workspace owner the exact text, destination, mentions and attachments and wait for approval. A sync request does not approve unseen messages. Do not reply to the client's people on the workspace owner's behalf. Put any comment you would want to send in the report as a draft. Never post Notion comments as part of a sync.
- **Executor's ClickUp tools only.** Use Executor's ClickUp connection for the workspace owner for every ClickUp read and write, finding that connection by its current label, and Executor's Notion connection with the `tasks` skill for Notion. No other ClickUp connector, personal token or ad hoc HTTP call.
- **Stop on approval.** If a write comes back approval-required or blocked, report the exact pending request and stop; do not retry it another way.
- **Language.** Concise natural English in Notion. Concise neutral Spanish in ClickUp, written the way Somomu writes (below). Never mention Notion, the sync, internal tools, agents, bots, model names, internal-only links or credentials in ClickUp. Hold back personal or customer data, raw internal logs and scripts.
- Never delete tasks or time entries. After an uncertain write, read current state before retrying.
- This skill covers Somomu only. Other projects have their own `<project>-clickup-sync` skill.

## Time rules

- Actual minutes only, from Notion Timesheets, as the workspace owner (`assignee: 182449615`). Omit `billable` from every write. No time of day in reports.
- **15-minute steps:** round each day's total to the nearest 15 minutes.
- **Compare per day in Madrid time:** read the task's existing entries first and compare per task and per day in Europe/Madrid. Entries anchored at 00:00 Madrid show as 22:00 (summer) or 23:00 (winter) UTC the day before. Add only the missing minutes, with `start` at 00:00 Madrid on the Notion date and a short Spanish description.
- **Log duplicated work once:** when several Notion tasks map to one ClickUp task with entries on the same day, add them unless they describe the same work; the same work is logged once.
- **Split evenly across market tasks:** when one Notion entry covers several ClickUp tasks (for example one per market or store), split it evenly in 15-minute blocks.

## Executor ClickUp tools

- Read: `tools.clickup.tasks.getTask` (query `include_markdown_description: true`), `tools.clickup.tasks.getTasks` (path `list_id`, query `include_closed: true`, follow pages), `tools.clickup.lists.getList` (statuses), `tools.clickup.timeTracking.gettimeentrieswithinadaterange` (path `team_Id: 20421257`; query `task_id`, `start_date`, `end_date` in ms; pass `headers: {"Content-Type":"application/json"}`). Spaces may come back empty for the workspace owner's shared access; derive structure from tasks and `getList`.
- Write: `tools.clickup.tasks.createTask` (path `list_id`; body `name`, `markdown_content`, `assignees: [182449615]`, `status`, `start_date`, `due_date`, `notify_all: false`), `tools.clickup.tasks.updateTask` (body `status`, `markdown_content`), `tools.clickup.timeTracking.createatimeentry` (path `team_Id: 20421257`; body `tid`, `assignee`, `start`, `duration` in ms, `description`), `tools.clickup.attachments.createTaskAttachment` (path `task_id`; `contentType: multipart/form-data`; body `filename`, `attachment` as base64).
- Comments (`tools.clickup.comments.*`) only under the closure-comment permission below or after separate approval from the workspace owner.

## Somomu ClickUp structure

Revalidate IDs before relying on them. Workspace (team) `20421257`. The workspace owner is `182449615` (Europe/Madrid).<br />**Somomu space \*\*\*\*\*\*\*\*****`90120503027`**, folder udeplab x Somomu `90127715842`:

- General `901212940671`: day-to-day requests, promotions, Klaviyo, reports
- Mejoras web `901202879959`: store and theme improvements, landings, apps on the store, translations
- Ads `901212940661`: paid media
- APPS y Software `1500450000005413`: app projects (for example the returns portal with Sendcloud)
- A "Shared with me" list also exists for the post-migration Highdatanet work `901217377046`.

## Picking a list for new work

- Store, theme, landing, product page, reviews, translations: Mejoras web.
- Promotions, Klaviyo, data and admin requests: General.
- App builds and integrations: APPS y Software. Paid media: Ads.

## Statuses

Read the target list's statuses and use the exact label whose type is `closed`.

- `Open` (open) → `in progress` → `review` → `Closed` (closed). Labels are in English with this exact casing.
- Done and Canceled → `Closed`. Backlog and Blocked have no equivalent; leave ClickUp as it is.

## People

Publish everything assigned to the workspace owner (`182449615`). Resolve client names, roles and ClickUp user IDs from this project's Notion Instructions. Watchers are notified of status and description changes, so publish only verified results.

## How Somomu writes in ClickUp

Spanish, "ustedes" when addressing the team, first person singular for the workspace owner, short and warm. Never call screenshots "prueba". Titles are short, sentence case and verb-led. The workspace owner's closed Somomu tasks use a short prose opening (why it was needed) followed by what was done; client requests are informal. Match that: `## Resumen` with one or two sentences, then `## Resultado` bullets. Keep established UI labels and technical English terms («checkout», «B2B»). Figures in Spanish format (1.234,56 €).<br />Examples:

- Titles: "Integrar [Judge.me](http://Judge.me) y adaptar reseñas al diseño de la tienda", "Actualizar landing de Colaboraciones y Somomu Stories", "Ajustar precios de la promoción con exclusiones".
- `## Resumen`: "La web necesitaba reflejar una promoción de 48 horas para que los clientes vieran el descuento correcto durante la campaña del 22 y 23 de junio."
- `## Resultado` bullets: "Descuento del 10% aplicado solo a los productos elegibles." · "Comprobado en la tienda en todos los idiomas."

## Workflow

1. **Scope.** Notion Project Somomu only. For publication, take Somomu Notion tasks that are Done or Canceled, with their Timesheets, up to today. For intake, ClickUp tasks in the Somomu space assigned to the workspace owner. Skip old backlog and filler.
2. **Match before creating.** Use the ClickUp URL or ID recorded on the Notion task (body, comment or property). Otherwise search the likely list, including closed tasks, by outcome and read plausible matches. One Notion task can map to several ClickUp tasks and several Notion tasks to one. Ambiguous matches need input, not a new task.
3. **Intake (ClickUp → Notion).** Import only clear requests with an owned outcome assigned to the workspace owner, one Notion task per outcome, following `tasks`, with the ClickUp link in the body. A closed ClickUp status is not proof of internal completion; do not import ClickUp time as actuals. Put open questions in the report, never in ClickUp.
4. **Publication (Notion → ClickUp)** for each done or cancelled task:
   - **Status:** set the list's closed label (Statuses above). Canceled gets the same closed label plus a summary line saying it was not needed. Fetch the task to confirm it persisted.
   - **Time:** per the time rules.
   - **Attachments:** carry over Notion Assets the client can use (screenshots, final reports, deliverables) when the ClickUp task has no file of that name, with Spanish descriptive file names. Do not send raw internal proof (logs, evidence archives, agent briefs, files with internal tool names, credentials or personal data); list those in the report for the workspace owner to decide.
   - **Summary:** if the description has no result yet, append a `## Resultado` section in Spanish to the existing description (never overwrite the client's text) with 3–6 short bullets: what was done, the proof (live URL, PR, figure), how to use it, and anything still pending that the client must act on. Leave out internal incidents and problems fixed along the way.
   - **Closure comment:** after closing, post one clean, professional comment in Spanish in the client's style. Summarize the delivered result and carry the full client-facing proof we retain in Notion: before-and-after screenshots, screen recordings, verification evidence, test results, live URLs and reports where available and relevant, not just a minimal summary. Explain briefly what each proves and distinguish verified results from pending checks. Upload usable files to the task first (`tools.clickup.attachments.createTaskAttachment`), then link them by descriptive names in `tools.clickup.comments.createTaskComment` using a `comment` array whose link parts have `attributes.link`, with `notify_all: false`. Use attachment URLs without temporary query strings; do not claim files are natively embedded in a comment. Link PRs, live pages and test reports too. Never include internal or sensitive material (internal tooling names, OpenCode, CLIProxyAPI, agent briefs, repro scripts, credentials, personal or customer data). If useful proof has internal references, hold it back and report it as a candidate for a cleaned client version. Read all relevant comments first; if a closure comment already exists, do not post another. A Canceled task gets one line with no assets. No @mentions, questions, assignee or replies. Keep time and `## Resultado` in the description.
   - **New task** when no match exists: create it in the right list (guide above), assigned to the workspace owner, closed, with a client-style title and `## Resumen` + `## Resultado` description, `start_date` and `due_date` on the work date; then add its time and attachments.
5. **Verify.** Re-read every changed task: status, description, attachments, closure comment and time entries. Rerunning the same scope must add no duplicate tasks, time, attachments or closure comments.
6. **Notion link-back.** If the Tasks data source has a ClickUp link property, store the ClickUp URL there; otherwise the link lives in the task body. No Notion comments.

## Report

Only changed, skipped, failed or needs-input items, numbered: TSK, ClickUp link, created or updated, status set, minutes added, attachments added, closure comment posted, or the reason skipped. Then pending approvals, draft comments, and totals. No times of day.

## Change log

- **16 Nov 2026 (proof scope):** The workspace owner clarified that closure comments carry the full professional client-facing proof retained in Notion (before/after screenshots, recordings, verification evidence, tests, live links and reports), not only a minimal summary. Hold back internal or sensitive files; report useful internal proof as a candidate for a cleaned client version.
- **16 Nov 2026 (later):** Publishing a done task now also posts one Spanish closure comment with the client-usable assets linked; a cancelled task gets a one-line closure comment with no assets; never repeated. The workspace owner's standing permission, given 16 Nov 2026, covers only this closure comment, with no @mentions and no questions; every other comment, reply or mention still needs the workspace owner's approval.
- **16 Nov 2026:** Split from shopiworks-clickup-sync into this Somomu-only skill. Done and cancelled work publishes with status, per-day time, attachments and a Spanish summary; comments still need approval; Executor's ClickUp tools only.
