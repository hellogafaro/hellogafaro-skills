---
name: |-
  git-operations
description: |-
  Use when work involves Git or GitHub operations, including commits, staging, branches, pushes, pull requests, merges, tags, releases, or release notes.
notion_page_id: 3dffc798-2e43-8122-9dcc-f8443b6357eb
---

# git-operations

Handle Git and GitHub work from the real repository state.

Prefer `gh` for GitHub operations.

## Workflow

1. Run `git status --short --branch`.
2. Inspect staged changes first with `git diff --staged`.
3. If nothing is staged, inspect the working tree diff.
4. Keep one logical change per commit, PR, merge, or release.
5. Leave unrelated local changes untouched unless the user asks to include them.
6. Report what changed and what was verified.

## Commits

- Stage only files that belong to the requested logical change.
- Check the staged diff before committing.
- Use a short imperative subject.
- Prefer obvious prefixes: `fix:`, `feat:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Do not add a body unless it explains important why, risk, migration, or breaking behavior.

Good subjects:

- `fix: preserve selected filters`
- `feat: add handoff skill`
- `docs: clarify deployment steps`

Use a commit body when the diff is not self-explanatory:

```txt
fix: preserve selected filters

The previous reset path cleared user-selected filters after refresh. Keep the
selection stable while still removing invalid values from the result set.
```

## Pull requests

- Use `gh pr` for PR creation, checks, status, and review data.
- Base the PR body on the actual diff and commits.
- Include Summary, QA, and Notes.
- Do not invent issue links, reviewers, labels, or test results.
- Before marking ready, check branch status and CI when available.
- Engineering completion requires a proof canvas or another useful visual reference, including for small nonvisual changes. Show observed behavior with fresh screenshots, clips, measured comparisons, or a compact evidence table or diagram backed by real checks. A decorative diagram or test-count summary alone is not proof. Keep the goal, method, observations, reasoning, and actual review verdict in the proof; keep operational follow-ups in the handoff or PR.
- In BB, discover available agents with `bb agent list --json` and inspect candidate descriptions and instructions. Select the most relevant independent reviewer for the changed domain, respecting project restrictions and provider requirements. Never hardcode a reviewer name or ID in stored instructions. Use a fresh review thread that did not author the change.
- Request review of the PR's current base and head, actual diff, requirements, and completion evidence before declaring completion. A request or successful CI run is not a review verdict. For high-impact work, select a second independent reviewer on another provider through the coordinating owner when available; report the missing review if no eligible reviewer is available.
- The reviewer returns findings, verified/failed/unverified checks, verdict, reviewed head SHA, and exact PR review text to the closing agent. The closing agent owns publication of that review in the PR under the user's standing authorization for routine PR review. Read existing reviews first, avoid duplicate posts, verify the resulting review URL and reviewed revision, and link it in the proof and handoff.
- Use a formal GitHub review where the authenticated identity permits it. If the shared identity authored the PR and GitHub rejects self-approval, publish the independent review as a PR comment with the reviewer attribution and reviewed head SHA. Never claim that a comment satisfies a required platform approval.
- Fix required findings and obtain review of the affected changes on the new head before claiming completion. A prior verdict does not cover a changed head, and unverified required checks cannot pass. If there is no PR, review the exact local revision and return the verdict in the handoff; do not create or publish a PR merely to satisfy this rule without authorization.

Default PR body:

```markdown
## Summary
- What changed.

## QA
- Command, test, or manual check actually run.

## Notes
- Caveats, screenshots, links, migrations, rollback notes, or `None`.
```

## Merges and releases

- Do not merge without explicit user approval.
- Do not merge if checks are failing unless the user explicitly accepts the risk.
- Prefer platform-native merge commands such as `gh pr merge`.
- For tags and releases, inspect existing tags/releases first.
- Release notes must come from commits, PRs, changelog, or user-provided context.
- Release notes should group user-facing changes, fixes, migrations, and known risks when those categories exist.

## Safety

- Never commit secrets, credentials, `.env` files, private keys, or unrelated files.
- Never change git config unless the user asks.
- Never run destructive commands unless the user explicitly asks.
- Never force push, rewrite shared history, or skip hooks unless the user explicitly asks.
- If hooks fail, fix the issue and create the commit normally.
