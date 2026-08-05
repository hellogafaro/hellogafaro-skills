# Calendar fetch and scheduling

## Fetch

For Inbox preparation, fetch the exact target date across every connected calendar. Use Memory to interpret account roles and source quirks. Exclude canceled events and events the user declined. Deduplicate mirrored events by canonical identity and stable event details.

Keep timed events in chronological order. Include all-day events only when they are relevant or actionable. Fetch tomorrow or later only when the user asks or that context materially changes today's plan.

For availability or planning requests, fetch the narrowest future window that answers the question, normally 7 days and at most 14 days for deep planning.

## Scheduling

Use `Memory` for durable timezone, working hours, meeting caps, lunch window, buffers, default length, prep blocks, focus preferences, and exceptions. Verify live calendar state before applying them.

Default meeting length is 30 minutes unless scope clearly needs more. Offer at most three slots, respect buffers, and avoid unavailable blocks.

Create an all-day calendar event for `remember X on Friday` and a timed event when a time is supplied. `Do X on Friday` belongs in the future Inbox or canonical Task instead.
