Load before classifying email.
## VIP and contacts
Durable VIP, known-sender, account-role, and recurring-exception preferences live in `MEMORY.md`.
Verify unknown senders against the live Contacts database through the selected Composio Notion connection.
A Contacts match means known contact. Treat as review minimum. Never downgrade a known contact to noise just because the message looks automated.
## Elevate
Elevate when the thread contains a direct ask, decision request, deadline, urgent language, complaint, blocked work, access issue, financial issue, legal issue, VIP sender, active client, active vendor, or a Waiting item with a real reply.
Subject words like urgent, ASAP, help, blocked, broken, down, or not working are strong signals when the thread history supports them.
## Lower priority
Lower priority when there is no Contacts match, no direct ask, and the content is promotional, newsletter, social, cold outreach, auto-notification, routine receipt, or spam.
Invoice or financial mail is review minimum regardless of sender.
## FYI default
Use FYI when signals are mixed, the sender is known but informational, the thread looks resolved but unarchived, or confidence is low.
First email from a sender not in Contacts and not clearly noise stays FYI. Flag it as new sender, screen.
## Safety
VIP sender from an unrecognized address is a phishing flag.
New sender asking for money, credentials, payment changes, account access, or wire details is phishing-tier until verified. Surface immediately.
