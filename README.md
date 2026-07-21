# hellogafaro skills

Central source for Hello Gafaro agent skills and supporting scripts.

Notion skill database rows should act as a mapping layer. The durable skill instructions live in this repo under `skills/{skill-id}/SKILL.md`.

## structure

- `skills/` contains shared and specialist agent skills.
- `workers/` contains Notion worker code when a custom agent needs code outside instructions.
- `tests/` keeps the skill inventory and metadata honest.

## accounts management

Provider API implementation lives in the canonical `hellogafaro/hellogafaro-accounts` repository. The `accounts-management` skill resolves an existing local checkout without assuming a workspace path or capitalization.

The `accounts-management` skill in this repo is a router and usage contract. Do not duplicate provider auth, proxy, or API mechanics here.

## rules

- Keep `SKILL.md` focused on workflow and hard rules.
- Keep mutable config out of skill entrypoints.
- Use lowercase hyphen skill ids.
- Use sentence case display names.
- Do not add removed legacy skills.
