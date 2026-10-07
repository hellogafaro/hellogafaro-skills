---
name: |-
  implement
description: |-
  Use when building a feature, fixing a confirmed bug, refactoring code, or improving measured performance. Turn the accepted outcome into small verifiable changes; use investigate for diagnosis-only requests and brainstorm for unresolved decisions.
notion_page_id: 3eafc798-2e43-8154-b79b-e8662788ed3c
---

# implement

Implement the accepted outcome with the smallest understandable change. Read the affected flow before choosing a solution. The surrounding project, not a universal stack, determines the commands and conventions.

## Establish the contract

1. Read the request, project instructions, owning task, and relevant code. Identify the observable outcome, constraints, dependencies, and what must remain unchanged. Use `tasks-operations` for the work record.
2. Resolve observable facts yourself. Use `brainstorm` only for a product or design decision the evidence cannot settle. An investigation request does not authorize implementation.
3. Name the data shape, caller behavior, and verification before editing. Reuse the project's established pattern. For a consequential choice with no clear precedent, compare distinct sketches or prototypes through `visualize` before committing to a shape.
4. For multi-part work, split into the fewest independently verifiable outcomes. Record only genuine blocking dependencies. Feature slices should exercise a narrow end-to-end path, not leave disconnected database, API, and UI tasks. Use compatible expand, migrate, contract steps when a wide migration cannot land safely at once.

The contract is ready when each slice has an observable result and a feasible check. Keep a small request small; do not manufacture a specification or task for every code edit.

## Choose the smallest solution

Ask in order: is the change needed; does the codebase already do it; can the standard library, native platform, or an installed dependency do it; what is the smallest clear implementation left? A native control is suitable only when it meets the actual UX and accessibility requirements.

Preserve trust-boundary validation, security, error handling, data integrity, and accessibility. Small means less unnecessary machinery, not compressed code. For repetitive changes, prove one unit and use a rerunnable script or codemod when that makes the rest safer.

## Execute and prove

Read only the applicable recipe in [change recipes](references/change-recipes.md). Work one verifiable slice at a time. Use the host's orchestration for independent work and its native Git and PR lifecycle when authorized; this skill grants no commit, push, merge, or deployment permission.

Run `verify` against the final artifact and requested outcome, not just the diff. Review both conformance to project standards and conformance to the request. Prefer the host's existing review mechanism over a duplicate review stack. Investigate findings before acting on them.

Implementation is ready when the accepted behavior is demonstrated, relevant checks cover the final revision, and blocking findings are resolved. If access prevents proof, report the missing check as unverified. Pass completed work to `deliver`; use `handoff` for work another owner must continue.

## Sources

Adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack), with its MIT notice retained in `LICENSE.md`. Also informed by [Matt Pocock's skills](https://github.com/mattpocock/skills) and [Ponytail](https://github.com/dietrichgebert/ponytail). Procedures are adapted to the current host rather than importing upstream tool commands.
