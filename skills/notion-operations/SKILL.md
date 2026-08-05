---
name: notion-operations
description: Use when work involves Notion search, page reading, page creation, updates, mentions, blocks, database properties, relations, schema lookup, deduplication, or structured Notion operations.
---

# notion-operations

Use this skill when an agent needs to search, read, create, update, mention, link, format, or structure Notion pages and databases.

Use workspace pages and databases as live sources. Do not guess schema, page IDs, property names, users, relation targets, block capabilities, or option values.

Use the local Composio CLI for Notion access. Inspect live connections and select the intended account explicitly when more than one exists.

## Workflow

1. Search before creating.
2. Discover the current database or page and fetch its live schema.
3. Read the existing page and relevant child blocks before updating it.
4. Use real page mentions or named canonical links for important references.
5. Update in place unless the user explicitly asks for a new version.
6. Make the smallest intended write.
7. Fetch the persisted page, row, or block after every write.
8. Treat a nominal HTTP success with an unsuccessful result as failure.

## Inbox and Memory mapping

When the host declares Notion as the sidekick store:

- `Inbox` means one dated page per current user in the configured Inbox database.
- Identify an Inbox page by the real user mention in its title property plus the exact Date property. Do not add or depend on an Owner property for Inbox identity.
- Each Inbox page contains exactly Brief, To do, and Notes, using the block representation defined by `inbox-management`.
- `Memory` means the current user's page in the configured Memory database, identified by the real user mention.
- Stop and report duplicate Inbox or Memory records instead of choosing one.

Do not hardcode database IDs in shared skills. The host's compact entry instructions own the actual workspace links.

## Properties and mentions

- Use current-user filters when supported.
- For operational databases such as Tasks, use the verified structured Owner, Assignee, Project, and relation properties required by their schemas.
- Inbox and Memory use the identity rules above, not generic ownership fields.
- Use inline mentions for readable identity and page references, not as a substitute for unrelated structured relations.

## Page rules

- Do not create duplicates or set page icons.
- Use sentence case and do not repeat a page title in its body.
- Preserve user-owned content and unrelated blocks.
- If a block type cannot be changed in place, create the correct replacement, verify it, then remove the old block.
- Never retry an uncertain write through a second surface. Read the target state first.

## Completion

Notion work is complete when the correct target was updated without duplication, every intended property and block persisted, user-owned content remained intact, and the result was fetched and verified.
