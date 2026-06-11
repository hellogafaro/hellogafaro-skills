---
name: handoff
description: Use when work needs to be compacted into a Notion handoff document for another agent to pick up.
---

# handoff

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

Save to the Notion Handoffs data source, not the current workspace or temporary directory.

- Database URL: `https://app.notion.com/p/hellogafaro/374fc7982e4380d2ab12e011098c60c3`
- Data source ID: `374fc798-2e43-815d-9a47-000bdd0ad982`

Use `ntn pages create --parent data-source:374fc798-2e43-815d-9a47-000bdd0ad982` to create the page.

Include a "Suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

Return the created Notion page URL or ID.
