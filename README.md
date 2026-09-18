# Hello Gafaro skills

Generated backup of Hello Gafaro's first-party Notion Skills.

Notion is the source of truth. Do not edit skill content in this repository. Each
`notion_page_id` identifies the canonical Notion page from which the directory
was exported.

## Distribution

- BB shared installations live in its user skill directory.
- Project-specific installations live once in `.agents/skills`.
- Provider-specific copies are not maintained.
- Third-party and BB plugin skills remain with their upstream owners and are not
  mirrored here.

The repository is a backup and distribution snapshot. It is not required for BB
to use skills exported directly from Notion.

## Structure

- `skills/` contains the complete Notion exports, including supporting files.
- `tests/` validates the exported inventory and portable content.

## Rules

- Change a skill in Notion, then refresh this generated snapshot.
- Never sync edits from GitHub back into Notion.
- Keep lowercase hyphen skill IDs and trigger-first descriptions.
- Do not add removed legacy skills.
