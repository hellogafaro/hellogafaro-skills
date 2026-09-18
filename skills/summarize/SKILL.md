---
name: |-
  summarize
description: |-
  Use when the user asks for a concise completion summary, recap, wrap-up, PM handoff note, or factual account of work delivered and verified.
notion_page_id: 3dffc798-2e43-81cf-9d25-e3fbea829f79
---

# summarize

Write a compact completion summary that the user can forward without cleanup.

## Content

- Start with what was delivered and why it matters.
- State where it landed, including repositories, branches, commits, PRs, or durable artifact links that matter.
- Include verification that actually ran and any blocker or next action that changes the handoff.
- Include every relevant commit with its short hash and message, and every relevant PR with its number or URL.
- Name GitHub repositories by owner and name. Use a local path only when the path is itself a deliverable.
- Mention a temporary handoff file near the end when one was created.
- Exclude tool noise, command transcripts, process narration, repeated diagnosis, irrelevant dirty files, and generic caveats.
- Do not say what was not done unless it changes the next step.

Use one to three short paragraphs by default. Use compact bullets only when several repositories, commits, PRs, or deliverables need separate lines. Do not add a heading unless the user asks for one.

## Verification

Review live state before making claims. Check the relevant Git status, commits, pushed branch, PR state, artifact, and QA result. If a required source is blocked, name only the missing source and why it affects the summary.

## Tracked time

End with one tracked-time sentence unless the user asks to omit it or the summary contains no billable work.

- Use user-provided actual time when available. A user correction overrides later estimates for comparable work.
- Otherwise estimate the active time a competent person would need with the context available at the start of the task.
- Count necessary investigation, decisions, implementation, review, QA, and handoff. Ignoring real diagnosis or verification produces estimates that are too low.
- Exclude unattended waits, tool latency, retries that add no insight, automated execution, duplicated effort, and conversation length. Pricing the work as a rebuild produces estimates that are too high.
- Credit existing helpers, patterns, prior context, and generated work, while counting the human judgment still required to use and verify them.
- Set a plausible lower bound by asking whether the required understanding, change, and verification could fit in less time.
- Set a plausible upper bound by naming the necessary work that fills the extra time. Remove time that has no concrete work behind it.
- Choose the midpoint of the narrowest defensible range, then round once to the nearest 15 minutes. Do not sum separately rounded subtasks.
- Do not estimate from line count, file count, test count, agent steps, or elapsed wall time alone.

Output only the final total unless the user asks for the calculation.

Before sending, read and apply `unslop`. Preserve hashes, URLs, identifiers, filenames, numbers, verification status, and tracked time.
