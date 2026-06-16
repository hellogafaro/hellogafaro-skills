---
name: summarize
description: Use when the user asks for a summary, wrap-up, recap, completion note, PM handoff summary, or what was done after an agent task across engineering, marketing, operations, analysis, documentation, or any other work.
---

# summarize

Create a concise natural-text completion summary the user can forward to a project manager without cleanup.

## Core rules

- Do not add a title or heading.
- Write in natural prose, not a report template.
- Keep the layout tight: usually two to four short paragraphs, or compact bullets only when many repos, commits, PRs, or deliverables must be listed.
- Include only meaningful work completed, delivered, or verified.
- Include all commits, PRs, repositories, deliverables, and QA that matter.
- Include every commit with short hash and message when commits were made.
- Include every PR with number or URL when PRs were opened or updated.
- Mention GitHub repositories by owner/name, not local filesystem paths, unless the local path is the deliverable.
- Put the temporary handoff task Markdown file or URL near the end in its own sentence when one was created.
- Name temporary handoff files in kebab case with the task slug and timestamp so they are unique, such as `/tmp/task-id-short-task-slug-20260616-1430.md`.
- End with a concise senior-level human effort estimate, rounded to 15-minute increments. Use plain wording like `This would have taken a senior-level human about 1 hour.` Estimate from the real scope and verification, not elapsed agent time or commit timestamps.
- Do not pad the effort estimate with generic phrases like `capable human doing this end to end` or repeat the whole work list inside the estimate sentence.
- Use only generic placeholder content in examples, filenames, and sample wording. Do not include real client names, task ids, repositories, URLs, people, or project details in the skill itself.
- Do not mention irrelevant dirty files, generated metadata, local cache files, or files intentionally left untouched unless they affect the handoff.
- Do not include tool noise, command transcripts, process narration, or generic caveats.
- Do not say what was not done unless it changes the project manager's next step.
- Do not bury the actual deliverable under diagnosis detail. Summarize the finding only as much as needed for the PM to understand what changed and what remains open.

## Source review

Before writing, review the live state that can change the summary:

- Git status, recent commits, pushed branch, and PR state for code work.
- Created or updated Notion tasks, docs, reports, dashboards, decks, spreadsheets, or other deliverables.
- QA actually run, including tests, builds, lint, screenshots, previews, data checks, or review steps.
- Any temporary handoff task Markdown file created for the user or next agent.
- The final URL or filesystem path of any handoff/time document, if one exists.

If a source is blocked, say only the blocked source and why it matters.

## Output shape

Default order:

1. What was delivered.
2. Where it landed, including repository, branch, commits, PRs, or durable artifact links.
3. QA or verification run.
4. Handoff task Markdown file path if created.
5. Any real blocker or next project-manager action.
6. Senior-level human effort estimate as the final sentence.

Keep the answer compact. The goal is accurate handoff, not a diary.
