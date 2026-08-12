# Project setup

## Inspect first

Read the full repository surface relevant to setup: manifests, lockfiles, source layout, deployment configuration, CI, README, existing `AGENTS.md`, `.cursor`, `.agents`, and `.claude` paths. Derive facts; do not generate generic architecture claims.

## AGENTS.md

Keep `AGENTS.md` project-specific and concise. Include only verified information an agent needs to work safely:

- purpose and architecture
- important directories and ownership
- supported commands
- coding and testing conventions not enforced by tooling
- deployment boundaries and known limitations
- required secret names without values

Keep stack, installation, and broad architecture documentation in `README.md` or linked docs. Do not duplicate Cursor User Rules.

## Compatibility links

When Claude compatibility is wanted:

```bash
ln -s AGENTS.md CLAUDE.md
mkdir -p .claude
ln -s ../.agents/skills .claude/skills
```

Inspect existing paths first. Preserve real files and valid links; never overwrite them blindly.

## Completion

Confirm the instructions match the repository, links resolve, no secrets are tracked, and repository validation passes.
