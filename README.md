# hellogafaro skills

Central source for Hello Gafaro agent skills and supporting scripts.

Notion skill database rows should act as a mapping layer. The durable skill instructions live in this repo under `skills/{skill-id}/SKILL.md`.

## structure

- `skills/` contains shared and specialist agent skills.
- `workers/` contains Notion worker code when a custom agent needs code outside instructions.
- `tests/` keeps the skill inventory and metadata honest.

## accounts management

The `accounts-operations` skill is a self-contained usage contract for live Hello Gafaro Studio. Use Studio MCP (`connections_execute`) when those tools are available, or Studio REST with curl. It includes account and connection management, raw provider paths, and never requires an implementation repository checkout.

## rules

- Keep `SKILL.md` focused on workflow and hard rules.
- Keep mutable config out of skill entrypoints.
- Use lowercase hyphen skill ids.
- Use sentence case display names.
- Do not add removed legacy skills.
