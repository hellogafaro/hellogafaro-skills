---
name: inbox-management
description: Use when an agent must prepare, update, reconcile, or review the sidekick Inbox, including the daily Brief, mixed To do stream, Notes, carryover, bookmarks, completion, rescheduling, reminders, meetings, and source reconciliation.
---

# inbox-management

Use this skill whenever work changes or depends on the sidekick Inbox.

Inbox is the dated human checkpoint for what matters now. It is not long-term Memory, a second task database, or a transcript of every connected source.

## Host mapping

Resolve `Inbox` through the host environment before reading or writing it.

- In a file-backed environment, Inbox may be a repository file.
- In Notion, Inbox is one page per user and date in the configured Inbox database. The user mention plus Date is unique.
- Never hardcode a repository path, database ID, user ID, or connection selector in this skill.

Use the host's native blocks, links, mentions, and formatting. Search before creating and stop on duplicate pages instead of guessing.

## Structure

Every dated Inbox has exactly these sections, in this order:

- Brief.
- To do.
- Notes.

Do not add placeholder or guidance text.

Brief is AI-owned. Write 80 to 150 words in two or three short prose paragraphs. Summarize meaningful outcomes, carried or blocked work, material schedule changes, and where attention belongs. Do not repeat the stream item by item.

To do is one deliberately mixed ordered stream:

- Tasks use the host's native checkbox. Link or mention the canonical Task when one exists.
- Meetings and other timed events use a toggle whose title begins with the local start and end time. Children contain only useful prep or supporting links.
- Passive reminders use ordinary bullets.
- Optional context uses one nested bullet when it materially helps.

Notes is user-owned. Preserve it exactly during preparation and refresh. Change only the requested block.

## Preparation

On `prepare Inbox`, `refresh Inbox`, `what is my day`, or an equivalent request:

1. Resolve the requested date. An explicit date wins, then the open Inbox page Date, then today from the host context.
2. Find the current user's page for that date. Create it only when missing. Stop and report duplicates.
3. Read the existing page, current Memory, the latest prior Inbox page in this format, assigned Tasks, every connected email and calendar source, and live state for existing items. Use Memory to interpret known account roles and flag an unknown new account instead of silently ignoring it.
4. Carry unchecked tasks from the latest prior Inbox page. Do not carry completed tasks, meetings, passive reminders, canceled work, or rescheduled markers.
5. Reconcile and deduplicate against canonical sources.
6. Preserve completed items, Notes, deliberate order, nested context, and manual bookmarks. Make local ordering changes only.
7. Rewrite Brief last.

Future Inbox pages are created only for explicit future work or notes. Keep their Brief empty unless the user asks for a preview. Preparing that date later preserves its Notes.

## Importance

Use explicit user direction first, then Memory, then live urgency and consequences. Memory shapes judgment; live sources control current facts.

Mark at most three top-level items as important using the host's yellow background. Existing yellow formatting is the canonical bookmark state. Preserve it on refresh, fill an empty slot only when justified, and remove it when the item leaves the active stream. If more than three items are yellow, ask which to keep and recommend the strongest three.

## Item rules

- Add only a clear user-owned action, direct request, decision, deadline, blocker, relevant timed commitment, or requested reminder.
- One source loop becomes one Inbox item. Source identity wins over wording during deduplication.
- Link the whole natural title to the best canonical source when available.
- Do not add FYI, newsletters, chatter, stale work, duplicate state, or maybe-useful-later material.
- Conversation alone does not create an item. Add one only when the user asks, preparation finds a concrete action, or the work must persist.
- Live sources override Inbox for current state. If a source is unavailable, preserve the item and report uncertainty.

## References

Load only when needed.

- `references/reconciliation.md` before a full preparation or refresh.
- `references/loop-states.md` for completion, cancellation, rescheduling, waiting, and reminders.
- `references/edge-cases.md` for duplicates, source failures, stale Memory, and repeated carryover.

## Completion

Inbox work is complete when the requested date is deduplicated and reconciled, its three sections are valid, source-backed mutations happened before projection changes, Notes were preserved, and every write was verified through the host.
