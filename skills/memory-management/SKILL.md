---
name: memory-management
description: Use when an agent must read, create, update, prune, or decide whether to save durable personal context in the repo-root MEMORY.md while avoiding transient source state, secrets, connection data, and stale facts.
---

# memory-management

Use this skill when an agent needs to read, create, update, prune, or decide whether to write durable context in the repository-root `MEMORY.md`.

Memory is the sidekick's durable personal context. It is not current source state.

## Purpose

Keep future sessions smarter without turning Memory into stale task, email, calendar, connection, or provider state.

## Workflow

1. Open the repository-root `MEMORY.md` before operational work that depends on personal context.
2. Create it from the standard section structure when missing.
3. Read only the sections relevant to the request.
4. Update Memory when the user asks the sidekick to remember something.
5. Update Memory when a durable preference, decision, source quirk, recurring constraint, or stable working-context fact appears.
6. Remove or rewrite stale Memory when it is no longer useful.
7. Do not let Memory updates trigger agents or external actions.

## Structure

Keep these sections in this order, with concise italic guidance under each heading.

- Preferences.
- Working context.
- Recurring constraints.
- Source quirks.
- Decisions.

## Write to Memory

- Durable personal preferences.
- Communication and writing preferences.
- Source quirks.
- Recurring constraints.
- Stable working context.
- Durable decisions future sessions must preserve.

Write what is true now in plain language. Keep it short.

## Do not write to Memory

- Current task status.
- Current reporting numbers.
- Email state.
- Calendar state.
- Provider data.
- Temporary blockers.
- Composio connection inventories, aliases, account IDs, or auth state.
- API keys, tokens, labels, credentials, or other secrets.

## Priority

1. `AGENTS.md` and explicit user instructions.
2. Selected skills.
3. Live source systems.
4. `INBOX.md`.
5. `MEMORY.md`.

## Completion

Memory work is complete when useful durable context is current, stale notes are removed, live state was not copied into Memory, and no secret or connection data was saved.
