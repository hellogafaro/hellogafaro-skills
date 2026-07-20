# Loop states

- Reply sent and no response needed: archive the source and remove the item.
- Reply sent and response needed: archive the source and move the item to Waiting.
- User or active agent owns the next action: To do.
- Someone external owns the next response: Waiting.
- Waiting thread gets bumped: update and promote the same item to To do, never duplicate it.
- Waiting older than 24 hours: suggest a gentle nudge.
- Waiting older than 3 to 5 days: suggest a stronger nudge or escalation.
- Duplicate source copies: keep one canonical item.
- Same sender burst: collapse it only when one action closes the whole burst.
- User replied outside the flow: sync Inbox and do not re-draft.
- Real task exists or is created: keep a concise To do with task ID and link until complete.
- Recurring task completed: clear the current cycle only.
- No next action: no Inbox item.

Date-anchored commitments with no better source go in Reminders.

Default to an all-day calendar event on the deadline date when a real reminder is needed and the user approves scheduling it.

A calendar event is not always required. When skipped, maintain the Reminder directly in `INBOX.md`.

Remove reminders when past and resolved or superseded.
