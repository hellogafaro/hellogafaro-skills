---
name: |-
  calendar-operations
description: |-
  Use when work involves reviewing calendars, checking availability or conflicts, preparing meetings, or creating, moving, rescheduling, and canceling events. Discover and verify the active agent's available connections, calendars, tools, and permissions before acting.
notion_page_id: 3dffc798-2e43-8199-b3cb-fcf247dfdf73
---

# calendar-operations

Treat live calendars as the source for availability, commitments, attendees, recurrence, reminders, and event status. Check the active agent's available connections and tools, inspect their supported calendar operations and permissions, and verify account ownership before selecting a connection. Do not require a named connector, transport, or local tool. Never rely on a default account or substitute another user's calendar.

## Hard rules

- Resolve the authorized account and calendar before reading or acting. Pass verified selectors on each call when supported. An owner-bound or shared connection is not per-user access; verify authority before using it.
- Never move or cancel an event without a direct request. Draft attendee communication when useful, but sending it requires separate authorization.
- Never infer timezone from a name, company, phone number, or email domain.
- Never invent attendees, addresses, availability, links, locations, recurrence, or event details.
- For recurring events, when the change scope is missing, do not mutate and ask. Never make a broader change than requested.
- Refetch immediately before reporting live availability or changing an event, and verify every write afterwards.

## Reference files

Read only the relevant files under references/ in the attached reference archive. Inspect its contents when the runtime does not resolve a relative reference directly.

## Workflow

1. Check available connections, inspect live operation schemas, resolve the authorized account and calendar, fetch the smallest range, and verify state: [calendar-state.md](references/calendar-state.md).
2. Review commitments, conflicts, and same-day changes, then recommend: [review-and-recommend.md](references/review-and-recommend.md).
3. Create, move, or change events: [schedule-and-change.md](references/schedule-and-change.md).
4. Reminders and meeting preparation: [reminders-and-preparation.md](references/reminders-and-preparation.md).

Finish when the requested scope was checked, no detail was guessed, protected time was respected, every mutation was verified live, and unavailable calendars or failed actions were reported precisely.
