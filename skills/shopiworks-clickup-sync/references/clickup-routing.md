# ClickUp routing

Mutable ClickUp routing never belongs in the skill. Do not embed workspace, space, folder, list, status, member, task, or time-entry IDs in instructions or scripts.

## Resolve a destination

1. Run `get-workspaces` and select the intended connected workspace by name and ID.
2. Run `get-spaces` for that workspace.
3. Run `get-folders` for the selected space and inspect embedded lists.
4. Run `get-folderless-lists` when the destination may not have a folder.
5. Run `get-list` for the candidate list and confirm its name, folder, statuses, and access before writing.

Reuse a confirmed ID supplied by the user or source context. Rediscover it when it is missing, ambiguous, stale, or rejected by ClickUp.

## Resolve an existing task

- Prefer a confirmed full ClickUp URL or task ID.
- Otherwise resolve the intended list, then use `search-tasks` with a narrow Spanish title fragment.
- Read every plausible candidate with `get-task` and compare title, description, list, dates, and status.
- If multiple candidates remain plausible, stop and ask which target is correct.

## Statuses and members

- Never guess status labels. `complete-task` reads list metadata and selects a status whose ClickUp type is `closed`.
- Never guess assignee IDs. Use an already confirmed member ID or omit assignment when the request does not require it.
- Do not treat a previously observed hierarchy as permanent configuration.
