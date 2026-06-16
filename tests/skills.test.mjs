import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const skillsDir = path.join(root, "skills");

const expectedSkills = [
  "accounts-ops",
  "analysis",
  "brainstorm",
  "calendar-management",
  "commerce-analysis",
  "deep-research",
  "documentation-creation",
  "email-analysis",
  "email-management",
  "git-operations",
  "handoff",
  "inbox-management",
  "measurement-audit",
  "memory-management",
  "notion-operations",
  "paid-media-analysis",
  "performance-analysis",
  "plan",
  "reporting",
  "shopify-chargeback",
  "skill-creation",
  "shopiworks-clickup-sync",
  "slack-communication",
  "summarize",
  "task-management"
];

const removedMeetingSkill = ["meeting", "notes"].join("-");
const removedContentSkill = ["content", "creation"].join("-");

const expectedResources = {
  "analysis": ["scripts/analyze_timeseries.py"],
  "calendar-management": [
    "references/calendar-conflicts.md",
    "references/calendar-edge-cases.md",
    "references/calendar-fetch-scheduling.md",
    "references/calendar-inbox-sync.md",
    "references/calendar-prep.md",
    "references/calendar-triage.md"
  ],
  "commerce-analysis": ["references/ecommerce-movement.md"],
  "email-analysis": ["references/lifecycle.md"],
  "email-management": [
    "references/email-edge-cases.md",
    "references/email-attachments.md",
    "references/email-auto-rules.md",
    "references/email-inbox-sync.md",
    "references/email-responding.md",
    "references/email-signal-rules.md",
    "references/email-snoozed.md"
  ],
  "inbox-management": [
    "references/edge-cases.md",
    "references/loop-states.md",
    "references/reconciliation.md"
  ],
  "measurement-audit": ["references/attribution.md"],
  "paid-media-analysis": ["references/diagnostics.md"],
  "reporting": ["references/report-types.md"],
  "shopiworks-clickup-sync": [
    "references/clickup-content.md",
    "references/worker-tools.md"
  ],
  "task-management": [
    "references/completion.md",
    "references/inbox-sync.md",
    "references/source-material.md",
    "references/task-format.md",
    "references/task-queries.md",
    "references/tasks-schema.md",
    "references/time-tracking.md"
  ]
};

const forbiddenSkills = [
  removedContentSkill,
  "hellogafaro-accounts-ops",
  removedMeetingSkill,
  "memory",
  "notion",
  "slack"
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

test("skill inventory is intentional", async () => {
  const entries = await readdir(skillsDir);
  const actual = [];

  for (const entry of entries) {
    const entryStat = await stat(path.join(skillsDir, entry));
    if (entryStat.isDirectory()) actual.push(entry);
  }

  assert.deepEqual(actual.sort(), expectedSkills.toSorted());

  for (const forbidden of forbiddenSkills) {
    assert.ok(!actual.includes(forbidden), `${forbidden} should not exist`);
  }
});

test("skills have valid metadata", async () => {
  for (const skill of expectedSkills) {
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

test("accounts ops stays a router", async () => {
  const markdown = await readFile(path.join(skillsDir, "accounts-ops", "SKILL.md"), "utf8");

  assert.ok(markdown.includes("/Users/jg/Dev/hellogafaro-accounts-ops"));
  assert.ok(!markdown.includes("refresh token"));
  assert.ok(!markdown.includes("client secret"));
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

  for (const entry of entries) {
    if (!entry.endsWith(".md") && !entry.endsWith(".mjs")) continue;

    const file = path.join(root, entry);
    const text = await readFile(file, "utf8");

    assert.ok(!text.includes(oldNotionWrapper), `${entry} points to old notion wrapper`);
    assert.ok(!text.includes(deprecatedRepo), `${entry} points to deprecated repo`);
  }
});
