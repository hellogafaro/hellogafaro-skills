import assert from "node:assert/strict";
import { test } from "node:test";

import { assertArchivePaths, parseFrontmatter } from "../scripts/sync-notion-skills.mjs";

test("parses Notion block-scalar frontmatter", () => {
  const metadata = parseFrontmatter(`---
name: |-
  reporting
description: |-
  Use when preparing a report.
notion_page_id: 11111111-2222-3333-4444-555555555555
---
`);

  assert.equal(metadata.name, "reporting");
  assert.equal(metadata.description, "Use when preparing a report.");
  assert.equal(metadata.notion_page_id, "11111111-2222-3333-4444-555555555555");
});

test("rejects archive traversal", () => {
  assert.doesNotThrow(() => assertArchivePaths(["research/SKILL.md"]));
  assert.throws(() => assertArchivePaths(["../outside"]), /Unsafe archive path/u);
  assert.throws(() => assertArchivePaths(["/absolute"]), /Unsafe archive path/u);
});
