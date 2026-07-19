# ClickUp safety

## Writes

- Read the exact task or list immediately before writing.
- Use `--dry-run` when validating a new payload or command shape.
- Perform each intended write exactly once.
- If Composio times out or returns an unclear result, read the destination before deciding whether to retry.
- Keep independent actions independent. Do not add a comment, complete a task, or log time unless that action is requested or required by the source workflow.

## Time

- Require finite minutes greater than zero.
- Use the exact source date. A date-only value is interpreted as UTC midnight for ClickUp.
- Always set `billable` to `false`.
- List the target task's time entries before repairing or deleting time.

## Destructive repair

- `delete-task` is only for a mistakenly created mirror task, never a legitimate client task.
- `delete-time` is only for a confirmed incorrect time entry.
- Read and identify the exact target first.
- Require the exact `DELETE <id>` confirmation token.
- Deletions are not automatically recoverable.

## Content and notifications

- Comments are unassigned and use `notify_all: false`.
- Do not include secrets or internal system details in ClickUp content.
- Do not silently translate an ambiguous internal request into a broader client-facing claim.
