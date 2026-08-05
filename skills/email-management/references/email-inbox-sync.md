# Email Inbox sync

Load whenever an email action affects `Inbox`.

One actionable email thread becomes one source-linked task in the dated Inbox. Add only a concrete direct reply, decision, deadline, or blocker owned by the user. Ignore FYI, newsletters, routine notifications, chatter, and merely unread mail.

## State changes

- Reply needed today: add or update one unchecked task linked to the thread.
- Reply sent: check the task after verifying sent state.
- Response expected: do not keep a passive Waiting item in the daily stream. Create a calendar follow-up only when the response matters or the user asks.
- Real reply arrives: add or update the new user-owned action on refresh.
- Loop closed, canceled, or no longer actionable: remove stale open projections. Preserve already checked history on the dated page.
- Snoozed thread: keep it out of today's Inbox until it resurfaces or becomes relevant.

Use the whole natural action as the thread link. Optional context is one nested bullet. Never duplicate a thread across accounts or create a second item merely because its wording changed.
