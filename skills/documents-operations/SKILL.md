---
name: |-
  documents-operations
description: |-
  Use when work involves finding, creating, updating, consolidating, or formatting durable documentation in the Notion Documents database.
notion_page_id: 3dffc798-2e43-8175-b1e5-d85d588e05b7
---

# documents-operations

Notion Documents is the source for saved documentation. Use it for durable knowledge that someone should understand months later without extra context.

## Find the document

Use the selected Notion connection and the live Documents and Projects databases. Discover each source by name and fetch its current schema once per run before its first query or write. Never store or guess database IDs, page IDs, property names, relation targets, templates, or option values.

Use this map only to guide discovery. Documents currently have a Name and Type and belong to one Project. Projects provide language, client context, and related tasks, meetings, assets, and documents.

Resolve the topic, document type, Project, language, reader, purpose, and source material before writing. Inspect available context first. Ask one focused question only when a missing answer could materially change the document.

Search Documents before creating. Read likely matches and update the page that already owns the subject, even when it is stale, thin, or inconvenient to find. Keep one document focused on one topic and link related pages instead of combining unrelated subjects.

Link project-specific documents to the matching live Project. A document with no real Project may remain unlinked. Never invent a Project merely to satisfy the relation.

Use the live Type options. Documentation covers SOPs, how-to guides, operating processes, internal references, and decision records. Template covers reusable starting points. Strategy covers settled approaches and decisions. Reports, KPI updates, performance summaries, and analytical writeups belong to `reporting`. Unresolved planning belongs to `brainstorm`.

## Gather and write

Read the existing page before editing it. Gather only the Project, tasks, meetings, briefs, source documents, links, files, and confirmed decisions needed for accuracy. Treat those sources as read-only and follow them only far enough to prevent wrong or incomplete documentation.

Preserve verified facts, decisions, constraints, warnings, examples, commands, paths, errors, names, numbers, and technical terms. Never invent policies, ownership, deadlines, results, causes, or process steps. Stop and resolve a source conflict when it changes the meaning.

Use a concise sentence-case title that names the subject. Avoid vague titles such as `Notes`, `Documentation`, or `Information`. Use a date only when time distinguishes the document. Do not repeat the title in the body or set a page icon.

Open with one to three short sentences explaining what the document covers and when it matters. Apply `unslop`. Use plain language, short paragraphs, active voice, and specific facts. Explain unavoidable jargon. Use numbered lists for ordered steps, bullets for real lists, and tables only for exact mappings or repeated comparisons.

Do not use em dashes or en dashes. Cut filler introductions, decorative formatting, generic best practices, speculation, repeated conclusions, and empty sections.

Match the Project language when known. Otherwise use the language in which the user is working. Client-facing material follows the Project language unless the user asks otherwise.

## Choose the structure

Use the smallest shape that makes the page clear:

- Process documentation: Purpose, Steps, Edge cases.
- How-to guide: Purpose, Before you start, Steps, Troubleshooting.
- Reference: Overview, Details, Examples, Resources.
- Template: When to use, Template, How to customize.
- Decision record: Context, Decision, Consequences.
- Decided strategy: Context, Approach, Key decisions, Success criteria, Timeline.

These are starting shapes, not mandatory templates. Skip sections with no useful content. Add ownership only when it helps the reader act.

Link canonical Projects, tasks, documents, repositories, files, and resources. Do not copy content maintained elsewhere. Summarize what matters and link the source.

## Update safely

Apply requested corrections, formatting, and factual updates directly. Before saving a material policy, strategy, or process change, explain the exact change and get confirmation. Update the canonical page unless the user explicitly requests a separate version.

Preserve unrelated content and user-owned blocks. Make the smallest intended edit. After writing, fetch the page and verify its title, Project, Type, language, structure, links, and content. If the result is uncertain, read current state before retrying through the same Notion connection.

Finish when the correct page was created, updated, consolidated, reformatted, or intentionally left unchanged without duplication. If the user asks how a process works and no document exists, state what was checked and offer to create it.
