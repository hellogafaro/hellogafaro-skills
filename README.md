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

## Synchronization

The `Sync Notion skills` GitHub Action runs daily at 03:17 UTC and can also be started
manually. It uses a time-limited, read-only Infisical service token scoped to
`prod:/github/skills-sync`, reads `NOTION_ACCESS_TOKEN`, downloads every page in
the configured Notion Skills data source, validates the exports, and commits
only real changes.

The workflow requires this repository secret:

- `INFISICAL_SERVICE_TOKEN`

It also requires this repository variable:

- `NOTION_SKILLS_DATA_SOURCE_ID`

## Structure

- `skills/` contains the complete Notion exports, including supporting files.
- `tests/` validates the exported inventory and portable content.

## Rules

- Change a skill in Notion, then refresh this generated snapshot.
- Never sync edits from GitHub back into Notion.
- Keep lowercase hyphen skill IDs and trigger-first descriptions.
- Do not add removed legacy skills.
