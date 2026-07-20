---
name: inbox-management
description: Use when an agent must create, update, reconcile, or close the repo-root INBOX.md checkpoint, including freshness checks, active work, waiting loops, reminders, alerts, meetings, and stale item cleanup.
---

# inbox-management

Use this skill when an agent needs to create, update, reconcile, or close active work in the repository-root `INBOX.md`.

Inbox is active sidekick state. It is not long-term memory and not a duplicate task database.

## Purpose

Make every active request resumable and keep stale work out of the sidekick queue.

## Hard rules

- On every interaction, compare current time to `Last updated`. If it is missing or older than 3 hours, reconcile Inbox before proceeding.
- Reconcile open items against live sources before answering status.
- Remove stale, completed, duplicate, canceled, or no-action items immediately.
- Every durable Inbox item needs a source link unless it is a manually maintained Reminder.
- Live sources override Inbox when they conflict.

## References

Load only when needed.

- `references/reconciliation.md` before reconciling Inbox against live sources.
- `references/loop-states.md` when deciding whether an item is To do, Waiting, Alert, Reminder, or closed.
- `references/edge-cases.md` when source state is missing, inconsistent, duplicated, or failed.

## Workflow

1. Open the repository-root `INBOX.md` before operational work.
2. Create it from the standard section structure when missing.
3. For every direct request, queued assignment, accepted local handoff, or inter-agent ask, create or update one Inbox item before doing the work.
4. Write enough context for a future agent or session to continue after interruption, crash, or lost chat context.
5. When work finishes, remove the item or rewrite it into the current blocker, waiting state, or exact next step.
6. Set `Last updated` to the current ISO 8601 timestamp after every Inbox change or reconciliation.

## Structure

Keep these sections in this order, with concise italic guidance under each heading.

- To do.
- Waiting.
- Alerts.
- Meetings.
- Reminders.
- Notes.

Use numbered list items so the user can reference `To do 3` or `Waiting 1`.

Every durable item starts with an ISO 8601 timestamp. Link the natural action text to its live source.

For task-backed To do items, include the visible task ID, such as `TSK-483`, and the task link.

Do not write `Source:` or `Sources:` labels. Do not create timestamp-free main entries.

## Rules

- Inbox is for work the user or active agent owns, must act on, or must know today.
- Task-backed To do items must be owned by or assigned to the user. Never add another person's task unless the user has a separate explicit next action on it.
- Do not add FYI with no action, old completed work, duplicate source state, or maybe-useful-later notes.
- Every durable item needs a concise next action and source link when available.
- Do not keep completed work in Inbox.
- Rewrite stale items into the current next action.
- No source, no Inbox item, except manually maintained Reminders.
- Inbox text is a concise reminder, not full scope.
- Avoid key-value dumps and long context.
- Tomorrow and later stay out unless they are meeting context, a true reminder, or blocking today's work.
- Friday deep run: every open task that cannot close today gets rescheduled before the run ends.

## Completion

Inbox work is complete when every active request is closed, waiting, blocked, or handed off with a live link and `Last updated` is current.
