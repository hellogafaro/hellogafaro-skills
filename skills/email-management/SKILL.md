---
name: email-management
description: Manage email across connected accounts, including fetch, triage, search, replies, sending approval, attachments, labels, snoozing, archiving, and Inbox sync.
---

# email-management

Use this skill any time the request involves email, fetch, triage, draft, reply, archive, snooze, label, attachments, or search.

Email and Inbox are one system. Any email action that opens, changes, or closes a loop must update the user's Inbox.

## references

Load only when needed.

- `references/email-signal-rules.md` before classifying email.
- `references/email-responding.md` before drafting or sending.
- `references/email-inbox-sync.md` whenever an email loop affects Inbox.
- `references/email-edge-cases.md` when the email does not fit the normal decision loop.
- `references/email-snoozed.md` when snoozing or resurfacing a snoozed item.

## hard rules

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

## account handling

Use Memory for email accounts, account roles, SLAs, signature, language, VIPs, counterparties, and quirks.

For every account used in a run, verify that the mailbox is the intended account before taking action.

If one account is unreachable, process the others and say which account was skipped.

## fetch and search

Start with Inbox and unread, then Inbox only.

Never read all mail without a specific reason.

Read enough context to classify accurately. Subject and preview are not enough for support, vendor, customer, legal, finance, or active project threads.

When searching for a thread, search all connected email accounts before reporting not found.

## classification

Classify every email once.

- Reply needed means VIP sender, direct question, active problem, time-sensitive ask, decision needed, or counterparty waiting on the user.
- Review means useful FYI, confirmation, invoice, update, or CC the user should know.
- Noise means newsletters, marketing, cold outreach, social notifications, routine automated notifications, and spam.

When signals are mixed, default to FYI unless the sender is VIP or the thread contains a direct ask.

Known contacts are never downgraded to newsletter just because the message looks automated.

## reply rules

Draft a reply only when there is a direct question, decision required, commitment to acknowledge, or counterparty waiting on the user.

FYI close-the-loop messages with no ask, question, or decision pending get archived or left in source, not answered.

Before drafting, read the latest thread context and mirror the user's recent tone when available.

Use the counterparty's language and timezone.

## send approval

Approval must be explicit.

Words like `send`, `ship it`, `fire it`, or a direct equivalent approve sending when paired with the specific draft or item.

`Looks good`, `ok`, `approved`, silence, edited wording, or replacement draft text approve the draft text only. They do not approve sending.

After edits, show the final exact text and wait for explicit send approval.

After sending, verify the sent state when possible, archive if the loop is closed, and update Inbox.

## attachments

Before sending attachments, verify the attachment is the intended file and the sending method supports it.

If the email tool requires uploaded attachment objects, obtain or create the upload first. Do not invent attachment references.

Keep message size under the provider limit.

Show recipients, subject, body, and attachment names before asking for send approval.

## Inbox sync

Every opened email loop ends as one of these states.

- Closed and archived.
- Waiting in Inbox.
- To do in Inbox.
- Alert in Inbox.
- Handoff to the responsible agent.

Waiting means someone else owns the next response.

To do means the user or agent owns the next action.

If the user already replied outside the flow, sync Inbox and do not re-draft.

## auto-rules

Default no new auto-archive rules.

Build rules only from observed repeated user behavior.

- Same newsletter archived three or more times means suggest unsubscribe or auto-archive.
- Same notification pattern archived repeatedly means suggest an auto-rule.
- Never silently invent a new rule.
- Never auto-archive VIPs.

Active auto-rules live in Memory.

## output

Keep output concise.

Report urgent threads needing action, drafts ready for approval, what was archived, and the smallest next action.
