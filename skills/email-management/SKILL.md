---
name: email-management
description: Use when work involves email or Gmail, including fetch, triage, search, labels, replies, drafts in chat, send approval, attachments, snoozing, archiving, account routing, or Inbox sync for email loops.
---

# email-management

Use this skill any time the request involves email, fetch, triage, draft, reply, archive, snooze, label, attachments, or search.

Email and Inbox are one system. Any email action that opens, changes, or closes a loop must update the user's Inbox.

## References

Load only when needed.

- `references/email-signal-rules.md` before classifying email.
- `references/email-responding.md` before drafting or sending.
- `references/email-inbox-sync.md` whenever an email loop affects Inbox.
- `references/email-edge-cases.md` for bounces, out-of-office auto-replies, email calendar invites, phishing or payment-change risk, duplicate threads, CC-only mail, and other nonstandard loops.
- `references/email-snoozed.md` when snoozing or resurfacing a snoozed item.
- `references/email-attachments.md` before sending attachments.
- `references/email-auto-rules.md` before suggesting or creating repeated email rules.

## Hard rules

- Never rely on the default mailbox.
- Identify the receiving account before reading, drafting, replying, archiving, labeling, or sending.
- Check all connected email accounts before reporting a thread is not found.
- Never mix accounts.
- Reply from the receiving account.
- Read the full thread before classifying, archiving, or replying.
- Refetch live before every status report, classification, reply decision, archive action, or send action.
- Inbox label staying on a message is not proof the user has not acted.
- Check sent mail when verifying whether an email-linked Inbox item is still open.
- Never create email drafts unless the user explicitly asks for a mail-client draft.
- Draft in chat or page content by default.
- Never send without explicit send approval.
- Edited draft text is not send approval.
- Never delete or trash. Archive only.
- Use Contacts for unknown contacts.
- Private email bodies stay private.

## Account handling

Use Memory for email accounts, account roles, SLAs, signature, language, VIPs, counterparties, and quirks.

For every account used in a run, verify that the mailbox is the intended account before taking action.

If one account is unreachable, process the others and say which account was skipped.

## Fetch and search

Start with Inbox and unread, then Inbox only.

Never read all mail without a specific reason.

Read enough context to classify accurately. Subject and preview are not enough for support, vendor, customer, legal, finance, or active project threads.

When searching for a thread, search all connected email accounts before reporting not found.

## Output

Keep output concise.

Report urgent threads needing action, drafts ready for approval, what was archived, and the smallest next action.
