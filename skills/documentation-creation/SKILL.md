---
name: documentation-creation
description: Use when creating or updating Notion documentation, including SOPs, guides, templates, internal references, durable strategy documentation for already-decided approaches, process pages, how-tos, and reusable operating docs without duplicates.
---

# documentation-creation

Use this skill when AI is asked to create or update SOPs, guides, operating processes, templates, internal reference pages, strategy pages, or process documentation in Notion.

Do not use this skill for reports. Use `reporting` for reports, performance summaries, KPI updates, and analysis writeups.

Do not use this skill for interactive planning or decision pressure. Use `brainstorm` for thinking through a plan before durable documentation exists. Use future `plan` for shaping unresolved strategy, implementation approach, or decision trees before documentation.

## Purpose

Create documentation that is clear, scannable, accurate, and useful to someone reading it months later with no extra context.

## Sources

- Soul defines voice, writing, and formatting standards.
- Collaboration defines source lookup, routing, Memory, Inbox, and failure handling.
- Documents is the source of truth for saved documentation.
- Projects is the source of truth for project language, client context, and linked work.
- Reporting owns reports and performance writeups.

## Document types

Use Documentation for SOPs, how-tos, internal reference material, and operating processes.

Use Template for reusable starting points for recurring work.

Use Strategy for already-decided approaches, decision frameworks, and durable strategy documentation.

## Workflow

1. Identify the document type, topic, project, language, and intended reader.
2. Search existing documents before creating anything.
3. Read the current page before updating an existing document.
4. Ask one concise question if the topic, project, language, document type, or intended use is unclear.
5. Organize the page using the matching structure for the document type.
6. Write in natural language with short paragraphs and bullets only where scanning helps.
7. Explain what will change and get confirmation before saving material updates.
8. Update in place unless the user explicitly asks for a new version.

## Structures

Documentation pages use Purpose, Steps, Edge cases, and Owner.

Template pages use When to use, Template content, and How to customize.

Strategy pages use Context, Approach, Key decisions, Success criteria, and Timeline when applicable.

## Rules

- Write for the person who will read the page months later with no extra context.
- Use simple language.
- Explain jargon when it cannot be avoided.
- Keep one document focused on one topic.
- Do not duplicate the page title in the body.
- Do not use em dashes or en dashes.
- Do not set a page icon.
- Link the document to the correct project when project context exists.
- Match the project language when known.
- Default to the language the person is working in when no project language exists.
- Surface overlap before creating a new page when a similar document exists.
- Flag process changes clearly before saving them.

## Completion

Before stopping, make sure the document was created, updated, or intentionally left unchanged.

If documentation work remains for another agent or person, use `handoff` for a local transfer packet or focused ask that points to the document, task, source page, or file that owns the durable context.

If no matching document exists and the user asked what the process is, say what you checked and offer to create one.
