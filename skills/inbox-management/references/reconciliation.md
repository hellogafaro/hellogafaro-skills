# Reconciliation

Use the matching specialist skill and live connected data. Select each intended account explicitly when the tool requires it.

## Source sweep

For a full preparation or refresh, read:

- The existing dated Inbox page.
- The latest prior Inbox page in the current three-section format.
- The current user's Memory.
- Assigned Tasks that are overdue or due on the target date, plus existing linked tasks whose state changed.
- Every connected email inbox: unread inbox, then read mail still in inbox. Use Memory to interpret account roles. Use sent mail only to verify an existing loop. Include snoozed mail only when it resurfaced or is relevant.
- Every connected calendar for the exact target date, using Memory to interpret account roles and source quirks.
- Live source state for every existing source-linked item.

Meeting notes are not a default source sweep. Read them only when the user asks for preparation, review, follow-up, or task extraction.

Flag an unknown newly connected account instead of silently excluding it.

## Reconcile before trusting

- Task Done: check the Inbox item.
- Task Canceled: remove the Inbox item.
- Task due date moved away: use the rescheduling marker rules.
- Calendar event moved: update its time and local order.
- Calendar event canceled or declined: remove its toggle.
- Email action already completed: check its task.
- Source missing or inaccessible: preserve the item and report uncertainty.

Perform canonical source writes first, then update the Inbox projection. Local-only items can change directly.

## Ordering and deduplication

Timed events are chronological anchors. Place tasks and reminders deliberately around them. Refresh should make local adjustments, not rebuild the whole page.

Deduplicate by canonical source identity. For unlinked personal work, use equivalent normalized text. Preserve the richer existing wording and context when the source identity matches.

Rewrite Brief only after the stream is current. Targeted actions update only the relevant source and block; they do not trigger a full sweep.
