---
name: inbox-management
description: Create, update, reconcile, and close active agent Inbox checkpoints so every request is resumable, current, linked to sources, and cleared when done.
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

Use the Inbox page Date property as the day marker.

Every durable Inbox item starts with an inline date mention. For new items, use `@now` so Notion stores full date and time.

## rules

- Inbox is for work the agent owns, must act on, or must know today.
- Do not add FYI with no action, old completed work, duplicate source state, or maybe useful later notes.
- Every durable item needs a concise next action and source link when available.
- Do not keep completed work in Inbox.
- Rewrite stale items into the current next action.

## completion

Inbox work is complete when every active request is closed, waiting, blocked, or handed off with a live link.

