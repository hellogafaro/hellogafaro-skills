---
name: |-
  minicoton-clickup-sync
description: |-
  Syncs Minicoton ClickUp with Notion: imports requests assigned to the workspace owner and publishes done or cancelled Minicoton work with closed status, per-day time, attachments and a Spanish summary.
notion_page_id: 41afc798-2e43-814d-be6f-d349939ad51f
disable-model-invocation: true
---

# minicoton-clickup-sync

Project: [Minicoton](https://app.notion.com/p/28dfc7982e4380e4b8e7d8ccb24d1b3a). Keeps Minicoton's ClickUp in step with Notion. Intake brings ClickUp requests assigned to the workspace owner into Notion; publication pushes done or cancelled Minicoton work to ClickUp with the closed status, per-day time, attachments and a Spanish `## Resultado` summary. Notion stays the execution record; ClickUp is the client's view of the work. Also follow the Minicoton project instructions.

## Hard rules

- **Done work syncs.** When a Minicoton Notion task is Done or Canceled, publish it to ClickUp: the list's closed status, missing time, client-usable attachments and a `## Resultado` summary in Spanish. These record writes need no extra approval. Never publish work that is Not started, Backlog, In progress, Under review or Blocked in Notion. If the ClickUp request is broader than the done Notion work, log the done time but leave its status alone.
- **Closure comments are approved; other comments and mentions need the workspace owner's approval.** Exception: the workspace owner gave standing permission on 16 Nov 2026 for one kind of ClickUp comment only, the closure comment posted when a done or cancelled task is closed (workflow step 4), with no @mentions, no questions and no assignee. Before any other ClickUp comment, reply or @mention, show the workspace owner the exact text, destination, mentions and attachments and wait for approval. A sync request does not approve unseen messages. Do not reply to the client's people on the workspace owner's behalf. Put any comment you would want to send in the report as a draft. Never post Notion comments as part of a sync.
- **Executor's ClickUp tools only.** Use Executor's ClickUp connection for the workspace owner for every ClickUp read and write, finding that connection by its current label, and Executor's Notion connection with the `tasks` skill for Notion. No other ClickUp connector, personal token or ad hoc HTTP call.
- **Stop on approval.** If a write comes back approval-required or blocked, report the exact pending request and stop; do not retry it another way.
- **Language.** Concise natural English in Notion. Concise neutral Spanish in ClickUp, written the way Minicoton writes (below). Never mention Notion, the sync, internal tools, agents, bots, model names, internal-only links or credentials in ClickUp. Hold back personal or customer data, raw internal logs and scripts.
- Never delete tasks or time entries. After an uncertain write, read current state before retrying.
- This skill covers Minicoton only. Other projects have their own `<project>-clickup-sync` skill.

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

## Minicoton ClickUp structure

Revalidate IDs before relying on them. Workspace (team) `20421257`. The workspace owner is `182449615` (Europe/Madrid).<br />\*\*Minicoton space \*\***`90127566211`** (the client's current structure; prefer it for new work):

- Administración `901211178176`: General `901222575189`, Impuestos `901218071176`
- Ads - Minicoton `90129478895`: General `901217324194`, Meta `901215870221`, Google `901215870225`, Open Ai `901219545494`, Tiktok `901215870227`, Shop `901219545489`
- Atención al cliente `901214544155`: Chatwoot `901222357564`, General `901222004604`
- IT `901215032265`: IA `901222824149`, Shopify `901222638176`, General `901222574993`
- Logística `901211178181`: General `901218071181`, Códigos arancelarios `901223355559`
- Marketing `901211178185`: Email Marketing `901222004622`, Campañas y promociones `901223152453`, Auditoria web `901221889062`, Influencers `901220036678`, Revista `901222392629`, General `901218071185`
- Also Embroidery, Legal, Picking and Producción (each a General list) and Software › Portal de devoluciones `1500450000002646`<br />\*\*Older Minicoton space \*\***`90080349145`** (still active for apps and tools):
- Apps `90125419935`: Cashback `901212682117`, Chatwoot `901219321210` (bot development), Gift Verse `901212132544`, Product flex `901212173479`, Facturación - Mdashboard `901215811047`, Vision Hub `901214503183`, Waitlist `901213182323`, Bundles `901214083520`, Feed constructor `901215407190`, Gift Card `901215513835`
- Herramientas `90080852146`: Klaviyo `901212476107`, plus Sendcloud, Channable, Shopify POS, Gorgias
- Themes `901210348195`: Paper `901217020939` (theme and storefront)
- Shared folders: udeplab x minicoton `90127406121`, plus the collaborator-named shared folders listed in this project's Notion Instructions, and "Shared with me" tasks

## Picking a list for new work

- App work: that app's list in Apps (Cashback, Chatwoot, Gift Verse, Waitlist…).
- Theme, storefront, translations and wishlist: Themes › Paper.
- Klaviyo setup and flows: Herramientas › Klaviyo; email campaigns, deliverability and segments: Marketing › Email Marketing.
- Checkout, Shopify settings and apps configuration: IT › Shopify. AI tooling: IT › IA.
- Customer service operations: Atención al cliente (Chatwoot or General).
- Paid media: Ads - Minicoton, by channel. Shipping and customs: Logística.
- If two fit equally, prefer the newer Minicoton space.

## Statuses

Read the target list's statuses and use the exact label whose type is `closed`.

- Minicoton space lists: `pendiente` (open) → `en progreso` → `revisión` → `cerrada` (closed). Influencers also has `pendiente de aprovación`.
- Older space lists: `abierta` or `en planificación` (open), `pendiente`, `en progreso`, `revisión`, `cerrada` (closed).
- Done and Canceled → `cerrada`. Backlog and Blocked have no equivalent; leave ClickUp as it is.<br />Custom fields seen (Progreso, Antiguedad) are automatic; nothing needs filling.

## People

Publish everything assigned to the workspace owner (`182449615`). Resolve client names, roles and ClickUp user IDs from this project's Notion Instructions. Watchers are notified of status and description changes, so publish only verified results.

## How Minicoton writes in ClickUp

Spanish, "ustedes" when addressing the team, first person singular for the workspace owner, short and warm. Never call screenshots "prueba". Titles are short, sentence case, descriptive or verb-led. Descriptions use markdown headings (`## Objetivo`, `## Contexto`, `## Alcance` or `## Resumen`), short bullets and bold for key points, with screenshots and files attached. Keep established UI labels and technical English terms («checkout», «All Products»). Figures in Spanish format (1.234,56 €).<br />Examples:

- Titles: "Gift Card mercado UK", "Revisar caída de rendimiento de Customer Winback v0.1", "Mensaje de aranceles incluidos en el checkout en inglés".
- `## Resultado` bullets: "Tarjeta regalo propia del mercado UK en GBP (£), publicada solo en el catálogo de UK." · "Comprobado el 14 de octubre en un checkout nuevo en inglés para Canadá: aparece el banner corregido." · "Pendiente: una compra real para confirmar que la tarjeta se emite en GBP."

## Workflow

1. **Scope.** Notion Project Minicoton only. For publication, take Minicoton Notion tasks that are Done or Canceled, with their Timesheets, up to today. For intake, ClickUp tasks in the Minicoton space assigned to the workspace owner. Skip old backlog and filler.
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
- **16 Nov 2026:** Split from shopiworks-clickup-sync into this Minicoton-only skill. Done and cancelled work publishes with status, per-day time, attachments and a Spanish summary; comments still need approval; Executor's ClickUp tools only.
