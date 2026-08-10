# AGENTS.md template

Copy into repo root as `AGENTS.md`. Replace placeholders.

```markdown
<!-- hg-project: PROJECT_NAME | pack: PACK_NAME | setup: environment-management -->

# Project

One-line description of this repo and who it is for.

## Cursor cloud

- Start agents in **Cloud**, not local.
- Environment: **ENVIRONMENT_NAME** (Shopify Dev, React Dev, or HG Ops).
- Same agent URL to continue on another device.
- Push a wip commit before long breaks.

## Skills

Skills live in `.agents/skills/`. Installed for pack: **PACK_NAME**.

To add or update skills, use the `environment-management` skill or:

```bash
gh skill install hellogafaro/hellogafaro-skills SKILL_NAME --agent cursor --dir .agents/skills
gh skill update --all
```

## Symlinks

- `CLAUDE.md` → `AGENTS.md`
- `.claude/skills` → `../.agents/skills`

## Project rules

Follow YAGNI principles.

Add repo-specific rules below. Keep short.

-
```

## Placeholders

| Token | Example |
|-------|---------|
| PROJECT_NAME | acme-shopify-theme |
| PACK_NAME | shopify |
| ENVIRONMENT_NAME | Shopify Dev |
