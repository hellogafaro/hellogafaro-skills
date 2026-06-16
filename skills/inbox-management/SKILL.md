---
name: inbox-management
description: Use when an agent must create, update, reconcile, or close the Notion Inbox checkpoint, including 3-hour freshness checks, date mentions, page mentions, agent-owned active work checkpoints, waiting loops, reminders, and stale Inbox item cleanup.
---

# inbox-management

Use this skill when an agent needs to create, update, reconcile, or close its active Inbox checkpoint.

Inbox is active work state. It is not long-term memory and not a duplicate task database.

## Purpose

Make every active request resumable and keep stale work out of the agent queue.

## Hard rules

- On every interaction, compare current time to the top Inbox sync timestamp. If the timestamp is missing or older than 3 hours, reconcile Inbox before proceeding.
- Reconcile open items against live sources before answering status.
- Remove stale, completed, duplicate, or no-action items immediately.
- Every durable Inbox item needs a source link unless it is a manually maintained Reminder.

## References

Load only when needed.

- `references/reconciliation.md` before reconciling Inbox against live sources.
- `references/loop-states.md` when deciding whether an item is To do, Waiting, Alert, Reminder, or closed.
- `references/edge-cases.md` when source state is missing, inconsistent, duplicated, or failed.

## Workflow

1. Fetch the Inbox database entry assigned to the current user before creating anything.
2. Create one assigned Inbox entry only when none exists.
3. For every direct request, queued assignment, accepted local handoff, or inter-agent ask, create or update one Inbox item before doing the work.
4. Write enough context for a future run to continue after interruption, crash, or lost chat context.
5. When work finishes, remove the Inbox item or rewrite it into the current blocker, waiting state, or exact next step.

## Structure

Use these sections only when useful.

- To do.
- Waiting.
- Alerts.
- Meetings.
- Reminders.
- Notes.

Use the Inbox page Date property as the day marker when present. For the standalone Notion Inbox page, use a top Notion date mention with full date and time as the last sync marker.

Update the top sync marker with `@now` in the Notion UI or API `rich_text` date mention every time Inbox is reconciled.

Every durable Inbox item starts with an inline date mention. For new items, use `@now` in the Notion UI or API `rich_text` date mention so Notion stores full date and time.

Use numbered list items so the user can reference `To do 3` or `Waiting 1`.

Mention or link the source page when a source exists. Prefer real Notion page mentions for Notion tasks and pages. Use named links only when mentions are unavailable.

Do not create timestamp-free main entries.

## Rules

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

## Completion

Inbox work is complete when every active request is closed, waiting, blocked, or handed off with a live link.
