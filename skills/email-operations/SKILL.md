---
name: |-
  email-operations
description: |-
  Use when work involves searching, reading, triaging, drafting, sending, or changing email across one or more mailboxes. Discover and verify the active agent's available connections, accounts, tools, and permissions before acting.
notion_page_id: 3dffc798-2e43-816f-bc5f-ef5e1d24ff31
---

# email-operations

Treat each email thread as the live source for its conversation. Check the active agent's available connections and tools, inspect their supported email operations and permissions, and verify account ownership before selecting a connection. Do not require a named connector, transport, or local tool. Keep mailboxes separate. Protect private content. Never invent facts, recipients, attachments, commitments, or message state.

## Hard rules

- Resolve the receiving mailbox before reading or acting. Pass its verified account selector on every call when supported and reply from that mailbox. Never rely on a default account, substitute another user's mailbox, or treat an owner-bound connection as per-user access.
- Never delete or trash received or sent email.
- Require explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions.
- Never send without a fresh imperative instruction authorizing the exact final version shown in the current turn.
- Never describe partial coverage as complete.

## Reference files

Read only the relevant files under references/ in the attached reference archive. Inspect its contents when the runtime does not resolve a relative reference directly.

## Workflow

1. Check available connections, resolve authorized mailboxes, inspect live operation schemas, and search narrowly: [mailboxes-and-access.md](references/mailboxes-and-access.md).
2. Review and triage the inbox with the flag and queue format: [review-and-triage.md](references/review-and-triage.md).
3. Draft in the user's voice, show the full message, and send or archive only under the approval rules: [draft-and-send.md](references/draft-and-send.md).
4. Surface open loops, propose Notion tasks through `tasks-operations`, and apply the completion checklist: [tasks-and-follow-ups.md](references/tasks-and-follow-ups.md).
