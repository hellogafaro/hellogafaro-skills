---
name: plan
description: Use when the user wants to turn an idea, request, feature, project, architecture, or implementation approach into an approved executable plan with context, scope, decisions, steps, risks, and QA.
---

# plan

Turn unresolved work into a clear approved plan.

Use `brainstorm` when the user wants interactive thinking without a required output.

Use `documentation-creation` when approved material should become broader durable documentation, SOPs, templates, or reference pages.

## Workflow

1. Inspect existing context first when available: code, docs, recent commits, Notion pages, and `CONTEXT.md`.
2. Ask one blocking question at a time.
3. If code or docs can answer the question, inspect them instead of asking.
4. Challenge vague language, overloaded terms, hidden dependencies, and unclear success criteria.
5. Propose 2 to 3 approaches only when there is a real choice.
6. Recommend one approach and explain why.
7. Stress-test scope, non-goals, sequence, risks, ownership, dependencies, seams, and QA.
8. Present the final plan in chat.
9. Wait for explicit approval.
10. After approval, create the Notion plan if a durable plan is useful.

Do not implement, scaffold, or create tasks until the plan is approved unless the user explicitly skips planning.

## Plan output

Keep the plan as short as the work allows.

Include:

- Goal.
- Context.
- Scope.
- Non-goals.
- Chosen approach.
- Decisions.
- Steps.
- Risks.
- QA.
- Open questions.

For oversized work, decompose into smaller plans and start with the first useful slice.

Prefer steps that are thin vertical slices: each step should be independently understandable, verifiable, and useful.

Name the test seam when it matters. Existing seams are better than new ones.

Use throwaway prototypes only when they answer a specific planning question.

## Notion plans

Create Notion plans only after the user approves the final plan.

- Database URL: `https://app.notion.com/p/hellogafaro/37cfc7982e4380fca0c9d055873b15f6`
- Data source ID: `37cfc798-2e43-8121-8f5b-000b72d5d3c0`

Use:

```bash
ntn pages create --parent data-source:37cfc798-2e43-8121-8f5b-000b72d5d3c0
```

Return the created Notion page URL or ID.

## CONTEXT.md

Use one concise `CONTEXT.md` per project when durable context would make future agent work more consistent.

Use it for:

- Purpose.
- Canonical language.
- Boundaries.
- Durable decisions.

Do not put task lists, implementation steps, temporary notes, changelogs, or long specs in `CONTEXT.md`.
