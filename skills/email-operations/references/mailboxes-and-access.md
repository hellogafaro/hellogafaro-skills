# Mailboxes and access

## Mailboxes and access

Resolve the receiving mailbox before reading or acting. Pass its Composio account alias or ID on every provider call and reply from that mailbox. Never use another connector or a default account.

If the mailbox is ambiguous, ask one concise question. For complete coverage, inventory active email connections on the selected Composio surface, verify each mailbox with its provider profile, paginate fully, and name any mailbox that could not be checked. If connection inventory is unavailable, use every explicit alias or ID already in scope and say that the inventory could not be verified. Never describe partial coverage as complete.

Use Composio to discover the required operation, live schema, and connection. List accounts when scope is unknown. Do not initialize `composio dev` in an operational project or deliberately trigger a failed call to discover accounts. If a connection is inactive, use Composio connection management and resume only when active. Run independent reads across mailboxes or threads in parallel when supported; do not put them in a sequential shell block. After a failed provider call, inspect its schema, narrow the request, and retry once. After an uncertain write, read current state before retrying. Never switch connector or use raw provider credentials as a fallback.

Search narrowly by mailbox, sender, recipient, subject, date, label, or stable ID. Fetch metadata and previews first. For multi-thread reviews, use a bounded Composio-authenticated provider metadata read to determine message order, senders, labels, and whether the latest inbound was answered when a dedicated thread tool would return unbounded quoted history. Fetch bodies only when previews are insufficient for classification, a decision, summary, draft, or write. A provider-native read through `composio proxy` is allowed for this narrower operation; do not use it to bypass Composio. Use non-mutating reads and paginate fully only for complete searches, reviews, or counts.

Never delete or trash received or sent email. Minimize quoted bodies, forwarded chains, personal data, credentials, and sensitive attachments.

Require explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions. Require explicit approval to archive a thread unless it qualifies for the send-completion rule below. A clear request for a displayed batch counts as approval for that scope. `Archive` or `mark as done` approves archiving the selected resolved thread but never authorizes an unapproved reply. Sending follows the stricter rule below.
