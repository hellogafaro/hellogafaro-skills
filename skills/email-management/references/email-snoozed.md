# Snoozed email

Use native snooze only when the connected tool supports it reliably. Inspect the live mailbox for its actual snooze behavior and never store provider label IDs in `Memory`.

When snoozed mail resurfaces, fetch the original thread and surface it only if the user now owns a concrete reply, decision, deadline, or blocker.

When native snooze is unavailable and the user needs guaranteed resurfacing, archive the thread and create a dated calendar reminder linked to it. A passive reminder belongs to the exact date and never carries forward.

On reply, completion, cancellation, or rescheduling, update the canonical email or calendar source.
