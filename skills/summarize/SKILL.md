---
name: summarize
description: Use when the user asks for a summary, wrap-up, recap, completion note, PM handoff summary, or what was done after an agent task across engineering, marketing, operations, analysis, documentation, or any other work.
---

# summarize

Create a concise natural-text completion summary the user can forward to a project manager without cleanup.

## Core rules

- Do not add a title or heading.
- Write in natural prose, not a report template.
- Include only meaningful work completed, delivered, or verified.
- Include all commits, PRs, repositories, deliverables, and QA that matter.
- Include every commit with short hash and message when commits were made.
- Include every PR with number or URL when PRs were opened or updated.
- Mention GitHub repositories by owner/name, not local filesystem paths, unless the local path is the deliverable.
- Include the temporary handoff task Markdown file path when one was created.
- Do not mention irrelevant dirty files, generated metadata, local cache files, or files intentionally left untouched unless they affect the handoff.
- Do not include tool noise, command transcripts, process narration, or generic caveats.
- Do not say what was not done unless it changes the project manager's next step.

## Source review

Before writing, review the live state that can change the summary:

- Git status, recent commits, pushed branch, and PR state for code work.
- Created or updated Notion tasks, docs, reports, dashboards, decks, spreadsheets, or other deliverables.
- QA actually run, including tests, builds, lint, screenshots, previews, data checks, or review steps.
- Any temporary handoff task Markdown file created for the user or next agent.

If a source is blocked, say only the blocked source and why it matters.

## Output shape

Use one short paragraph when the work is small.

Use a few short paragraphs or bullets when there are multiple repositories, commits, PRs, deliverables, or QA checks.

Default order:

1. What was delivered.
2. Where it landed, including repository, branch, commits, PRs, or durable artifact links.
3. QA or verification run.
4. Handoff task Markdown file path if created.
5. Any real blocker or next project-manager action.

Keep the answer compact. The goal is accurate handoff, not a diary.
