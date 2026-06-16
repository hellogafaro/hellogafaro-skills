---
name: handoff
description: Use when current work must be compacted into a local handoff packet for another agent, future session, or one-off inter-agent ask.
---

# handoff

Create a short local handoff packet so another agent or fresh session can continue without rereading the whole conversation.

Handoff is not the durable work record. Tasks carry durable work context, owner, assignee, due date, status, project, and source links. If durable work exists or is being created, update the real task first and make the handoff reference it.

## Modes

- Full handoff: compact current work for a future agent or session.
- Ask packet: prepare a focused request for another agent, such as Codex asking Claude to inspect, decide, draft, or verify something.

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

Return the local file path. If the packet is meant for another active agent, also provide the concise prompt to send.
