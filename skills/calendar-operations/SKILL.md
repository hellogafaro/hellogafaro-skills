---
name: |-
  calendar-operations
description: |-
  Use when work involves reviewing calendars, checking availability or conflicts, preparing meetings, or creating, moving, rescheduling, and canceling events through Composio.
notion_page_id: 3dffc798-2e43-8199-b3cb-fcf247dfdf73
---

# calendar-operations

Treat live calendars as the source for availability, commitments, attendees, recurrence, reminders, and event status. Use Composio for every calendar read and write, letting its available tooling choose CLI or MCP. Never use Notion Calendar, another connector, or a default account.

## Hard rules

- Resolve the account and calendar before reading or acting. Pass the selected account on every provider call.
- Never move or cancel an event without a direct request. Draft attendee communication when useful, but sending it requires separate authorization.
- Never infer timezone from a name, company, phone number, or email domain.
- Never invent attendees, addresses, availability, links, locations, recurrence, or event details.
- For recurring events, when the change scope is missing, do not mutate and ask. Never make a broader change than requested.
- Refetch immediately before reporting live availability or changing an event, and verify every write afterwards.

## Workflow

1. Resolve the account, fetch the smallest range, and verify state: [calendar-state.md](references/calendar-state.md).
2. Review commitments, conflicts, and same-day changes, then recommend: [review-and-recommend.md](references/review-and-recommend.md).
3. Create, move, or change events: [schedule-and-change.md](references/schedule-and-change.md).
4. Reminders and meeting preparation: [reminders-and-preparation.md](references/reminders-and-preparation.md).

Finish when the requested scope was checked, no detail was guessed, protected time was respected, every mutation was verified live, and unavailable calendars or failed actions were reported precisely.
