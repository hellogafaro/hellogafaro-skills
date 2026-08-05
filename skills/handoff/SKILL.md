---
name: handoff
description: Use when current work must be compacted into a local handoff packet for another agent or future session that needs to continue from the current state.
---

# handoff

Create a short local handoff packet so another agent or fresh session can continue without rereading the whole conversation.

Handoff is not the durable work record. Tasks carry durable work context, owner, assignee, due date, status, project, and source links. If durable work exists or is being created, update the real task first and make the handoff reference it.

Use `request` instead when the user wants a concise copy-ready ask without a local continuation file.

## Output

Save the handoff as a local Markdown file in the OS temp directory, not Notion and not the current workspace.

Include:

- Goal.
- Current state.
- Durable source of truth, usually task URL or source file path.
- What has already been checked or changed.
- Blockers and risks.
- Exact next action.
- Suggested skills.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

Return the local file path.
