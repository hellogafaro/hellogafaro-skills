---
name: environment-management
description: Use when preparing, auditing, or updating a repository for Cursor or other coding agents, including project AGENTS.md, baseline and platform skills, Cursor Cloud environment files, project CLIs, secrets contracts, symlinks, and dependency updates.
---

# environment-management

Prepare self-contained repositories for reliable human and agent collaboration.

## Workflow

1. Resolve the repository root, Git state, remote, default branch, and existing agent configuration.
2. Inspect manifests, lockfiles, source, infrastructure, documentation, CI, deployment files, and existing skills before proposing changes.
3. Ask one short question when requirements are not already explicit: "What specific tools, platforms, services, and workflows does this repository need?"
4. Separate ownership:
   - Cursor User Rules hold personal cross-project preferences.
   - `AGENTS.md` holds verified project-specific guidance shared through Git.
   - `.agents/skills` holds baseline and relevant platform skills.
   - Project manifests and lockfiles hold provider and framework CLIs.
   - Cursor secrets hold credentials; committed files document names only.
5. Read only the references matching the detected work:
   - Repository instructions and symlinks: [references/project-setup.md](references/project-setup.md)
   - Skill installation and updates: [references/skills.md](references/skills.md)
   - Cursor Cloud configuration: [references/cursor.md](references/cursor.md)
   - Shopify repositories: [references/shopify.md](references/shopify.md)
   - Cloudflare repositories: [references/cloudflare.md](references/cloudflare.md)
   - Representative setups: [references/examples.md](references/examples.md)
   - Cursor base assets: [Dockerfile](assets/cursor/Dockerfile),
     [environment.json](assets/cursor/environment.json),
     [install.sh](assets/cursor/install.sh), [update.sh](assets/cursor/update.sh),
     and [start.sh](assets/cursor/start.sh)
6. Make the smallest complete setup. Preserve existing project decisions and unrelated changes.
7. Validate scripts, JSON, symlinks, installed skill inventory, dependency lockfiles, and the repository's normal checks.
8. Show the resulting diff. Commit or push only when authorized.

## Baseline outcome

- Project-specific `AGENTS.md`, created from repository facts rather than a generic template.
- `CLAUDE.md` linked to `AGENTS.md` when Claude compatibility is wanted.
- Six baseline skills plus this skill in `.agents/skills`, with `.claude/skills` linked to `../.agents/skills`.
- Relevant official platform skills only.
- Provider CLIs pinned per project, never globally.
- `.cursor` base assets when the repository needs a reproducible Cursor Cloud image.
- Secret names documented without secret values.

## Safety

- Never guess credentials, install every available skill, overwrite project instructions, or mix skill installation methods for the same installed copy.
- Never commit tokens, login caches, `.env` values, private keys, or generated authentication state.
- Treat deployment, production mutations, PR creation, merges, and publishing as separate actions requiring explicit authorization.
