---
name: notion-operations
description: Use when work involves Notion search, page reading, page creation, updates, mentions, tags, database properties, relations, schema lookup, dedupe, or structured Notion operations.
---

# notion-operations

Use this skill when an agent needs to search, read, create, update, mention, tag, or structure Notion pages and databases.

Use workspace pages and databases as live sources. Do not guess schema, page ids, property names, or relation targets.

## purpose

Keep Notion work accurate, deduped, linked, and easy for agents and people to continue.

## workflow

1. Search before creating.
2. Read the existing page before updating it.
3. Use the correct database or page for the work type.
4. Use database properties and relations for assignment, routing, ownership, project, client, source, and skill links.
5. Use real page mentions or named links when referencing important pages.
6. Link the correct project when project context exists.
7. Update in place unless the user explicitly asks for a new page or version.
8. If required context is missing, state the gap and propose adding it.

## mentions and tagging

- Use current-user filters for agent-specific lookup when available.
- For Memory and Inbox, assigned means the Owner property contains the current user.
- Prefer Owner filters over title mentions.
- Use inline mentions only for human-readable context or notifications.
- Do not rely on inline page mentions as structured tags.

## page creation

- Do not create duplicates.
- Do not set page icons.
- Use sentence case.
- Do not duplicate the page title in the body.
- For templates and docs, follow the matching specialist skill.

## completion

Notion work is complete when the correct existing page was updated or the new page was created in the right place, linked to the right sources, and no duplicate was created.
