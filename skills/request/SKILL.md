---
name: request
description: Use when the user wants a concise, copy-ready request or prompt that another human or AI agent can act on, especially when relevant source context, links, constraints, and completion conditions must be gathered before forwarding.
---

# request

Create one concise plain-text request the user can copy and send without cleanup.

## Gather context

- Resolve the real outcome behind the ask.
- Inspect every available relevant live source before writing. This may include the canonical Notion task and its relations, project documents, repositories, issues, pull requests, communication threads, meetings, attachments, prior decisions, and current work state.
- Follow links to their canonical sources and prefer current source state over summaries or memory.
- Include the canonical Notion task URL when one exists, plus any source URL the recipient may need to understand or complete the work.
- Extract only context that prevents rediscovery or wrong work: why the request exists, current state, prior work, decisions, constraints, required assets, expected result, and what meaningful completion looks like.
- Verify uncertain facts instead of presenting guesses as context. Ask one concise question only when missing information materially changes the request.
- Never include credentials, secrets, private context unrelated to the work, tool noise, or a dump of every source inspected.

## Write the request

- Write one universal request. Do not create separate human and AI variants or ask who will receive it.
- Lead with the desired outcome, then provide the minimum context and links needed to act well.
- Use natural prose rather than a rigid template. Keep simple requests as short as two sentences and use a few short paragraphs only when the work genuinely needs them.
- Include constraints, deliverables, and completion conditions only when they clarify the work. Do not pad the request with generic instructions or obvious process.
- Use raw URLs. Do not use Markdown headings, emphasis, links, tables, checkboxes, or decorative formatting inside the request.
- Do not execute the work, send the request, create a task, or create a handoff file unless the user separately asks.

## Output

Return exactly one fenced `text` code block and nothing else. The content inside the fence is the complete copy-ready request in plain text.

Use `handoff` instead when another agent or future session needs a local continuation packet. Use `task-management` when the durable task itself must be created or updated.
