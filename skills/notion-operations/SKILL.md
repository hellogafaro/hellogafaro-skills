---
name: notion-operations
description: Use when work involves Notion search, page reading, page creation, updates, mentions, tags, database properties, relations, schema lookup, dedupe, or structured Notion operations.
---

# notion-operations

Use this skill when an agent needs to search, read, create, update, mention, tag, or structure Notion pages and databases.

Use workspace pages and databases as live sources. Do not guess schema, page ids, property names, or relation targets.

Use the local Composio CLI for Notion access. Inspect live Notion connections and select the intended account explicitly when more than one exists.

## Purpose

Keep Notion work accurate, deduped, linked, and easy for agents and people to continue.

## Workflow

1. Search before creating.
2. Discover the current database or page through the selected Composio connection.
3. Fetch the live schema before querying or writing database properties.
4. Read the existing page before updating it.
5. Use the correct database or page for the work type.
6. Use database properties and relations for assignment, routing, ownership, project, client, source, and skill links.
7. Use real page mentions or named links when referencing important pages.
8. Link the correct project when project context exists.
9. Update in place unless the user explicitly asks for a new page or version.
10. Verify every write by fetching the persisted result.
11. If required context is missing, state the gap and propose adding it.

## Mentions and tagging

- Use current-user filters for agent-specific lookup when available.
- Prefer structured Owner and Assignee filters over title mentions.
- Use inline mentions only for human-readable context or notifications.
- Do not rely on inline page mentions as structured tags.

## Page creation

- Do not create duplicates.
- Do not set page icons.
- Use sentence case.
- Do not duplicate the page title in the body.
- For templates and docs, follow the matching specialist skill.

## Scope

Use Notion for durable tasks, timesheets, projects, clients, meetings, documents, reports, comments, team information, and collaboration pages.

The sidekick Inbox and Memory are repository files. Do not look for or maintain them in Notion.

## Completion

Notion work is complete when the correct existing page was updated or the new page was created in the right place, linked to the right sources, and no duplicate was created.
