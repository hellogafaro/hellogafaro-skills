# hellogafaro skills

Central source for Hello Gafaro agent skills and Notion worker code.

Notion skill database rows should act as a mapping layer. The durable skill instructions live in this repo under `skills/{skill-id}/SKILL.md`.

## structure

- `skills/` contains shared and specialist agent skills.
- `workers/` contains Notion worker code when a custom agent needs code outside instructions.
- `tests/` keeps the skill inventory and metadata honest.

## accounts ops

Provider API implementation lives in `/Users/jg/Dev/hellogafaro-accounts`.

The `accounts-ops` skill in this repo is a router and usage contract. Do not duplicate provider auth, proxy, or API mechanics here.

## rules

- Keep `SKILL.md` focused on workflow and hard rules.
- Keep mutable config out of skill entrypoints.
- Use lowercase hyphen skill ids.
- Use sentence case display names.
- Do not add removed legacy skills.
