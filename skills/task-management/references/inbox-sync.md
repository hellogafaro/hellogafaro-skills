# Inbox sync

Represent a workspace Task as a native Inbox checkbox whose visible title is the real Task page mention or full canonical link.

During preparation, include Tasks assigned to the current user that are not Done or Canceled and are overdue or due on the target date. Reconcile existing linked Tasks even when their due dates changed. Include upcoming work only when it blocks today or the user asks.

Do not include work merely owned by the user and assigned elsewhere unless the user has a separate concrete action.

- Canonical Done: check the Inbox item and retain it on that dated page.
- Canonical Canceled: remove the active projection.
- Blocked: keep it unchecked, add one child bullet with the reason, and use canonical Blocked status.
- Due date rescheduled: update the Task first, then replace today's checkbox with a gray non-completable `Rescheduled to [date]: [task]` marker.
- Projection deleted: do not mutate the canonical Task.

Carry unchecked tasks from the latest prior Inbox page. Never carry checked tasks, canceled work, rescheduled markers, meetings, or passive reminders.

Do not duplicate source URLs or Task mentions.
