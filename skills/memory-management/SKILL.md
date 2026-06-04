---
name: memory-management
description: Use when an agent must read, create, update, prune, or decide whether to save durable Memory while avoiding transient source state, secrets, account ids, credentials, and stale operational facts.
---

# memory-management

Use this skill when an agent needs to read, create, update, prune, or decide whether to write durable Memory.

Memory is durable context. It is not current source state.

## purpose

Keep future runs smarter without turning Memory into stale task, email, calendar, or provider state.

## workflow

1. Fetch the Memory database entry assigned to the current user before creating anything.
2. Create one assigned Memory entry only when none exists.
3. Read only the Memory notes relevant to the request.
4. Update Memory when the user asks you to remember something.
5. Update Memory when a durable preference, decision, source quirk, recurring constraint, or future-run fact appears.
6. Remove or rewrite stale Memory when it is no longer useful.
7. Do not let Memory updates trigger agents.

## write to Memory

- Durable user preferences.
- Routing facts.
- Source quirks.
- Recurring constraints.
- Stable project context.
- Agent continuity that future runs need.

Write what is true now in plain language. Keep it short.

## do not write to Memory

- Current task status.
- Current reporting numbers.
- Email state.
- Calendar state.
- Provider data.
- Temporary blockers.
- Secrets, account ids, API keys, tokens, labels, or credentials.

## priority

1. Soul and agent instructions.
2. Selected skills.
3. Inbox.
4. Live source systems.
5. Memory.

## completion

Memory work is complete when the assigned entry exists, useful durable context is current, stale notes are removed, and no transient source state was saved.
