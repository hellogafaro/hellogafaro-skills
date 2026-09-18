# Creation

## Define the skill

1. Gather the task, domain, trigger phrases, use cases, required tools, deterministic scripts, reference material, and safety boundaries.
2. Search the Notion Skills library for an existing or neighboring skill before creating one.
3. Prefer extending a clear existing owner over adding overlapping skills.
4. Use a stable lowercase hyphenated skill name. The exported frontmatter `name` and H1 must match it.

## Write the entrypoint

Every skill requires `SKILL.md` with:

```yaml
---
name: example-skill
description: Use when ...
---
```

- Make the description trigger-first and specific.
- Keep the entrypoint concise and put critical behavior first.
- Use `references/` for detail loaded only when needed.
- Use `scripts/` only for deterministic operations that would otherwise be regenerated.
- Keep references one level deep and link every required resource from `SKILL.md`.
- State compatibility requirements only when they materially affect execution.

## Save and verify

Create the page in the Notion Skills database and upload the complete skill directory. Do not add tags unless the user asks for grouping. Download the saved skill and verify its name, description, instructions, and supporting files. Check neighboring skills for routing overlap and update durable project instructions when the new skill must take precedence over a built-in or legacy skill.
