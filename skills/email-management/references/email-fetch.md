Load before fetching, counting, or triaging inbox mail.

## Triage order

Triage is always the inbox, in this order. Surface every layer even when an earlier one is empty.

1. Unread in inbox. Scope unread to the inbox. Never query unread alone: bare unread returns archived and category mail that sits outside the inbox and is out of scope. Unread that is not in the inbox does not count and is left alone.
2. Read in inbox. Read does not mean handled. Open client and counterparty threads hide here. Check sent mail before treating one as closed.
3. Snoozed. Inspect only when it resurfaced, an existing loop depends on it, or the user asks. See `email-snoozed.md`.

Always say which view a count reflects: the whole inbox, or one layer.

## Connected-tool fetch mechanics

Some connected email tools return full message bodies by default and offload large responses to a file instead of returning them inline. When a response reports that it stored output in a file, read that file. Do not trust an empty inline result, which reads as a false zero.

For listing and counts, fetch lightweight: headers and labels only, no bodies. Do not use a fast or optimized metadata mode that silently drops messages or breaks unread counts; it produces false zeros. Confirm unread state and inbox membership from each message's labels, not from a separate count query alone. Paginate to true totals; a non-empty next-page token means more pages remain. Hydrate full bodies only for the specific messages being classified.
