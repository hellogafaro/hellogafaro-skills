# Skills

## Baseline

Install this skill and these six baseline skills from `hellogafaro/hellogafaro-skills` into `.agents/skills`:

- environment-management
- brainstorm
- deep-research
- documentation-creation
- handoff
- skills-management
- summarize

Do not install `accounts-operations` or `git-operations` by default.

```bash
gh skill install hellogafaro/hellogafaro-skills \
  environment-management brainstorm deep-research documentation-creation \
  handoff skills-management summarize --dir .agents/skills
```

Add platform skills only after inspecting the repository and confirming the user's needs. Prefer official first-party sources. Review skill instructions and provenance before committing.

## Updates

```bash
gh skill list --dir .agents/skills --json skillName,sourceURL,scope,version,pinned,path
gh skill update --dir .agents/skills --dry-run
gh skill update --dir .agents/skills --all
```

Review the dry run, installed diff, and repository checks. A skill installed by another supported installer must be updated through that installer rather than mixed with `gh skill` deployment.
