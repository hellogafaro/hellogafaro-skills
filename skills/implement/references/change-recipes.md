# Change recipes

## Feature

Trace the caller's intended use before writing internals. Implement one end-to-end case, prove it through the public interface, then add the remaining accepted cases. Model distinct states explicitly rather than accumulating optional fields and compensating branches. Keep a tested slice working before moving to the next.

## Bug

Reproduce the symptom on the affected surface and record the baseline. Use the evidence-based diagnosis procedure to distinguish candidate causes and confirm the mechanism. When a cheap local test exists, demonstrate that it fails for the intended reason before applying the fix, then passes afterwards. Otherwise retain a repeatable runtime reproduction and state the test limitation. Prove the original reproduction passes on the same surface. Failed reproduction is not proof that the bug is absent.

## Refactor

Pin behavior with characterization tests, representative outputs, or an equivalence script before moving code. Make structural changes in steps that keep the pin green. Remove obsolete APIs after their callers migrate; retain temporary compatibility only when the rollout requires it and identify its removal condition. Keep unrelated bugs or feature requests out of the refactor.

## Performance

Capture a baseline on the real workload. Record the environment, input, metric, and relevant variance. Form a hypothesis from the trace, change one thing, and repeat the same measurement. Confirm that the gain measures the intended work and has not traded away correctness. Report the measured result and its limits, not a projected speedup.

## When the approach fails

After repeated failures under the same assumption, write down that assumption and test it before another patch. Remove changes justified only by a disproven hypothesis without disturbing unrelated work. Turn a recurring proven failure into an appropriate test, type constraint, lint, or repeatable check within scope; a one-off does not justify a framework.
