# Updating

## Inspect before editing

1. Download and read the entire selected Notion skill and every reference needed for the requested change.
2. Search Notion and the BB inventory for its name, installation paths, and consumers.
3. Compare installed or GitHub copies with the Notion download before attributing drift.
4. Identify whether the correction belongs in the skill, a reference, a script, project instructions, or mutable configuration.

## Make the change

- Preserve the skill's trigger boundary unless the user intentionally changes scope.
- Keep the main file compact and move edge cases into focused references.
- Update scripts only when deterministic behavior changes.
- Remove stale instructions instead of leaving competing workflows.
- Never add secrets, account ids, tokens, mailbox selectors, database ids, or other mutable routing data.

## Validate

Upload the complete revised directory to the existing Notion skill page. Download it again and compare the body and supporting files. Notion may normalize Markdown tables, code-fence aliases, and list numbering. Confirm that the meaning remains intact. Do not trigger GitHub synchronization or replace installed copies without reviewing the result and obtaining any required approval.
