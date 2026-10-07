# Quality checks

Use the smallest sufficient instructions, not the shortest text at any cost. A shorter prompt is a candidate improvement until behavior is checked.

## Discovery

Test descriptions without bodies first. Include an ordinary request, a paraphrase, a neighboring skill's request, and an ambiguous request. Require selection of the correct capability or a focused clarification. A missing permission is not a reason to choose the wrong skill.

## Execution

Read the selected body and relevant references. Test the happy path, missing data, stale evidence, and a restricted action. Check the observable result, stop condition, and approval boundary. Use examples from actual failures; avoid expanding a prompt with hypothetical edge cases that have not changed behavior.

For delegation, test a small fix, independent bulk work, a tightly coupled change, no suitable cheaper worker, and a worker returning an unsupported success claim. The lead should keep planning and acceptance ownership while bounding worker context and writes.

Run representative cases on the capability tiers intended to use the skills. Compare before and after against a fixed rubric. Repeat ambiguous cases when results vary. Preserve failures and disagreements; model agreement and a text review are not live execution proof. Do not report a perfect score, accuracy gain, token saving, or latency improvement without a defined measurement supporting that claim.

## Structural checks

Validate names, descriptions, local links, complete exports, and installations against source hashes. Check that mandatory references are reachable, old names are removed, and model/host names appear only where technically necessary or in provenance. Compare always-loaded metadata separately from loaded bodies; character or word counts are not measured model-token cost.

## Research basis

- [Skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): specific discovery descriptions, sufficient instructions, progressive disclosure, representative testing.
- [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): high-signal context and the balance between brittle prescriptions and vague goals.
- [Multi-agent research](https://www.anthropic.com/engineering/multi-agent-research-system): bounded worker briefs and selective parallelism; extra agents can increase total tokens.
- [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering): clear instructions and evaluations when prompts or model versions change.
- [Prompt design](https://ai.google.dev/gemini-api/docs/prompting-strategies): explicit constraints, output shape, and useful examples.
- [Agent-facing writing](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md) and [engineering skills](https://github.com/cursor/plugins/tree/main/pstack): conditional pointers, focused outcomes, and real verification.

These sources inform the procedure; their model names, orchestration commands, and claimed benchmark gains are not portable defaults.
