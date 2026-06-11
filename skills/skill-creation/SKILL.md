---
name: skill-creation
description: Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
---

# skill-creation

Create skills with just enough instruction for the agent to know when to use them and how to act.

## Process

1. Gather requirements: task, domain, trigger phrases, use cases, required scripts, and reference material.
2. Draft `SKILL.md` with concise instructions.
3. Split extra detail into references only when the main file gets too long or the detail is rarely needed.
4. Add scripts only for deterministic operations that would otherwise be regenerated repeatedly.
5. Review whether the skill is clearer, shorter, and easier to trigger than the previous version.

## Structure

```txt
skill-name/
├── SKILL.md
├── references/
└── scripts/
```

Only `SKILL.md` is required.

## Description

The description is the main trigger surface. It must tell the agent when to load the skill.

- Start with `Use when`.
- Name concrete tasks, domains, tools, file types, or trigger phrases.
- Keep it specific enough to distinguish the skill from neighboring skills.
- Avoid generic descriptions like `Use when helping with documents`.

## SKILL.md

- Keep the main file under 100 lines when practical.
- Put the most important behavior near the top.
- Prefer direct rules over explanation.
- Keep examples short and only include them when they prevent mistakes.
- Do not include time-sensitive facts unless the skill also says how to verify them.
- Keep references one level deep.

## Review checklist

- Description starts with `Use when`.
- Description includes specific triggers.
- `#` heading matches the skill name.
- Instructions are concise and actionable.
- Extra material is split into references only when useful.
- Scripts are used only when they improve reliability or reduce repeated code.
