---
name: handoff
description: Use when the user wants either a concise context-rich request they can copy and send, or a local continuation packet that lets another agent or future session resume current work.
---

# handoff

Package work so someone else can act without rediscovering the important context.

## Choose the output

- Copy-ready request: use when the user wants an ask, prompt, or message to send onward. Return the request directly and create no file.
- Continuation packet: use when another agent or future session must resume current work. Save a local handoff file.
- Infer the mode from the request. When it remains unclear, default to the copy-ready request because it is easier to use and does not create state.

## Gather context

- Resolve the real outcome behind the ask.
- Inspect every available relevant live source before writing. This may include the canonical Notion task and its relations, project documents, repositories, issues, pull requests, communication threads, meetings, attachments, prior decisions, and current work state.
- Follow links to canonical sources and prefer current source state over summaries or memory.
- Include the canonical Notion task URL when one exists, plus any source URL needed to understand, continue, or complete the work.
- Keep only context that prevents rediscovery or wrong work: why the request exists, current state, prior work, decisions, constraints, required assets, expected result, and what meaningful completion looks like.
- Verify uncertain facts instead of presenting guesses as context. Ask one concise question only when missing information materially changes the handoff.
- Never include credentials, secrets, unrelated private context, tool noise, or a dump of every source inspected.

## Copy-ready request

- Write one universal request. Do not create separate human and AI variants or ask who will receive it.
- Lead with the desired outcome, then provide the minimum context and links needed to act well.
- Use natural prose rather than a rigid template. Keep simple requests as short as two sentences and use a few short paragraphs only when needed.
- Include constraints, deliverables, and completion conditions only when they clarify the work. Do not pad the request with generic instructions or obvious process.
- Use raw URLs and no Markdown formatting inside the request.
- Return exactly one fenced `text` code block and nothing else.
- Do not execute or send the request, create a task, or create a handoff file unless separately asked.

## Continuation packet

- Update the durable task first when one exists. The handoff file is not the work record.
- Save a short Markdown file in the OS temp directory, not Notion or the current workspace.
- Include the goal, current state, durable source of truth, relevant checks or changes, blockers and risks, exact next action, and useful skills.
- Reference existing tasks, documents, commits, diffs, and other artifacts instead of duplicating them.
- Tailor the packet to any focus the user supplied and return its local path.
