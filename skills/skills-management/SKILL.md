---
name: |-
  skills-management
description: |-
  Use when creating, updating, reviewing, renaming, removing, publishing, installing, synchronizing, migrating, or troubleshooting first-party agent skills in Notion, their generated GitHub backup, or BB skill directories.
notion_page_id: 3dffc798-2e43-8172-a39e-f785e74575fe
---

# skills-management

Own the complete lifecycle of agent skills from source authoring through verified installation.

## Hard rules

- Search the Notion Skills library before creating. Download and read the complete existing skill before updating it.
- Notion is the source of truth for first-party skills. Never edit the generated GitHub backup or installed copies directly.
- Keep mutable account data, ids, credentials, and environment-specific routing out of skills.
- Use BB's user skill directory for shared skills and `.agents/skills` for project installations.
- Keep one provider-agnostic BB installation. Do not maintain separate provider copies.
- Treat GitHub as a generated backup and distribution mirror, never an authoring source.
- Never mix `gh skill` installations with legacy copy-based deployment.
- Validate a Notion download before replacing an installed version. Publish, delete, or replace external state only with explicit approval.
- Never print tokens or raw authentication payloads.

## Workflow

1. Classify the request as creation, update, management, installation, migration, or troubleshooting.
2. Read [prerequisites](references/prerequisites.md) and resolve the live Notion skill page, supporting files, and installed copies.
3. Follow the matching workflow:
   - [Creation](references/creation.md)
   - [Updating](references/updating.md)
   - [Management](references/management.md)
4. For GitHub backup or BB installation, follow [GitHub mirror and installation](references/github-cli.md).
5. If anything fails or legacy copies exist, use [Migration and troubleshooting](references/migration-troubleshooting.md).
6. Download the completed Notion skill and compare its instructions and supporting files with the intended change.
7. Verify the BB inventory and every approved project installation before declaring completion.

## Completion

Report the Notion skill changed, validation run, installed locations affected, GitHub mirror state, and any unperformed external action. A skill change is complete only when Notion is current and every approved BB installation is synchronized without duplicate copies.
