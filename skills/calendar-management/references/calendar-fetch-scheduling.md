# Calendar fetch and scheduling

## Fetch

Fetch today's calendar and the next 7 days by default.

For deep planning, fetch the next 14 days.

Filter before surfacing events.

1. Event end time is in the future.
2. User attendee response is not declined.
3. Event is not canceled.

Drop past events unless a follow-up exists.

If a source is unreachable, process the other sources and surface the skipped source.

## Scheduling

Use `MEMORY.md` for durable working hours, meeting caps, lunch window, buffers, default length, prep blocks, focus preferences, and exceptions. Verify live calendar state before applying them.

Default meeting length is 30 minutes unless scope clearly needs more.

Offer 3 slots max, spaced across days when possible.

Respect buffers and avoid back-to-back meetings.

Keep at least one 30-minute unblocked slot per half day when possible.
