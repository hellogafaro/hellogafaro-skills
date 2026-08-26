import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const skillsDir = path.join(root, "skills");

const removedMeetingSkill = ["meeting", "notes"].join("-");
const removedContentSkill = ["content", "creation"].join("-");
const removedAccountsOpsSkill = ["hellogafaro", "accounts", "ops"].join("-");

const expectedResources = {
  "accounts-operations": [
    "references/shopify.md",
    "references/klaviyo.md",
    "references/meta-ads.md",
    "references/google-ads.md",
    "references/tiktok-ads.md",
    "references/posthog.md",
    "references/google-analytics.md",
    "references/search-console.md"
  ],
  "shopify-live-support": [
    "references/support-routes.md",
    "references/billing.md",
    "references/shipping.md",
    "references/general.md"
  ],
  "skills-management": [
    "references/prerequisites.md",
    "references/creation.md",
    "references/updating.md",
    "references/management.md",
    "references/github-cli.md",
    "references/migration-troubleshooting.md"
  ],
  "shopiworks-clickup-sync": [
    "references/clickup-content.md",
    "references/clickup-operations.md",
    "references/clickup-routing.md",
    "references/clickup-safety.md",
    "scripts/clickup.ts",
    "scripts/clickup.test.ts"
  ],
  "unslop": ["LICENSE.md"]
};

const forbiddenSkills = [
  removedContentSkill,
  removedAccountsOpsSkill,
  removedMeetingSkill,
  "analysis",
  "calendar-management",
  "commerce-analysis",
  "deep-research",
  "email-analysis",
  "email-management",
  "environment-management",
  "inbox-management",
  "measurement-audit",
  "memory",
  "memory-management",
  "notion",
  "notion-operations",
  "paid-media-analysis",
  "performance-analysis",
  "skill-creation",
  "slack",
  "slack-communication",
  "task-management"
];

const allowedNotionIds = [
  "25ffc7982e4380c58df6fef037530baa",
  "25ffc7982e438086a264e63214fd1a60",
  "f2cc8e0db76a4e84a58d30df91bca65c",
  "25ffc7982e438056969fff6a4672eaaa",
  "25ffc7982e438074aa69ecc16e69ada9"
];

const ellipsis = ".".repeat(3);

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, "SKILL.md must start with YAML frontmatter");

  const data = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (pair) data[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

async function getSkills() {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

test("skill inventory excludes forbidden legacy names", async () => {
  const actual = await getSkills();
  for (const forbidden of forbiddenSkills) {
    assert.ok(!actual.includes(forbidden), `${forbidden} should not exist`);
  }
});

test("skills have valid metadata", async () => {
  for (const skill of await getSkills()) {
    const file = path.join(skillsDir, skill, "SKILL.md");
    const markdown = await readFile(file, "utf8");
    const frontmatter = parseFrontmatter(markdown);

    assert.equal(frontmatter.name, skill);
    assert.ok(frontmatter.description?.length > 60, `${skill} needs useful description`);
    assert.ok(frontmatter.description.startsWith("Use when "), `${skill} description must be trigger-first`);
    assert.ok(markdown.includes(`# ${skill}`), `${skill} needs matching h1`);
    assert.ok(!markdown.includes("\u2014"), `${skill} must not use em dash`);
    assert.ok(!markdown.includes("\u2013"), `${skill} must not use en dash`);
    assert.ok(!markdown.includes(ellipsis), `${skill} must not use ellipsis`);

    for (const heading of markdown.matchAll(/^##\s+(.+)$/gm)) {
      const title = heading[1];
      assert.ok(!/^[a-z]/.test(title), `${skill} section heading must use sentence case: ${title}`);
    }
  }
});

test("accounts-operations is a self-contained live API contract", async () => {
  const markdown = await readFile(path.join(skillsDir, "accounts-operations", "SKILL.md"), "utf8");

  assert.ok(markdown.includes("self-contained"));
  assert.ok(markdown.includes("PUBLIC_URL"));
  assert.ok(markdown.includes("BEARER_TOKEN"));
  assert.ok(!markdown.includes("hellogafaro/hellogafaro-accounts"));
  assert.ok(!markdown.includes("HELLOGAFARO_ACCOUNTS"));
  assert.ok(!markdown.includes("accounts.ongafaro.com"));
  assert.ok(markdown.includes("/connections/{connection_id}"));
  assert.ok(markdown.includes("/accounts/{id}/credentials"));
  assert.ok(markdown.includes("decrypted credentials"));
});

test("expected bundled resources exist", async () => {
  for (const [skill, resources] of Object.entries(expectedResources)) {
    const skillMarkdown = await readFile(path.join(skillsDir, skill, "SKILL.md"), "utf8");

    for (const resource of resources) {
      const resourcePath = path.join(skillsDir, skill, resource);
      const resourceStat = await stat(resourcePath);

      assert.ok(resourceStat.isFile(), `${skill}/${resource} must exist`);
      assert.ok(skillMarkdown.includes(resource), `${skill} must mention ${resource}`);
    }
  }
});

test("deprecated runtime references are gone", async () => {
  const entries = await readdir(root, { recursive: true });
  const oldNotionWrapper = ["skills", "notion", "scripts", "ntn.ts"].join("/");
  const deprecatedRepo = ["hellogafaro", "agents", "DEPRECATED"].join("-");
  const deprecatedAccountsRepo = ["hellogafaro", "accounts", "ops"].join("-");

  for (const entry of entries) {
    if (!entry.endsWith(".md") && !entry.endsWith(".mjs")) continue;

    const file = path.join(root, entry);
    const text = await readFile(file, "utf8");

    assert.ok(!text.includes(oldNotionWrapper), `${entry} points to old notion wrapper`);
    assert.ok(!text.includes(deprecatedRepo), `${entry} points to deprecated repo`);
    assert.ok(!text.includes(deprecatedAccountsRepo), `${entry} points to deprecated accounts repo`);
    assert.ok(!/\$HOME\/[^\s`]*hellogafaro-accounts/i.test(text), `${entry} hardcodes an Accounts Ops checkout path`);
  }
});

test("skills use portable host state", async () => {
  const entries = await readdir(skillsDir, { recursive: true });
  const forbiddenPhrases = [
    "General Notion AI",
    "Codex asking Claude",
    "Plan mode"
  ];
  const hardcodedNotionId = /\b(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i;

  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;

    const file = path.join(skillsDir, entry);
    const text = await readFile(file, "utf8");
    const notionIds = text.match(new RegExp(hardcodedNotionId.source, "gi")) ?? [];

    if (entry === path.join("tasks-operations", "SKILL.md")) {
      assert.deepEqual(notionIds.sort(), [...allowedNotionIds].sort());
    } else {
      assert.equal(notionIds.length, 0, `${entry} hardcodes a Notion identifier`);
    }

    for (const phrase of forbiddenPhrases) {
      assert.ok(!text.includes(phrase), `${entry} contains deprecated sidekick guidance: ${phrase}`);
    }
  }
});
