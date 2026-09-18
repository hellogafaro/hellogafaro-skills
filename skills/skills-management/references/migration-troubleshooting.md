# Migration and troubleshooting

## Migrate duplicate project copies

1. Record the current Notion and BB skill inventories.
2. Confirm the Notion skill download contains the intended instructions and supporting files.
3. Use `.agents/skills` as the single project installation directory.
4. Preserve any unique local content before replacing legacy copies.
5. Reinstall each selected skill from the generated GitHub mirror into `.agents/skills` so provenance metadata is present.
6. Remove the old skill name and legacy deploy command in the same migration.
7. Verify discovery through BB before committing.

Do not replace unrelated files under `.agents` or any provider directory.

## Common blockers

- `gh skill` is unavailable: upgrade GitHub CLI to 2.95 or newer with approval.
- Authentication fails: run `gh auth status` and restore the intended GitHub account.
- Repository lookup fails: verify the remote owner/name and the authenticated account's private-repository access.
- Notion differs from GitHub: treat Notion as canonical and repair or rerun the generated mirror sync.
- Updates skip a skill: inspect `gh skill list`; manually copied skills lack provenance and must be reinstalled.
- Duplicate skills appear: search project and user scopes, then remove only the obsolete approved copy.
- BB does not discover skills: verify the BB user or project installation path and start a new agent session.
- Git shows unexpected deletions: stop, preserve the working tree, and compare the canonical source before proceeding.

## Completion checks

```bash
gh skill list --dir .agents/skills
gh skill update --dir .agents/skills --dry-run
git status --short --branch
```

Also confirm the old skill name, old deploy command, duplicate provider copies, and stale references are absent.
