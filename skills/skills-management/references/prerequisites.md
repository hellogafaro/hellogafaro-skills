# Prerequisites

## Resolve the source

1. Find the skill in the live Notion Skills library.
2. Download the complete skill directory, including supporting files, before changing it.
3. Treat the Notion page ID as the stable source identity.
4. Do not edit `.agents/skills`, BB user skill directories, provider directories, plugin caches, or the generated GitHub mirror.
5. If the skill is missing from Notion but exists in GitHub or an installation, treat that copy as migration input, not as a new canonical source.

## Verify Notion

Confirm that the selected connection can search, download, and upload skills. Fetch the target Skills database before creating a page so its current data source and title property are known. Never store connection tokens, page IDs, or database IDs in the skill itself.

After an upload, download the skill again and compare its `SKILL.md` instructions and supporting files with the intended source. Notion may normalize Markdown formatting and emits only standard skill frontmatter.

## Verify distribution only when needed

For GitHub backup or installation work, verify the generated repository, GitHub CLI version, authentication, and repository access. Never edit the mirror to fix a Notion skill. If the mirror differs, repair or rerun the Notion-to-GitHub sync.
