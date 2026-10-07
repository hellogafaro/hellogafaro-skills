---
name: |-
  verify
description: |-
  Tests the actual artifact against the requested outcome and reports passed, failed, or unverified checks. Use before readiness claims or to check a disputed result.
notion_page_id: 3f2fc798-2e43-811e-a813-cce628d2f4e9
---

# verify

Prove the requested outcome on the artifact people will use. A clean build, plausible screenshot, or another agent's report is supporting evidence, not a substitute for observing the behavior.

For explicitly rejected results or unexpected evidence contradicting an accepted requirement, outcome, or result already presented to the user, follow [correction routing](references/corrections.md). Expected red tests and disproven implementation hypotheses remain ordinary iteration, not a correction review.

1. Read the request and project-specific verification instructions. Identify the final revision or artifact, expected observable result, material edge cases, and what must remain unchanged.
2. Select the smallest checks that can disprove correctness. Reuse existing tests and real user paths. For a regression, replay the original failure; for performance, repeat the baseline conditions; for a document or account change, check the source facts and persisted destination.
3. Run the checks against the actual result. Inspect side effects as well as visible state. Exercise negative or permission cases when the changed boundary requires them. Respect the owner's scope and authorization; a verification request does not authorize a production transaction.
4. Use the visual evidence and presentation procedure to gather screenshots, interaction recordings, or comparable before/after evidence when useful. Label the environment and revision. Mockups prove a proposed design, not shipped behavior.
5. Check the request and project standards separately. Use the host's review system where available. For consequential changes, an independent verifier should inspect the artifact and evidence rather than accept the implementer's verdict. Model agreement alone is not proof.
6. Classify each required check as passed, failed, or unverified. Tie conclusions to the evidence. After another edit, rerun the affected checks and review the final revision before carrying a verdict forward.

Missing access or an unavailable runtime leaves a check unverified. State the exact missing check and the smallest way to resolve it. Never weaken an existing test to manufacture a pass.

For a project without a repeatable verification path, read [verification recipes](references/project-recipes.md). A new recipe is useful only after its own steps have run successfully.

Finish with the outcome, material evidence, and any blocking uncertainty. Store detailed proof with the owning task or PR when authorized, keep the chat short through the prose-editing procedure, and let the delivery and communication-approval procedure own closure.
