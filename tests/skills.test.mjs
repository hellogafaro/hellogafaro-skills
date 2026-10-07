import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

import { parseFrontmatter } from "../scripts/sync-notion-skills.mjs";

const skillsDir = path.resolve(import.meta.dirname, "../skills");

test("exported skills have valid metadata", async () => {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skills = entries.filter((entry) => entry.isDirectory());

  assert.ok(skills.length > 0, "Notion export must contain at least one skill");

  for (const { name } of skills) {
    const markdown = await readFile(path.join(skillsDir, name, "SKILL.md"), "utf8");
    const metadata = parseFrontmatter(markdown);

    assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
    assert.equal(metadata.name, name);
    assert.ok(metadata.description?.trim(), `${name} needs a description`);
    assert.match(metadata.notion_page_id ?? "", /^(?:[0-9a-f]{32}|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/iu);
  }
});
