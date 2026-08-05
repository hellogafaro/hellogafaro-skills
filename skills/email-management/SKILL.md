---
name: email-management
description: Use when work involves email or Gmail, including fetch, triage, search, labels, replies, drafts in chat, send approval, attachments, snoozing, archiving, account routing, or Inbox sync for email loops.
---

# email-management

Use this skill any time the request involves email, fetch, triage, draft, reply, archive, snooze, label, attachments, or search.

Email and Inbox are one system. Any email action that changes a user-owned loop must update its Inbox projection when one exists.

## References

Load only when needed.

- `references/email-signal-rules.md` before classifying email.
- `references/email-responding.md` before drafting or sending.
- `references/email-inbox-sync.md` whenever an email loop affects Inbox.
- `references/email-edge-cases.md` for bounces, out-of-office auto-replies, email calendar invites, phishing or payment-change risk, duplicate threads, CC-only mail, and other nonstandard loops.
- `references/email-snoozed.md` when snoozing or resurfacing a snoozed item.
- `references/email-fetch.md` before fetching, counting, or triaging inbox mail.
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
- Check sent mail only when verifying whether an existing email-linked Inbox item is still open.
- Never create email drafts unless the user explicitly asks for a mail-client draft.
- Draft in chat or page content by default.
- Never send without explicit send approval.
- Edited draft text is not send approval.
- Never send on earlier or implied approval after recipients, subject, body, links, attachments, sender account, thread, or source content are discovered, edited, or changed. Show the final exact version again and get a fresh send instruction.
- Never treat early intent ("let's send", "send it over", "we should email them", "looks good", "ok", "approved"), edited wording, or silence as approval to send a final email that has not been shown in its exact final form.
- Never delete or trash. Archive only.
- Use Contacts for unknown contacts.
- Private email bodies stay private.

## Account handling

Use `Memory` for durable voice, signature, language, VIP, counterparty, SLA, and source-quirk preferences. Do not store connection selectors or live connection state there.

List live Composio email connections and select the intended account explicitly for every account used in a run.

If one account is unreachable, process the others and say which account was skipped.

Pass the live Composio account selector on every command and use the proper connected account, never delegation through another mailbox. If selection is ambiguous, ask before acting. If a mailbox returns a delegation-denied error, inspect live connections and retry only with the verified intended account before reporting the mailbox blocked or the thread missing.

## Fetch and search

Triage the inbox in order: unread, then read mail still in inbox. Inspect snoozed mail when it has resurfaced, an existing loop depends on it, or the user asks.

Unread takes priority over read, but read mail still in the inbox may remain unprocessed work. During Inbox preparation, project only concrete replies, decisions, deadlines, and blockers rather than every unprocessed message.

Scope unread to the inbox. Open client and counterparty threads also hide in read inbox mail, so check sent mail before treating one as closed.

Never read all mail without a specific reason. Read enough context to classify accurately. Subject and preview are not enough for support, vendor, customer, legal, finance, or active project threads.

When searching for a thread, search all connected email accounts before reporting not found.

See `references/email-fetch.md` for query scoping and connected-tool fetch mechanics.

## Output

Keep output concise.

Report urgent threads needing action, drafts ready for approval, what was archived, and the smallest next action.
