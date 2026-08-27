---
name: email-operations
description: Use when work involves searching, reading, triaging, drafting, sending, or changing email through Composio across one or more mailboxes.
---

# email-operations

Treat each email thread as the live source for its conversation. Use Composio for every read and write, letting its available tooling choose CLI or MCP. Keep mailboxes separate. Protect private content. Never invent facts, recipients, attachments, commitments, or message state.

## Mailboxes and access

Resolve the receiving mailbox before reading or acting. Pass its Composio account alias or ID on every provider call and reply from that mailbox. Never use another connector or a default account.

If the mailbox is ambiguous, ask one concise question. For complete coverage, inventory active email connections on the selected Composio surface, verify each mailbox with its provider profile, paginate fully, and name any mailbox that could not be checked. If connection inventory is unavailable, use every explicit alias or ID already in scope and say that the inventory could not be verified. Never describe partial coverage as complete.

Use Composio to discover the required operation, live schema, and connection. List accounts when scope is unknown. Do not initialize `composio dev` in an operational project or deliberately trigger a failed call to discover accounts. If a connection is inactive, use Composio connection management and resume only when active. Run independent reads across mailboxes or threads in parallel when supported; do not put them in a sequential shell block. After a failed provider call, inspect its schema, narrow the request, and retry once. After an uncertain write, read current state before retrying. Never switch connector or use raw provider credentials as a fallback.

Search narrowly by mailbox, sender, recipient, subject, date, label, or stable ID. Fetch metadata and previews first. For multi-thread reviews, use a bounded Composio-authenticated provider metadata read to determine message order, senders, labels, and whether the latest inbound was answered when a dedicated thread tool would return unbounded quoted history. Fetch bodies only when previews are insufficient for classification, a decision, summary, draft, or write. A provider-native read through `composio proxy` is allowed for this narrower operation; do not use it to bypass Composio. Use non-mutating reads and paginate fully only for complete searches, reviews, or counts.

Never delete or trash received or sent email. Minimize quoted bodies, forwarded chains, personal data, credentials, and sensitive attachments.

Require explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions. Require explicit approval to archive a thread unless it qualifies for the send-completion rule below. A clear request for a displayed batch counts as approval for that scope. `Archive` or `mark as done` approves archiving the selected resolved thread but never authorizes an unapproved reply. Sending follows the stricter rule below.

## Review and triage

For a general review, default to threads currently in the inbox. Check unread inbox threads first, then read threads still in the inbox. Ignore unread mail outside the inbox unless the user asks for it. Check sent mail only when needed to determine whether the user replied or closed the loop. Read state, labels, and inbox membership do not prove action.

Group results by lettered mailbox and numbered thread. Start a queue with the first mailbox, without a title or preamble. Within each mailbox, show urgent threads first, then overdue threads, then unread direct asks, then the rest by usefulness. Format each item as `1. Subject · Sender · FLAGS`, include only applicable flags, and add one concise summary line. Do not show account IDs, provider labels, category sections, or technical coverage. Mention attachments only when relevant. End with one proposed action or question only when it moves the work forward.

Use `URGENT` only for a same-day deadline or genuinely time-sensitive work. Use `RISK` when an unsafe action is plausible, including money, changed payment details, credentials, legal action, or account access. Use `OVERDUE` when the latest unanswered inbound has waited at least seven full days while the thread remains in the inbox. These are display flags, not provider labels. For `RISK`, recommend independent verification through a known channel. For `OVERDUE`, push for a decision to reply, archive, unsubscribe, or snooze.

Treat the inbox as a current-action queue. Keep a thread in the inbox while the user's next action is pending and has not been completed or captured elsewhere. Waiting for the recipient's response is not a reason to keep a thread in the inbox. After the reply is sent or any remaining work is captured in an approved task, archive as the normal clean-inbox action under the send-completion rule below. Keep an inbox thread unread only when a reply, deliberate reading, or other work is still pending. Never unsubscribe, snooze, or change read state without approval.

Treat automated replies as informational. Surface bounces, calendar invitations, direct asks, deadlines, and meaningful CC-only messages. Keep copies from different accounts separate unless stable provider IDs prove duplication. Do not merge separate threads merely because sender or subject matches.

## Draft and send

Before drafting, identify the ask, decision, deadline, blocker, owner, and smallest useful next action. Read the full current thread and relevant sent messages from the same mailbox. Derive voice from the user's own messages in that thread, not from the sender. Match the language, register, warmth, brevity, greeting, and sign-off already in use. Keep the current conversation language unless asked to switch. Apply `unslop` without flattening the user's voice.

Draft the shortest complete reply. Preserve the subject and native thread for replies. For new messages, use a concise purpose-led subject. Reply to existing human participants by default. Exclude the user's addresses, duplicates, no-reply addresses, automated systems, mailing lists, and bounced recipients. Ask before drafting when the audience is unsafe or unclear.

Draft in chat unless the user explicitly requests and approves a provider draft. Show the complete message in one plain-text block with From, To, CC, BCC, Subject, Attachments, and body. Use `none` for empty fields.

Never send without a fresh imperative instruction authorizing the exact final version shown in the current turn. `Looks good`, `approved`, `fine`, edits, and silence approve wording only. Any change to sender, recipients, subject, body, links, attachments, or thread resets send approval.

Immediately before sending, refetch the thread. Stop if a new message changes the reply. Verify mailbox, recipients, thread, links, attachment filenames, and attachment references. After sending, verify the sent message when supported. A fresh instruction to send the exact approved reply also authorizes archiving that thread after verified delivery when no further action remains for the user because the work is complete or continuing work is captured in an approved task. This send-completion rule applies while waiting for the recipient's response and does not require a separate archive prompt. Do not archive when delivery is uncertain, a new message changes the state, or the user's next action remains incomplete and uncaptured. Verify the archive and report that the reply was sent and the thread archived. Report failures with the smallest recovery step.

## Tasks and follow-ups

Surface required replies, decisions, deadlines, blockers, meetings, document updates, bounces, and open loops. Work one selected thread at a time: gather its context, complete or organize the needed work, then draft the reply. Do not turn every email into process debris.

For actionable email, propose a Notion task through `tasks-operations`. Contribute the canonical thread link, minimum verified context, and smallest next action; let that skill own task fields and writing. Create or update tasks only when the user asks or approves the displayed set. Search before creating. A task never replaces a required reply. Before proposing or performing archive, confirm that decisions and commitments are understood, the required reply is complete, and any continuing work is finished or captured in an approved task.

Use provider labels only for a real useful state and only with approval. A label does not prove that a task or follow-up exists elsewhere.

Finish when the requested mailboxes were covered, relevant threads were read, complete claims were fully paginated, drafts match the user's voice, recipients are safe, private content is minimal, approved writes were verified, resolved threads left the inbox, and every material open loop has a clear next action. Fix safe failures; report the rest by mailbox and operation.
