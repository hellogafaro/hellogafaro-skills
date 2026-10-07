---
name: |-
  shopify-live-support
description: |-
  Routes and prepares Shopify merchant support conversations about payments, billing, shipping, orders, checkout, storefronts, apps, technical defects, or account access, and closes approved conversations with a verified outcome.
notion_page_id: 3dffc798-2e43-816f-ba63-f238b5cae59d
---

# shopify-live-support

## Goal

Prepare and support resolution of a Shopify issue, or leave it with a named owner, documented case, concrete next action, and deadline. When the user asks for live support without naming a channel, default to chat preparation. Before contacting an advisor or sending a reply, show the exact draft and destination and obtain approval to send. A request for help does not approve unseen messages. If a phone conversation cannot satisfy that approval boundary, prepare a call brief for the user rather than conducting an unscripted call autonomously.

Write every user-facing message like a real merchant rather than a support script.

## Hard rules

- Human-facing messages, including opening contact, replies, nudges, and requests to close a conversation, require the user's approval before sending. Monitoring a transcript and preparing evidence may continue without posting. An inactivity warning is not an exception to approval.
- Never press **End chat**. Ask the advisor to close the conversation, then wait until the interface confirms that the advisor ended it.
- Do not open a replacement chat while an active one exists. If a security challenge, MFA, or owner verification appears, ask the user to complete it; never bypass it.
- Obtain explicit user approval before accepting, authorizing, or submitting a money-related, irreversible, or legally consequential action.
- Never use deception, guilt, threats, repeated pressure, false praise, or attempts to make an advisor break policy.
- Route card-network chargebacks to the dedicated Shopify dispute-response procedure.
- Chat messages are plain text only: no em dashes, Markdown, tables, or key/value dumps.

## Workflow

1. Classify before contact. Read [support-routes.md](references/support-routes.md), then exactly one of [billing.md](references/billing.md), [shipping.md](references/shipping.md), or [general.md](references/general.md). Identify the store, the real owner, any in-product record with a deadline, and the desired outcome.
2. Choose and preserve the channel, recover from UI changes, and prepare the case packet: [classify-and-channel.md](references/classify-and-channel.md).
3. Open cleanly, advocate, respect authorization boundaries, and run the live chat: [conversation.md](references/conversation.md).
4. Let the advisor close with a useful outcome, then recap and follow up: [closure.md](references/closure.md).
