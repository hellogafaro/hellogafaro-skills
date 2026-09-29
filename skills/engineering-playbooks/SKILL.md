---
name: |-
  engineering-playbooks
description: |-
  Use when fixing a bug, refactoring, improving performance, or prototyping a design decision in code. Gives the step-by-step playbook and the checks each one needs.
notion_page_id: 3eafc798-2e43-8154-b79b-e8662788ed3c
---

# engineering-playbooks

Pick the playbook that matches the task and follow its steps. Every shipped line traces to evidence. A change that "might help" is a hypothesis, not a fix, and does not ship.

## Test questions

Ask these while designing and before handing off.

- Can I reproduce it? If not, I can't verify the fix.
- Is this the root cause, or a guard that silences the symptom? Does the same pattern exist elsewhere?
- It fails after a restart: is stale state (config, cache, lock, serialized data) the cause before code?
- What happens if this runs twice in a row, or the last run crashed halfway?
- Is this validation at a system boundary, or repeated inside trusted code?
- Can an illegal combination of fields be represented? Split it into a union.
- Can a new reader answer "where does X come from" and "what can change X" in 30 seconds?
- Is there a wrapper with one caller or an adapter with one implementation to collapse?
- Would this look the same if the new requirement had existed on day one?
- Are old and new APIs both alive? Migrate every caller and delete the old one in the same change.
- Could this be a script or codemod someone can rerun instead of hand edits?

## Bug fix

1. Reproduce it yourself on the surface where it happens, with `browser-automation`, the repository's verification skill, or the machine's own tools. Don't hand the repro to the user. If it won't reproduce, force it: synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. List candidate hypotheses, then rule them out with runtime evidence, taking the split that cuts the most remaining space each pass. When state is unclear, add logging and read it as the code runs. Don't guess.
3. Confirm the surviving mechanism with runtime evidence before planning the fix.
4. Write the failing test first when there is a cheap local test path. Run it and confirm it fails for the intended reason. Skip it when the test would be expensive, integration-heavy, or unclear, and say so.
5. Make the smallest change the evidence justifies. When evidence refutes a hypothesis, revert what it motivated.
6. Verify on the same surface. The original repro now passes. "Inconclusive" or a different surface is not a pass. Unit tests show branch behavior, not bug absence.
7. Commit the failing test before the fix so the history shows red, then green.

Report what was broken, the root cause, the fix, and the failing-then-passing output.

## Refactoring

The structure changes and the behavior does not. A missing feature or real bug found on the way gets split out.

1. Pin the behavior first. Write a characterization test, snapshot, or equivalence script that captures current behavior before anything moves. Type check and lint are not a pin.
2. Name the target shape: module layout, types, and call graph as if built today.
3. Subtract before you add. Delete dead code, one-caller wrappers, redundant validators, and orphan references first.
4. Move in small steps that keep the pin green. For an API change, migrate every caller and delete the old API in the same wave, with no shims. Check renames against the files: they miss strings, docs, and back-references.
5. Prove behavior is unchanged on the real artifact. For larger reshapes, diff old against new outputs with a script.
6. Keep the change only if it lowers reader load somewhere. Otherwise revert it.
7. Order commits as subtraction, then reshape, then cleanup, so one revert undoes one slice.

Report the structure that changed, the pin, the equivalence proof, and what was reverted.

## Perf

Tie every change to a measurement. Don't read source instead of measuring.

1. Capture a baseline: a trace, profile, or timed run on the real surface.
2. Form hypotheses from the trace. Don't claim a ceiling without running it.
3. Change one thing, then capture the same measurement again. Verify each attempt before the next.
4. Compare the artifacts with a script, not by eye. Load large traces into sqlite and query them.
5. Cite the baseline, the result, the delta, and the artifact path.

## Prototype

Throwaway code to make one design or behavior decision cheaply. Speed over polish.

1. Name the decision the prototype exists to make. No decision means no prototype.
2. Build it in a scratch folder outside production source, with the lightest stack that shows the idea. No tests, no abstractions.
3. Put alternatives behind one switcher, each labeled, so they can be compared side by side.
4. Verify by looking: screenshot each variant, or log the timing or output being decided.
5. Present the variants, the evidence, the tradeoffs, and a recommendation. Say plainly the prototype is throwaway, then build the chosen direction for real.

## Provenance

- Adapted from [pstack](https://github.com/poteto/plugins/tree/main/pstack) (poteto-mode playbooks, tdd, principle skills).
- Upstream commit: `74dd2291e8e37b12fd6dc49b2acbd655c6bdaf12`
- License: MIT, Copyright (c) 2026 Lauren Tan. See `LICENSE.md`.
