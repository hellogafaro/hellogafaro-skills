# Reconciliation

Read and write active state in the repository-root `INBOX.md`.

Use the matching specialist skill and live Composio data for connected services. Select the intended account explicitly when more than one connection exists.

Reconcile before trusting:

- Email-tied item: check live email state before reporting it open.
- Waiting reply arrived: close the loop or promote it to To do.
- Snoozed date passed: promote it to To do.
- Task-tied Done or Canceled: remove it.
- Source changed: rewrite it with the current project, due date, status, or next action.
- Unresolvable mismatch: flag it once in Notes with a one-line question.

Fetch current sources before writing:

- Notion Tasks: discover the live Tasks data source and schema through Composio, then fetch user-owned open work due today or overdue.
- ClickUp tasks: fetch assigned work through the owning skill and page fully.
- Notion mentions and comments: fetch relevant recent collaboration through Composio.
- Email: follow `email-management`.
- Calendar: for Inbox-only reconciliation, fetch today only. Fetch future calendar context only for day planning, scheduling, calendar review, or an existing future Meeting item that must be verified.

Update `Last updated` after reconciliation even when no items changed.
