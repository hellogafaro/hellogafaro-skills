# hellogafaro skills

Central source for Hello Gafaro agent skills and supporting scripts.

Notion skill database rows should act as a mapping layer. The durable skill instructions live in this repo under `skills/{skill-id}/SKILL.md`.

## structure

- `skills/` contains shared and specialist agent skills.
- `workers/` contains Notion worker code when a custom agent needs code outside instructions.
- `tests/` keeps the skill inventory and metadata honest.

## accounts management

The `accounts-operations` skill is a self-contained usage contract for the live Hello Gafaro Accounts API. It includes API and provider routing references, permits any available HTTP client, and never requires an implementation repository checkout.

## environment management

Install the repository setup skill into a project:

```bash
gh skill install hellogafaro/hellogafaro-skills environment-management \
  --dir .agents/skills
```

Then ask the agent:

> Use `environment-management` to prepare this repository for Cursor Cloud.

The skill inspects the repository, asks what tools and workflows it needs, creates project-specific agent guidance, installs baseline and relevant platform skills, configures project-scoped CLIs and secret names, and adds a reproducible Cursor environment when needed. It includes focused guidance for Shopify and Cloudflare plus copyable Node, Bun, Python, uv, and GitHub CLI environment assets.

## rules

- Keep `SKILL.md` focused on workflow and hard rules.
- Keep mutable config out of skill entrypoints.
- Use lowercase hyphen skill ids.
- Use sentence case display names.
- Do not add removed legacy skills.
