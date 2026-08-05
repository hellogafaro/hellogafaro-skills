---
name: memory-management
description: Use when an agent must read, create, update, prune, or decide whether to save durable personal context in Memory while avoiding transient source state, secrets, connection data, and stale facts.
---

# memory-management

Use this skill whenever work depends on or changes the sidekick's durable personal context.

Memory improves judgment across sessions. It is not current Inbox, task, email, calendar, provider, or connection state.

## Host mapping

Resolve `Memory` through the host environment.

- In a file-backed environment, Memory may be a repository file.
- In Notion, Memory is the current user's page in the configured Memory database, identified by the user's real Notion mention.
- Never hardcode a repository path, database ID, user ID, account selector, or provider state in this skill.

Stop and report duplicate Memory records instead of guessing. Create the standard empty structure when none exists.

## Structure

Keep these sections in order:

- Preferences.
- People and relationships.
- Ongoing responsibilities.
- Constraints.
- Source and account conventions.
- Durable facts and decisions.

Keep entries concise and write what is true now.

## Workflow

1. Read the relevant Memory sections before operational work that depends on personal context.
2. Save explicit durable preferences, facts, decisions, relationships, responsibilities, constraints, and source conventions.
3. Do not infer a durable rule from one isolated action. Ask when a pattern is merely suggestive.
4. Replace corrected facts instead of appending contradictions.
5. Remove or rewrite stale context when the durable correction is clear.
6. Do not let a Memory update itself trigger email, calendar, task, or other external action.

## Do not save

- Current task status, reporting numbers, email state, calendar state, or temporary blockers.
- Provider inventories, connection aliases, account IDs, auth state, labels, or mutable routing data.
- API keys, tokens, credentials, or other secrets.

## Authority

Explicit user direction and selected specialist skills control behavior. Live sources control current facts. Memory controls durable preferences and interpretation. When Memory conflicts with live state, preserve the live fact and repair genuinely stale Memory.

## Completion

Memory work is complete when useful durable context is current, unknown sections remain honestly empty, stale notes were repaired, live state was not copied in, and the persisted result was verified.
