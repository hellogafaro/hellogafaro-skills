# Visual evidence

Identify the claim before capturing the screen. Read the project context and confirm the correct account, environment, artifact, and revision. Use approved test data and avoid unrelated personal information, secrets, or customer records.

Plan evidence before edits. Retain the baseline or reproduction, meaningful decisions or failed attempts that explain the result, and final verification in a location that survives cleanup and handoff. Keep a compact index of what each artifact proves, its revision or capture conditions, and its intended audience. Capture useful checkpoints, not continuous surveillance or every tool action.

For a before/after comparison, capture the baseline before editing. Match viewport, data, relevant state, and interaction on both sides. If a baseline is unavailable, say so; do not reconstruct a mockup and call it "before". Label different environments or conditions when an exact comparison is impossible.

Use a screenshot for a static state. Use a recording or ordered captures when the transition is the claim. Show the action and resulting state, not only a convenient final frame. Capture errors and unexpected behavior as evidence rather than cropping them away.

Keep original captures. Annotated copies may highlight the relevant region but must not alter the behavior being claimed. Use accurate captions and redact only what the audience must not receive. Keep evidence linked to its capture conditions and revision.

For a generated report or chart, verify the underlying values and units through `reporting`, render it, and inspect labels and legibility. For an application change, confirm relevant side effects through `verify`; a visible success message alone does not prove persistence.

Attach evidence through the host's file mechanism. Store it with the owning task or PR when authorized so another reviewer can inspect it without access to the local machine. An earlier screenshot is stale if the relevant implementation or state changed.

At delivery, use the smallest reviewable package: matched screenshots for a simple visual change, a clip for an interaction, or an authored canvas using the shared kit for a substantial comparison or explanation. Backend work may need request/response results or test output rather than decorative screenshots. Link or attach the actual proof, not only a claim that checks passed. Prepare approved-audience copies, obtain required publication approval, verify attachments at their destination, and retain originals; a local path alone is not durable delivery.
