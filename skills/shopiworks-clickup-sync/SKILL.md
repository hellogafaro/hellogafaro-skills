---
name: |-
  shopiworks-clickup-sync
description: |-
  Use when importing Minicoton or Somomu ClickUp requests assigned to Johan into Notion, or publishing verified Notion work and Timesheets to the provider's ClickUp tasks in Spanish.
notion_page_id: 3dffc798-2e43-8174-ab15-e851ed1722b5
---

# shopiworks-clickup-sync

Follow ClickUp intake, Notion execution, then ClickUp client-facing updates for the live Projects `Minicoton` and `Somomu`. Include another Project only when the user explicitly adds it. ClickUp is a customer input source like email, not an equal source of truth. Notion owns internal execution, status, completion, and Timesheets.

## Hard rules

Use `tasks-operations` with the selected Notion connection for every Notion task, Project, completion, and Timesheet operation. Use Composio for every ClickUp read and write through the current host's supported interface. Never bypass it with another connector, token, or ad hoc API call.

Apply `unslop` to all English and Spanish prose. Write concise natural English in Notion and concise natural neutral Spanish for the external provider in ClickUp. Rewrite for the reader rather than copying raw Spanish into Notion or raw English into ClickUp.

## Workflow

1. Resolve the scope (intake, publication, or both) and match before creating: [scope-and-matching.md](references/scope-and-matching.md).
2. Bring requests into Notion: [intake.md](references/intake.md).
3. Publish verified work to ClickUp: [publication.md](references/publication.md).
4. Verify every write and report in lettered Project groups: [verify-and-report.md](references/verify-and-report.md).

Finish when every authorized intake or publication is verified without duplicates, or reported with its blocker. Notion must remain the execution record throughout.
