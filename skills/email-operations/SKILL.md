---
name: email-operations
description: Use when work involves searching, reading, triaging, drafting, sending, or changing email through Composio across one or more mailboxes.
---

# email-operations

Treat each email thread as the live source for its conversation. Use Composio for every read and write, letting its available tooling choose CLI or MCP. Keep mailboxes separate. Protect private content. Never invent facts, recipients, attachments, commitments, or message state.

## Mailboxes and access

Resolve the receiving mailbox before reading or acting. Pass its Composio account alias or ID on every provider call and reply from that mailbox. Never use another connector or a default account.

If the mailbox is ambiguous, ask one concise question. For complete coverage, inspect every relevant connected mailbox, paginate fully, and name any mailbox that could not be checked. Never describe partial coverage as complete.

Use Composio to discover the required operation, live schema, and connection. List accounts when scope is unknown. If a connection is inactive, use Composio connection management and resume only when active. Run independent reads across mailboxes or threads in parallel when supported. After a failed provider call, inspect its schema, narrow the request, and retry once. After an uncertain write, read current state before retrying. Never switch connector or use an ad hoc API as a fallback.

Search narrowly by mailbox, sender, recipient, subject, date, label, or stable ID. Fetch metadata and previews first. Read the full thread when content affects classification, a decision, summary, draft, or write. Use non-mutating reads and paginate fully only for complete searches, reviews, or counts.

Never delete or trash received or sent email. Minimize quoted bodies, forwarded chains, personal data, credentials, and sensitive attachments.

Require explicit approval before archive, label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions. A clear request for a displayed batch counts as approval for that scope. Sending follows the stricter rule below.

## Review and triage

Review inbox mail before broader mail. Check unread inbox threads first, then read threads still in the inbox. Check sent mail only when needed to determine whether the user replied or closed the loop. Read state, labels, and inbox membership do not prove action.

Group results by numbered mailbox and lettered thread. Within each mailbox, show urgent threads first and order the rest by usefulness. Do not create category sections. Keep each item to a descriptive title and, when useful, one action line. Mention attachments only when relevant. End with one proposed batch action or question only when it moves the work forward.

Use `URGENT` only for a same-day deadline or genuinely time-sensitive work. Use `RISK` when an unsafe action is plausible, including money, changed payment details, credentials, legal action, or account access. Recommend independent verification through a known channel.

Treat automated replies as informational. Surface bounces, calendar invitations, direct asks, deadlines, and meaningful CC-only messages. Keep copies from different accounts separate unless stable provider IDs prove duplication. Do not merge separate threads merely because sender or subject matches.

## Draft and send

Before drafting, identify the ask, decision, deadline, blocker, owner, and smallest useful next action. Read the full current thread and relevant sent messages from the same mailbox. Match the user's language, register, warmth, brevity, greeting, and sign-off. Keep the thread's language unless asked to switch. Apply `unslop` without flattening the user's voice.

Draft the shortest complete reply. Preserve the subject and native thread for replies. For new messages, use a concise purpose-led subject. Reply to existing human participants by default. Exclude the user's addresses, duplicates, no-reply addresses, automated systems, mailing lists, and bounced recipients. Ask before drafting when the audience is unsafe or unclear.

Draft in chat unless the user explicitly requests and approves a provider draft. Show the complete message in one plain-text block with From, To, CC, BCC, Subject, Attachments, and body. Use `none` for empty fields.

Never send without a fresh imperative instruction authorizing the exact final version shown in the current turn. `Looks good`, `approved`, `fine`, edits, and silence approve wording only. Any change to sender, recipients, subject, body, links, attachments, or thread resets send approval.

Immediately before sending, refetch the thread. Stop if a new message changes the reply. Verify mailbox, recipients, thread, links, attachment filenames, and attachment references. After sending, verify the sent message when supported. Report failures with the smallest recovery step. Do not archive unless that action was also displayed and approved.

## Tasks and follow-ups

Surface required replies, decisions, deadlines, blockers, meetings, document updates, bounces, and open loops. Do not turn every email into process debris.

For actionable email, propose a Notion task through `tasks-operations`. Contribute the canonical thread link, minimum verified context, and smallest next action; let that skill own task fields and writing. Create or update tasks only when the user asks or approves the displayed set. Search before creating. A task never replaces a required reply.

Use provider labels only for a real useful state and only with approval. A label does not prove that a task or follow-up exists elsewhere.

Finish when the requested mailboxes were covered, relevant threads were read, complete claims were fully paginated, drafts match the user's voice, recipients are safe, private content is minimal, approved writes were verified, and every material open loop has a clear next action. Fix safe failures; report the rest by mailbox and operation.
