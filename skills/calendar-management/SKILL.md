---
name: calendar-management
description: Use when work involves calendars, meetings, scheduling, rescheduling, conflict checks, availability, out of office, meeting prep, calendar triage, calendar search, or Inbox sync for calendar loops.
---

# calendar-management

Use this skill any time the request involves calendar, fetch, triage, scheduling, conflict resolution, meeting prep, out of office, or routing meetings into Inbox.

Calendar and Inbox are one system. Any calendar action that opens, changes, or closes a loop must update the user's Inbox.

## references

Load only when needed.

- `references/calendar-triage.md` at the start of calendar triage.
- `references/calendar-conflicts.md` when a conflict, move, cancellation, or tentative hold appears.
- `references/calendar-prep.md` before building meeting prep.
- `references/calendar-edge-cases.md` for out of office, travel, recurring changes, timezone ambiguity, short notice, or source failures.

## hard rules

- Use all connected calendars needed for the user.
- Verify the calendar source before reporting state or making changes.
- Never create, delete, cancel, move, reschedule, or invite people without explicit confirmation.
- `Schedule`, `book`, or `add` means draft event details and wait for confirmation.
- `Cancel`, `remove`, or `delete` means show what will be changed and wait for confirmation.
- `Move` or `reschedule` means show current slot and proposed slot, then wait for confirmation.
- Do not schedule into out of office, focus blocks, protected lunch, or unavailable time without explicit override.
- Counterparty timezone is the timezone shown in scheduling messages.
- Never make the counterparty convert time.

## fetch

Fetch today's calendar and the next 7 days by default.

For deep planning, fetch the next 14 days.

Filter before surfacing events.

1. Event end time is in the future.
2. User attendee response is not declined.
3. Event is not canceled.

Drop past events unless a follow-up exists.

If a source is unreachable, process the other sources and surface the skipped source.

## scheduling

Use Memory for working hours, meeting caps, lunch window, buffers, default length, prep blocks, focus preferences, and exceptions.

Default meeting length is 30 minutes unless scope clearly needs more.

Offer 3 slots max, spaced across days when possible.

Respect buffers and avoid back-to-back meetings.

Keep at least one 30-minute unblocked slot per half day when possible.

## triage

For every new meeting request or unclear event, check purpose, whether the user is needed, async fit, confirmation, conflicts, and prep needs.

If purpose is unclear, ask for agenda or propose async.

If the user is not needed, suggest delegate, async, or decline.

If the meeting is proposed but not confirmed, add Waiting in Inbox instead of treating it as scheduled.

## conflicts

Priority order is user explicit request, VIP or key customer, existing commitment, then new request.

For same-tier conflicts, recommend what to keep or move and explain why.

Same-day cancellation, move, or reschedule by a counterparty becomes an Alert in Inbox.

## meeting prep

Every status or day run checks meetings in the next 24 hours.

Prepare context for important, external, VIP, or unclear meetings.

Prep includes why the meeting exists, who is attending, relevant source links, recent messages, prior promises, open questions, suggested agenda, and whether the user is actually needed.

Tentative or declined events get no prep unless the user asks.

Past meetings leave Inbox unless a follow-up remains.

## Inbox sync

- Meeting confirmed in the next 24 hours becomes a Meeting item.
- Meeting proposed but unconfirmed becomes Waiting.
- Same-day cancellation or move becomes Alert.
- Out of office or travel becomes Reminder or Alert when it affects the day.
- Promised follow-up becomes To do.
- Remove stale meeting prep when the meeting passes or is canceled.

## output

Keep output concise.

Mention meetings in the next 24 hours that need attention, conflicts, proposed meetings waiting for confirmation, prep gaps, and the smallest useful next action.

Skip empty sections.
