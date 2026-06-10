---
name: inbox-management
description: Use when an agent must create, update, reconcile, or close the Notion Inbox checkpoint, including date mentions, page mentions, source-linked items, waiting loops, reminders, and stale item cleanup.
---

# inbox-management

Use this skill when an agent needs to create, update, reconcile, or close its active Inbox checkpoint.

Inbox is active work state. It is not long-term memory and not a duplicate task database.

## purpose

Make every active request resumable and keep stale work out of the agent queue.

## workflow

1. Fetch the Inbox database entry assigned to the current user before creating anything.
2. Create one assigned Inbox entry only when none exists.
3. For every direct request, queued assignment, or accepted Handoff, create or update one Inbox item before doing the work.
4. Write enough context for a future run to continue after interruption, crash, or lost chat context.
5. Reconcile open items against live sources before answering status.
6. Remove stale, completed, duplicate, or no-action items immediately.
7. When work finishes, remove the Inbox item or rewrite it into the current blocker, waiting state, or exact next step.

## structure

Use these sections only when useful.

- To do.
- Waiting.
- Alerts.
- Meetings.
- Reminders.
- Notes.

Use the Inbox page Date property as the day marker when present. For the standalone Notion Inbox page, use a top Notion date mention for today.

Every durable Inbox item starts with an inline date mention. For new items, use `@now` in the Notion UI or API `rich_text` date mention so Notion stores full date and time.

Use numbered list items so the user can reference `To do 3` or `Waiting 1`.

Mention or link the source page when a source exists. Prefer real Notion page mentions for Notion tasks and pages. Use named links only when mentions are unavailable.

Do not create timestamp-free main entries.

Use these sections only:

- To do.
- Waiting.
- Alerts.
- Meetings.
- Reminders.
- Notes.

## rules

- Inbox is for work the agent owns, must act on, or must know today.
- Do not add FYI with no action, old completed work, duplicate source state, or maybe useful later notes.
- Every durable item needs a concise next action and source link when available.
- Do not keep completed work in Inbox.
- Rewrite stale items into the current next action.
- No source, no Inbox item, except manually maintained Reminders.
- Inbox item text is a concise reminder, not full scope.
- Avoid key value dumps and long context.
- Remove closed, stale, duplicate, and no-longer-actionable items immediately.
- Low-value FYI, welcome emails, receipts, routine notifications, and maybe useful later items never get durable Inbox space.
- Tomorrow and later stay out unless they are meeting context, a true reminder, or blocking today's work.
- Friday deep run: every open task that cannot close today gets rescheduled before the run ends.

## reconciliation

Read and write Inbox state directly in Notion Inbox page `37bfc7982e4380638696e5002e6d859f`.

Use `notion-cli` and `ntn`. Never use Notion MCP.

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

## close loops

- Reply sent and no response needed: archive source and remove item.
- Reply sent and response needed: archive source and move to Waiting.
- User or assistant owns next action: To do.
- External owns next response: Waiting.
- Waiting thread gets bumped: update and promote same item to To do, never duplicate.
- Waiting older than 24h: suggest a gentle nudge.
- Waiting older than 3 to 5 days: suggest stronger nudge or escalation.
- Duplicate source copies: keep one canonical item.
- Same sender burst: collapse into one concise item.
- User replied outside flow: sync Inbox and do not re-draft.
- Real task exists or is created: keep concise To do with task link until complete.
- Recurring task completed: clear current cycle only.
- No next action: no Inbox.

## reminders

Date-anchored commitments with no better source go in Reminders.

Default to an all-day Google Calendar event on the deadline date when a real reminder is needed.

Calendar event not always required. When skipped, the item is manually maintained.

Remove reminders when past and resolved or superseded.

## edge cases

Notify by default. Nothing silent.

- Empty Project relation: surface in Notes with task ID, title, and link.
- Multiple Project relations: surface data error in Notes.
- Project page archived or trashed: surface in Notes.
- Tasks DB query returns 404: resolve current data source ID before reporting task state.
- Same task in Notion and ClickUp: keep where time tracking lives.
- MCP failure: surface source, operation, and error. Continue with available sources.
- Self-mention: surface like any other mention.
- ClickUp status varies: filter by status type.
- ClickUp pagination: page until exhausted.
- Item written manually by User: preserve unless source confirms closed.
- High priority task with no due date: flag in push.
- ClickUp Complete with no time tracked: surface log time prompt.
- Project paused or archived: remove tied items unless closure action remains.

## completion

Inbox work is complete when every active request is closed, waiting, blocked, or handed off with a live link.
