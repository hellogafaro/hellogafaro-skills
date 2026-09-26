# Task journal and artifacts

## Task journal and artifacts

Use each part of a task for one job. Properties hold operational state. The body holds the accepted current truth, including scope, definition of done, current implementation, blocker, next action, and durable links. Comments preserve the conversation and evidence over time. Update the body when accepted feedback makes it stale; do not turn it into a chronological log.

Record feedback, reviewable revisions, approvals, rejections, corrections, blocker changes, pushes, deployments, and final verification when they matter to someone following the task. Skip repeated handoffs and internal telemetry that changes nothing for the reader. Before posting, fetch the body and discussions and compare the new result with existing commits, approvals, artifacts, and state.

Reply to the discussion that owns the continuing conversation. Start a new page-level discussion only when the subject changes. A local revision and its later approved push may be separate replies when the approval between them matters, but the second reply must add only the new fact. Do not repeat the branch, tests, caveats, and history.

Treat specialist handoffs as internal evidence, not publishable copy. Write fresh prose in the task's language and apply `unslop`. State what changed, which feedback it addresses, what a teammate can review, and the next real step. Weave useful links into sentences. Keep agent names, command output, raw branch choreography, repeated test counts, and machine-local paths out of the comment. Put detailed QA in an attached report when it remains useful.

Upload every new or revised artifact named in the handoff. Keep repository commits, pull requests, and other durable source records as links. Turn a local HTML preview, image, video, PDF, archive, or report into a Notion attachment; never leave its local path as the only record. For small text files use the Notion attachment content upload. For local binary files use the Notion local file-upload flow, then attach the resulting upload. Use a direct public URL when it is already durable and needs no headers.

When a local file exceeds the MCP's 20 MiB limit, keep the original at its canonical source and create a review copy below the limit with format-appropriate compression or transcoding. The copy must preserve the text, captions, legibility, behavior, or visual evidence people need to review. Do not overwrite the original or optimize a file that already fits. Use `ntn` only when the exact original must be attached and cannot reasonably fit below the limit. Inject its credentials from the verified Sidekick Infisical project, and create the attachment or comment with the same Notion integration that uploaded it. Never mix file-upload IDs across integrations.

A comment supports three attachments. When an event has more, add the fewest natural replies needed in the same discussion. Attach changed files once; reference the earlier Notion attachment when a later event reuses an unchanged file.

After writing, fetch the page and affected discussion again. Confirm the body, properties, reply placement, links, and attachments. If the result is uncertain, read current state before retrying. A task journal update is complete only when Notion contains the human explanation and the evidence needed to review it without access to the agent's machine.
