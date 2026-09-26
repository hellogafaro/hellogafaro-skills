---
name: |-
  email-operations
description: |-
  Use when work involves searching, reading, triaging, drafting, sending, or changing email through Composio across one or more mailboxes.
notion_page_id: 3dffc798-2e43-816f-bc5f-ef5e1d24ff31
---

# email-operations

Treat each email thread as the live source for its conversation. Use Composio for every read and write, letting its available tooling choose CLI or MCP. Keep mailboxes separate. Protect private content. Never invent facts, recipients, attachments, commitments, or message state.

## Hard rules

- Resolve the receiving mailbox before reading or acting. Pass its Composio account alias or ID on every provider call and reply from that mailbox. Never use another connector or a default account.
- Never delete or trash received or sent email.
- Require explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions.
- Never send without a fresh imperative instruction authorizing the exact final version shown in the current turn.
- Never describe partial coverage as complete.

## Workflow

1. Resolve mailboxes, discover operations through Composio, and search narrowly: [mailboxes-and-access.md](references/mailboxes-and-access.md).
2. Review and triage the inbox with the flag and queue format: [review-and-triage.md](references/review-and-triage.md).
3. Draft in the user's voice, show the full message, and send or archive only under the approval rules: [draft-and-send.md](references/draft-and-send.md).
4. Surface open loops, propose Notion tasks through `tasks-operations`, and apply the completion checklist: [tasks-and-follow-ups.md](references/tasks-and-follow-ups.md).
