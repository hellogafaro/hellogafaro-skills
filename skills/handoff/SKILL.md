---
name: |-
  handoff
description: |-
  Use when the user wants a copyable context-rich handoff that lets another person, model, or agent continue unresolved work without repeating important discovery.
notion_page_id: 3dffc798-2e43-81c3-96a9-fe86a7f896e0
---

# handoff

Pack the active outcome, material context, current work, and next action into one handoff another person, model, or agent can continue without repeating important discovery.

## Gather context

- Derive the assignment from the user's active goal and unresolved work. The open email, task, page, file, or tool is context, not proof of what the recipient must do.
- Start with the current session. Capture the outcome, why it matters, work already completed, current state, decisions, attempts, failures, blockers, unresolved questions, artifacts, and exact next action.
- Identify missing facts that could change execution. Research only those gaps through the relevant specialist skill, using current internet, email, calendar, Notion, repository, file, or other connected sources as needed. Keep gathering read-only.
- Follow canonical sources and prefer live state over summaries or memory. Do not search a system merely because it is available or ask the user to paste content that an available source can provide.
- For technical work, inspect relevant files, branch, diff, commits, pull requests, tests, logs, configuration, and deployment state when they affect continuation.
- Keep all context that prevents repeated work or a wrong decision. Remove duplicated conversation, research narration, tool output, source inventories, and facts that do not change execution.
- Include a canonical task, document, thread, repository, pull request, or other raw URL only when the recipient needs it to act. Resolve identifiers and people to readable names.
- Verify uncertain facts. Ask one concise question only when the missing answer materially changes the assignment or next action. If a source is unavailable, continue with verified context and mention the limitation only when it affects execution.
- Never expose credentials, secrets, citation tokens, placeholders, or unrelated private context.

## Write the handoff

- Write one universal handoff. Do not create separate human, model, or agent variants.
- Open with a direct sentence stating the exact outcome or next action inherited from the active context. Never invent a new assignment or mistake the current source for the assignment.
- Continue in natural compact prose with the material context and work in progress. State what has been done, what was learned, what remains, and what successful completion means.
- Use as many paragraphs as readability requires. Do not use headings, labels, bullets, lists, a fixed paragraph count, permission boilerplate, or generic process.
- Apply `unslop`. Keep facts, dates, numbers, decisions, constraints, file paths, links, and commands exact while removing filler and repetition.
- Use raw URLs and no other Markdown formatting inside the handoff.
- Return exactly one fenced `text` code block and nothing else.
- Keep the full handoff in that block. Do not create an overflow file.
- Do not execute or send the handoff, create or update tasks, or change any source unless the user separately asks. A handoff never expands existing authorization.

Use `summarize` instead when the goal is to report completed work rather than ask someone to act or continue.
