# Reconciliation

Read and write Inbox state directly in Notion Inbox page `37bfc7982e4380638696e5002e6d859f`.

Use `notion-cli` and `ntn`.

Reconcile before trusting:

- Email-tied item: check live email state before reporting open.
- Waiting reply arrived: close loop or promote to To do.
- Snoozed date passed: promote to To do.
- Task-tied Done or Canceled: remove.
- Source changed: rewrite with current project, due date, status, or next action.
- Unresolvable mismatch: flag once in Notes with a one-line question.

Fetch current sources before writing:

- Notion Tasks DB: current data source ID, Owner is User, Status not Done and not Canceled, due today or overdue.
- ClickUp tasks: assigned to User, filter by status type, page fully.
- Notion mentions and comments: user-owned, recent, or self-mentions.
- Email and calendar: follow their skills.
