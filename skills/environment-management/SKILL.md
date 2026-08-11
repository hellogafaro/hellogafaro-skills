---
description: Use when bootstrapping or updating a Hello Gafaro Cursor project, including AGENTS.md, symlinks, selective skill installs, Cursor cloud environment hints, and skill or prompt updates.
name: environment-management
---

# environment-management

You set up and maintain Hello Gafaro Cursor projects. One skill in the repo handles bootstrap, skill selection, and updates.

## When to use

- New repo or empty project needs Hello Gafaro agent setup.
- User asks to add, remove, or update skills for this repo.
- User asks to refresh AGENTS.md, symlinks, or cloud environment guidance.
- User asks what Cursor cloud environment to use for this stack.

## Hard rules

- Install skills with `gh skill install` into `.agents/skills/`. Never edit installed skill copies as source of truth.
- Skill source of truth is `hellogafaro/hellogafaro-skills`. Edit there, push, then update installed copies.
- Never put secrets in committed files. Cursor cloud secrets live in the dashboard.
- `CLAUDE.md` MUST symlink to `AGENTS.md`. `.claude/skills` MUST symlink to `../.agents/skills`.
- Do not install every skill by default. Use packs in `references/skill-packs.md` unless the user picks manually.

## Bootstrap workflow

Run when the repo is new or missing Hello Gafaro setup.

1. Confirm repo root and git remote exist.
2. Ask or infer project pack: `shopify`, `react`, `ops`, `lifecycle`, `shopiworks`, or `custom`.
3. If `custom`, show skills from `references/skill-packs.md` and confirm the list with the user.
4. Create or update `AGENTS.md` from `references/agents-template.md`. Set project name and pack in the header comment. Ensure `Follow YAGNI principles.` is present under Project rules.
5. Ensure symlinks:
   - `CLAUDE.md` → `AGENTS.md` (relative: `AGENTS.md`)
   - `.claude/skills` → `../.agents/skills`
   - Create `.agents/skills/` if missing.
6. Install selected skills:

```bash
gh skill install hellogafaro/hellogafaro-skills SKILL_ONE SKILL_TWO \
  --agent cursor --dir .agents/skills
```

7. Add `.cursor/environment.json` only if missing. Keep install tooling-only. See `references/environment-json.md`.
8. Tell the user which Cursor cloud environment to pick (Shopify Dev, React Dev, HG Ops). See `references/skill-packs.md`.
9. Commit: `AGENTS.md`, symlinks, `.agents/skills/`, `.cursor/environment.json` if added.

## Update workflow

Run when skills, prompts, or project setup need refresh.

1. Read `references/update-log.md` in this skill for recent pack or prompt changes.
2. List installed skills: `ls .agents/skills/` or `gh skill list --agent cursor --scope project`.
3. Compare to target pack or user request.
4. Install new skills or run `gh skill update --all` when user wants latest from source.
5. Refresh `AGENTS.md` only if template or project context changed. Do not overwrite project-specific edits without asking.
6. Re-check symlinks. Recreate if broken.
7. Commit with a clear message.

## Prompts to use during setup

Ask briefly, then act:

- "What stack is this? Shopify client, React app, ops/internal, lifecycle email, Shopiworks delivery, or custom?"
- "Use recommended skills for [pack], or pick manually?"
- "Which Cursor cloud environment will you use? (Shopify Dev / React Dev / HG Ops)"

## References

Load only when needed.

- `references/skill-packs.md`: pack definitions, skill lists, cloud environment mapping.
- `references/agents-template.md`: starter AGENTS.md for new projects.
- `references/environment-json.md`: minimal `.cursor/environment.json` patterns.
- `references/update-log.md`: maintainer log for pack, prompt, and template changes.

## Maintainer update block

When you change packs, prompts, or templates in this skill, append a dated entry to `references/update-log.md` before pushing `hellogafaro-skills`.
