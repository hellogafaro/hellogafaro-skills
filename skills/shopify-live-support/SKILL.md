---
name: shopify-live-support
description: Use when routing, conducting, or closing Shopify support conversations for merchant issues including payments, billing, shipping, orders, checkout, storefront, apps, technical defects, account access, and Shopify Payments.
---

# shopify-live-support

## Goal

Resolve a Shopify support issue through chat or phone, or leave it with a named owner, documented case, concrete next action, and deadline. When the user asks for Shopify live support without naming a channel, default to chat. If the user requests phone support and calling tools are available, place and conduct the call yourself. Involve the user only for an unavoidable identity, authentication, or consent step.

## 1. Classify before contact

Read [support-routes.md](references/support-routes.md), then read exactly one primary issue reference:

- [billing.md](references/billing.md) for invoices, subscriptions, plans, charges, credits, and billing ownership;
- [shipping.md](references/shipping.md) for Shopify Shipping labels, carriers, delivery failures, claims, insurance, and service refunds;
- [general.md](references/general.md) for storefront, checkout, orders, apps, account access, domains, technical defects, and other issues.

Identify:

- the affected store, organization, market, and timezone;
- the product area and actual owner (Shopify, Shopify Shipping, Shopify Payments, app vendor, carrier, payment gateway, or card network);
- whether there is an in-product record with a deadline (dispute, payout hold, order, billing invoice, shipping claim);
- the desired outcome: fix, refund, dispute response, trace, escalation, policy answer, or documented follow-up.

For card-network chargebacks, use the dedicated `shopify-chargeback` skill. Prepare evidence in the Shopify Admin dispute record or third-party payment provider before its deadline, and submit it only with explicit user authorization. Live support is an escalation channel, not necessarily the system of record.

## 2. Choose and preserve the support channel

Use chat unless the user specifies phone or chat is unavailable. For phone support, use the available calling tool to place and conduct the call. Keep the same case packet, authorization boundaries, advocacy sequence, and completion criteria across both channels. Do not redirect a callable support workflow to the user.

For chat, use the collaborative browser.

1. Call `preview_status`. If no automation-capable tab is attached, call `preview_open`.
2. Use `preview_navigate` to open `https://help.shopify.com/` in a dedicated support tab. Keep any Shopify Admin evidence tab separate; never navigate the active chat tab away.
3. Snapshot before each interaction. Use snapshot locators with `preview_click`, `preview_type`, `preview_wait_for`, and `preview_scroll`.
4. Sign in, then verify the top-right active organization/store. Change it from the store switcher before beginning contact. State the selected store in the first message when several stores could be confused.
5. Choose **Chat with a human**, then **Chat**. If the pre-chat assistant asks to connect with an advisor, select **Connect** and wait for the advisor to join.

### Recover from UI changes

Treat the UI as a state machine, not a fixed sequence of selectors: Help Center, contact menu, queue, connect, live chat, closure warning, and ended transcript. After every action, verify the expected state from a fresh snapshot or visible text.

- If the expected state is absent, resnapshot and use the current semantic role, visible text, or accessible name. Reuse the latest confirmed locator, not an old CSS path or coordinate.
- If the browser tool or network response is uncertain, call `preview_status` and inspect the existing tab before retrying. Never resend a message, open a second chat, or navigate away until the current state is known.
- Use `preview_evaluate` only to inspect or activate a current, visible control when snapshot locators are insufficient. Verify the resulting state immediately.
- Recover cookie banners, menus, login redirects, and store-switcher changes in place. Stop only for user-owned MFA, identity verification, or a genuinely unavailable browser.

Do not open a replacement chat while an active one exists. If a security challenge, MFA, or owner verification appears, ask the user to complete it; never bypass it.

## 3. Prepare the case packet

Collect only evidence relevant to the issue. Default packet:

- store/organization, issue title, affected URL or feature, and timezone;
- order, payment, payout, subscription, label, tracking, invoice, or error IDs as applicable;
- dates, exact expected result, actual result, and business/customer impact;
- screenshots or a short recording, plus reproducible steps for technical defects;
- the remedy requested and any time-sensitive deadline.

Avoid exposing passwords, full payment details, API secrets, or unnecessary customer data. Use an existing Shopify support email or Support Inbox thread when it already contains the relevant history; it is usually faster than starting a new case.

## 4. Start the conversation cleanly

Write like a real merchant in a professional but relaxed conversation. Use warm, natural, simple English. Always begin sentences with a capital letter and correctly capitalize people, brands, products, teams, and identifiers. Use plain text only in chat messages. Do not use em dashes, Markdown formatting, tables, or form-like key/value pairs.

Prefer several short messages over one dense block. Brief chat messages do not always need a final period. Use commas, contractions, and conversational fragments naturally when they remain clear. Avoid both stiff corporate language and careless all-lowercase chat. Do not overdo informality.

Break a complex case into two or three short messages rather than one dense paragraph:

1. State the issue and the desired outcome.
2. Give only the facts that establish it.
3. Ask for the concrete action, owner, case reference, and deadline.

Open with two or three short messages when the case needs context:

```text
Hi, I need help with [specific issue] for [store]
[One short message with the key IDs, dates, and current status]
Could you [specific action] and confirm who owns the next step?
```

Answer the advisor's immediate question first, then add only the context needed for the next action. Do not repeat the complete case packet when it is already visible. Correct a wrong classification politely and explicitly. Do not claim eligibility, policy, reimbursement, completion, or escalation that the advisor has not confirmed.

## 5. Advocate effectively

Treat the advisor as a partner who can help navigate the real process, not as an obstacle. The goal is to make the legitimate best option easy for them to identify, document, and own.

- Use the advisor's name once it is given. Thank them for specific work they actually did, such as checking an internal policy or consulting a specialist.
- Reduce their workload: send clean facts, answer their questions directly, attach only relevant evidence, and state the exact action needed.
- Explain the business or customer impact truthfully and concretely. Do not exaggerate urgency or invent customer harm.
- Ask open but focused questions that surface legitimate options: "What are all the available paths from your side?" and "If this is outside your scope, which team can own the next step?"
- When the immediate answer is no, remain calm and narrow the next request: "I understand that limitation. Is there another eligible path? If not, please document the trigger, deadline, and the team that will handle it."
- Ask for escalation only when there is a real need: a deadline, a documented policy conflict, account-specific access, a platform defect, or an unresolved owner. Phrase it as a request for the team with the required authority, not a demand for a supervisor.

Work through this progression until the requested outcome or a durable handoff is secured:

1. Check whether an existing case already contains the requested answer, document, or action.
2. Ask the advisor to complete the specific action now.
3. If the advisor lacks access or authority, ask for the team that has it.
4. Confirm the escalation explicitly includes the requested action rather than a generic review.
5. Obtain the owner, continuation channel, reference, deadline, or an explicit statement that no timeframe is available.

Empathy and status language such as "I understand," "almost there," or "thanks for your patience" are not outcomes. Treat a record check, completed action, submitted request, filed escalation, named owner, reference, or confirmed continuation channel as progress.

Never use deception, guilt, threats, repeated pressure, false praise, or attempts to make an advisor break policy. Do not imply the advisor is personally at fault. Firm, evidence-led persistence is more effective and produces a cleaner case record.

## 6. Respect authorization boundaries

Act autonomously to investigate, explain, request options, open or update a support case, and attach user-approved evidence. Obtain explicit user approval before accepting, authorizing, or submitting a money-related, irreversible, or legally consequential action, including refunds, credits, charges, billing changes, settlements, final disputes or claims, account closure, app uninstall, data deletion, user/permission changes, or security-setting changes.

If the advisor presents such an action, ask for a written handoff instead of deciding: "Please email the case reference, available options, amount or account impact, deadline, and exact next step. I need merchant approval before accepting or making that change." Ask them to record pending merchant approval or preserve the deadline when possible. Do not claim that approval has been granted.

## 7. Run the live chat

- Keep messages warm, professional, specific, and easy to digest. Sound human rather than scripted: thank the advisor for a real update, state the impact without exaggeration, and make the next request plainly.
- Do not write em dashes, Markdown, tables, labels such as `Facts:` or `Impact:`, or key/value-style dumps in the message itself. Turn the same information into short prose or concise bullets.
- Prefer several brief messages over a long dense paragraph, but do not split a simple point unnecessarily or send consecutive nudges before the advisor has had time to respond.
- Inspect the transcript and session state silently every 15 to 30 seconds while the conversation is active. Frequent inspection does not justify frequent messages.
- Acknowledge a new advisor response promptly. If the advisor is investigating and there is no new response, send one concise check-in after about five minutes. Reset that timer after a meaningful progress update, and do not send repeated nudges unless the advisor gave a shorter return time or the interface signals closure.
- If the chat shows an inactivity warning, countdown, "still there" prompt, or possible closure, reply immediately that the merchant is present and ask to keep the session open while requesting the next concrete update. Do not wait for the normal follow-up interval.
- Ask for one concrete action at a time: file, escalate, trace, reproduce, enable, credit, or email the case. Ask who owns the next step and when it will happen.
- After every send, verify the message appears in the transcript before sending another one. If a send result is uncertain, inspect the transcript and input before retrying. Never duplicate a message blindly or send so quickly that Shopify can merge or drop messages.
- Attach requested evidence only after confirming it is relevant and contains no unnecessary sensitive data.

## 8. Let the advisor close with a useful outcome

Before ending chat, obtain at least one of these:

1. A verified resolution.
2. A case/reference number and a named Shopify team or owner.
3. A promised email/transcript that is the continuation thread, with the next action and deadline documented.
4. A clear external owner and handoff if the issue is not Shopify-owned.

Confirm the exact policy deadline, documentation required later, and how to resume the case. If the advisor says the action is conditional, document the trigger, filing window, and reply path.

Never press **End chat**. Ask the advisor to close the conversation, then wait until the interface confirms that the advisor ended it. This remains true when Shopify says a case will be created only after closure. After the advisor closes it, verify the transcript destination and any promised case-reference or follow-up delivery.

## 9. Recap and follow-up

When asked for a recap, use the `summarize` skill's compact handoff style but omit any tracked-time sentence. Include only the verified issue, owner, case/transcript location, decision, deadline, required evidence, and next action. Distinguish precisely among a resolution, a submitted request, a submitted escalation, a promised escalation, a pending reference, and a promised email. Never describe an escalation as if the underlying issue is resolved.

If a follow-up is required, reply to the existing transcript or case rather than opening a duplicate chat unless Shopify instructs otherwise. Recheck the primary record before following up: the dispute, tracking event, payout, billing item, or reproduced error may have changed.
