---
name: calendar-management
description: Use when work involves calendars, meetings, scheduling, rescheduling, conflict checks, availability, out of office, meeting prep, calendar triage, calendar search, or Inbox sync for calendar loops.
---

# calendar-management

Use this skill any time the request involves calendar, fetch, triage, scheduling, conflict resolution, meeting prep, out of office, or routing meetings into Inbox.

Calendar and Inbox are one system. Any calendar action that opens, changes, or closes a loop must update the repository-root `INBOX.md`.

## References

Load only when needed.

- `references/calendar-triage.md` at the start of every calendar run.
- `references/calendar-conflicts.md` when a conflict, move, cancellation, or tentative hold appears.
- `references/calendar-prep.md` before building meeting prep.
- `references/calendar-edge-cases.md` for out of office, travel, recurring changes, timezone ambiguity, short notice, or source failures.
- `references/calendar-fetch-scheduling.md` for fetch windows and scheduling defaults.
- `references/calendar-inbox-sync.md` when calendar state affects Inbox.

## Hard rules

- Inspect live Composio calendar connections and use every account needed for the request.
- Select the intended account explicitly whenever more than one calendar connection exists.
- Verify the calendar source before reporting state or making changes.
- Never create, delete, cancel, move, reschedule, or invite people without explicit confirmation.
- `Schedule`, `book`, or `add` means draft event details and wait for confirmation.
- `Cancel`, `remove`, or `delete` means show what will be changed and wait for confirmation.
- `Move` or `reschedule` means show current slot and proposed slot, then wait for confirmation.
- Do not schedule into out of office, focus blocks, protected lunch, or unavailable time without explicit override.
- Counterparty timezone is the timezone shown in scheduling messages.
- Never make the counterparty convert time.

## Output

Keep output concise.

Mention meetings in the next 24 hours that need attention, conflicts, proposed meetings waiting for confirmation, prep gaps, and the smallest useful next action.

Skip empty sections.
