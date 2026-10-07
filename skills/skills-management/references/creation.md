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

## Author for reliable invocation

Use focused action names and a trigger for each distinct branch. State the outcome first, then the steps that change the result. Give each consequential step an observable completion condition and an honest missing-input path. Keep authorization boundaries beside the action they govern.

Keep one owner for each rule. Route to neighboring skills rather than copying their procedures. Inline what every invocation needs; put branch-specific detail behind a conditional reference. Read commands, configuration, recipients, and project facts from their live source instead of caching them in shared instructions.

Before publishing, inspect a normal case, a missing-input case, and the nearest neighboring skill's case. Check whether the intended skill triggers, stops at its boundary, and produces evidence appropriate to the request. Structural validation and scenario walkthroughs do not prove real-world behavior; report which validation actually ran.

This structure is informed by [Matt Pocock's writing-for-agents](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md) and [pstack](https://github.com/cursor/plugins/tree/main/pstack). Borrow the procedure, not another platform's tool names or permissions.

## Save and verify

Create the page in the Notion Skills database and upload the complete skill directory. Do not add tags unless the user asks for grouping. Download the saved skill and verify its name, description, instructions, and supporting files. Check neighboring skills for routing overlap and update durable project instructions when the new skill must take precedence over a built-in or legacy skill.
