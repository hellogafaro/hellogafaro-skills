---
name: reporting
description: Prepare, review, and summarize weekly reports, monthly reports, anomaly memos, performance summaries, KPI updates, evidence-backed findings, caveats, charts, and action-oriented outputs.
---

# reporting

Use this skill when AI is asked to prepare, review, or summarize weekly reporting, monthly reporting, anomaly memos, performance summaries, reporting questions, KPI updates, or analysis writeups.

Use `performance-analysis` when the report needs diagnosis beyond a simple metric read.

## purpose

Produce accurate, useful reporting outputs that use the right data window and explain what changed, why it matters, and what to do next.

## inputs

Use selected text, current page context, project context, and the reporting request.

Identify the correct client project before reporting.

Match the project's language when writing client-facing output.

## core rules

- Use Accounts Ops as the primary reporting data access path.
- Prefer structured reporting queries over raw data dumps.
- Use compact defaults unless the request clearly needs a wider slice.
- Start by finding the right client account and connected platforms.
- Confirm currency, goal, date window, comparison window, and active channels.
- If a channel is inactive, omit it rather than adding an empty section.
- If the request comes before the 5th of the month and is not clearly manual, do not finalize the monthly report.
- If a metric changed materially but is not clearly broken, classify it as a warning rather than a problem.
- If tracking, attribution, source freshness, or missing data blocks interpretation, stop and report the trust gap.

## workflow

1. Identify report type, audience, project, account, language, period, and comparison window.
2. Search existing reports before creating anything.
3. Fetch project context and prior promises.
4. Pull only the data needed for the requested report.
5. Validate freshness, coverage, missing sources, and metric definitions.
6. Use `performance-analysis` for diagnosis when movement or recommendation needs computed reasoning.
7. Write answer-first findings with caveats near the claim they affect.
8. Create or update the Notion report only after the output is coherent.

## output structure

Use the smallest structure that answers the request.

Read `references/report-types.md` when deciding between a quick answer, anomaly memo, weekly report, or monthly report.

Monthly and weekly reports usually need:

1. Summary.
2. What changed.
3. Why it changed.
4. Risks.
5. Next actions.

Anomaly memos usually need:

1. What happened.
2. Evidence.
3. Likely cause.
4. Confidence.
5. Next check.

## writing rules

- Lead with the finding.
- Do not narrate data collection.
- Do not hide caveats at the end when they change interpretation.
- Use charts and tables only when they make the decision clearer.
- Avoid empty sections.
- Use source links and date windows.
- Label partial data as partial.
- Never fabricate missing platform numbers.

## completion

Reporting work is complete when the report or answer has the correct project, period, evidence, caveats, next action, and source links.

If another agent needs to act, route through Handoffs.
