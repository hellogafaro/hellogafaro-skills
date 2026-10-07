---
name: |-
  summarize
description: |-
  Use when asked for a concise recap of work, findings, or delivered results. Report verified state without performing closure, inventing time, or turning a recap into a new assignment.
notion_page_id: 3dffc798-2e43-81cf-9d25-e3fbea829f79
---

# summarize

Give the reader the shortest accurate account of what happened and what it means for them.

1. Read the relevant current evidence. Verify artifact, PR, release, and check status before describing them. An earlier summary is a lead, not proof of current state.
2. Lead with the result. Include the material change, useful evidence or canonical link, and any blocker or next action that affects the reader.
3. Distinguish completed work from proposed, unverified, or pending work. Include only links and revision details the audience needs to inspect or use the result.
4. Apply `write`. Default to a short paragraph or a few bullets. Expand only when the requested recap needs it; do not repeat tool output or list every commit by default.

Omit time by default. At closure, include actual recorded time only when relevant or requested and identify it accurately. If asked for an effort estimate, label it as an estimate and keep it separate from actual Timesheets. Never produce an automatic rounded "tracked time" estimate.

Summarizing does not create tasks, log time, send stakeholder messages, or mark work Done. Use `deliver` for those authorized closure actions. Use `handoff` when another person or agent needs enough context to continue unfinished work.
