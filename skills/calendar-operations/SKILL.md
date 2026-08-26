---
name: calendar-operations
description: Use when work involves reviewing calendars, checking availability or conflicts, preparing meetings, or creating, moving, rescheduling, and canceling events through Composio.
---

# calendar-operations

Treat live calendars as the source for availability, commitments, attendees, recurrence, reminders, and event status. Use Composio for every calendar read and write, letting its available tooling choose CLI or MCP. Never use Notion Calendar, another connector, or a default account.

## Calendar state

Resolve the account and calendar before reading or acting. Pass the selected account on every provider call. If the intended calendar is unclear, ask one focused question. For complete coverage, inspect every relevant connected calendar, paginate fully, and name any source that could not be checked.

Use Composio to discover the operation, live schema, and connection. Run independent reads in parallel when supported. After a failed provider call, inspect its schema, narrow the request, and retry once. After an uncertain write, read current state before retrying. Never switch connector or use an ad hoc API as a fallback.

Fetch the smallest range that answers the request. Use the exact date for a daily review and about seven days for ordinary planning. Expand only when needed. Exclude canceled events and events the user declined. Deduplicate mirrored events by stable identity and details. Sort timed events chronologically. Include all-day events only when they affect availability or require action.

Check surrounding context when availability depends on working hours, focus blocks, lunch, travel, out-of-office time, or buffers. Calendar patterns are evidence, not permanent preferences. Explicit instructions and protected blocks win.

Keep an existing event's timezone for changes. For a new event, use the supplied timezone or a verified durable preference. Ask when ambiguity could change the time. For international scheduling, show the user's time and verified attendee-local times. Never infer timezone from a name, company, phone number, or email domain.

Refetch immediately before reporting live availability or changing an event. After a write, fetch the event and verify its calendar, title, date, time, timezone, attendees, recurrence, location, conference link, reminders, and status.

## Review and recommend

Surface upcoming commitments, conflicts, same-day changes, meetings that need preparation, tentative decisions, and the smallest useful next action. Do not dump the calendar.

Use lettered groups and numbered sub-items. Group schedule reviews by date and calendar comparisons by calendar. Within each group, order events chronologically and slots by usefulness.

Before recommending a meeting, confirm it has a clear outcome, the user is needed for a decision, relationship, or accountability, and a document, email, message, delegate, or shorter format would not work better. Raise the better alternative before scheduling. Never decline or change the meeting unless requested.

Confirm conflicts actually overlap and need the user. Respect explicit direction, protected time, confirmed commitments, key relationships, and travel. Recommend which event to keep or move, name the deciding factor, and offer a specific replacement slot. Do not hand the decision back as a vague question.

Treat same-day external changes as important when they affect preparation or commitments. For a user-initiated same-day cancellation, draft a short apology or reschedule note. Apply `unslop`, but do not send without separate approval through `email-operations`.

Protect travel and out-of-office windows. When practical, leave space around travel and respect a real buffer pattern. Flag external requests under two hours unless urgency or relationship importance justifies them.

## Schedule and change events

Act on an explicit request when the calendar, date, time, timezone, attendees, duration, and recurrence scope are clear. For an inferred change or unsolicited recommendation, show the exact proposal and wait for approval.

When duration is missing, use an explicit durable preference or the established duration of the same recurring series. Otherwise propose 30 minutes and wait for confirmation. Offer at most three suitable slots unless the user asks for more. Spread them across days when useful.

Use concise sentence-case titles that state the purpose. Do not add names, dates, or filler already represented by event fields. Add a description, agenda, location, conference link, attachments, or source links only when useful. Never invent attendees, addresses, availability, links, locations, recurrence, or event details.

Before creating an invitation, verify the calendar, title, date, start and end time, timezone, attendees, location, conference link, reminders, and recurrence.

For recurring events, determine whether a change applies to one occurrence, this and future occurrences, or the series. When scope is missing, do not mutate and ask. Never make a broader change than requested.

Never move or cancel an event without a direct request. Draft attendee communication when useful, but sending it requires separate authorization.

## Reminders and preparation

Create an all-day reminder when the user asks to remember something on a date and a timed reminder when a time is supplied. Ordinary work without a real time commitment belongs in `tasks-operations`, not the calendar. Use native reminders only when provider behavior is reliable and verify creation before reporting success.

Prepare meetings that are external, high-stakes, first-time, unclear, or likely to require a decision. Include only the purpose and desired outcome, attendees and why they matter, relevant project or source context, prior decisions and promises, open questions, useful talking points, and whether the user still needs to attend.

For recurring meetings, carry forward unresolved decisions and promised follow-ups. Flag meetings with no clear purpose, repeated skips, unnecessary attendance, or an obvious shorter format. Recommend a change without applying it.

Use other sources only through their specialist skills and only when they materially improve preparation. Do not create tasks, edit source systems, or save preparation elsewhere unless the user asks or approves that separate action.

Finish when the requested scope was checked, no detail was guessed, protected time was respected, every mutation was verified live, and unavailable calendars or failed actions were reported precisely.
