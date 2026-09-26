# Calendar state

## Calendar state

Resolve the account and calendar before reading or acting. Pass the selected account on every provider call. If the intended calendar is unclear, ask one focused question. For complete coverage, inspect every relevant connected calendar, paginate fully, and name any source that could not be checked.

Use Composio to discover the operation, live schema, and connection. Run independent reads in parallel when supported. After a failed provider call, inspect its schema, narrow the request, and retry once. After an uncertain write, read current state before retrying. Never switch connector or use an ad hoc API as a fallback.

Fetch the smallest range that answers the request. Use the exact date for a daily review and about seven days for ordinary planning. Expand only when needed. Exclude canceled events and events the user declined. Deduplicate mirrored events by stable identity and details. Sort timed events chronologically. Include all-day events only when they affect availability or require action.

Check surrounding context when availability depends on working hours, focus blocks, lunch, travel, out-of-office time, or buffers. Calendar patterns are evidence, not permanent preferences. Explicit instructions and protected blocks win.

Keep an existing event's timezone for changes. For a new event, use the supplied timezone or a verified durable preference. Ask when ambiguity could change the time. For international scheduling, show the user's time and verified attendee-local times. Never infer timezone from a name, company, phone number, or email domain.

Refetch immediately before reporting live availability or changing an event. After a write, fetch the event and verify its calendar, title, date, time, timezone, attendees, recurrence, location, conference link, reminders, and status.
