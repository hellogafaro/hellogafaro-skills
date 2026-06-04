import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const skillsDir = path.join(root, "skills");
const dataSourceId = "33bfc7982e4381eabeb3000bc9f775f1";
const repoBaseUrl = "https://github.com/hellogafaro/hellogafaro-agents/blob/main";

const displayNames = {
  "accounts-ops": "Accounts Ops",
  "analysis": "Analysis",
  "calendar-management": "Calendar management",
  "shopiworks-clickup-sync": "Shopiworks ClickUp Sync",
  "commerce-analysis": "Commerce analysis",
  "deep-research": "Deep research",
  "documentation-creation": "Documentation creation",
  "email-analysis": "Email analysis",
  "email-management": "Email management",
  "inbox-management": "Inbox management",
  "measurement-audit": "Measurement audit",
  "memory-management": "Memory management",
  "notion-operations": "Notion operations",
  "paid-media-analysis": "Paid media analysis",
  "performance-analysis": "Performance analysis",
  "reporting": "Reporting",
  "slack-communication": "Slack communication",
  "task-management": "Task management"
};

function runNtn(args) {
  return execFileSync("ntn", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("Missing frontmatter");

  const data = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (pair) data[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

function pageName(page) {
  return page.properties.Name.title.map((part) => part.plain_text).join("");
}

function request(pathname, method, body) {
  const args = ["api", pathname];
  if (method) args.push("-X", method);
  if (body) args.push("-d", JSON.stringify(body));
  return runNtn(args);
}

function contentFor(skill) {
  return `Read [${skill.displayName} skill](${skill.url}).`;
}

const skillIds = (await readdir(skillsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const skills = skillIds.map((id) => {
  const markdown = readFileSync(path.join(skillsDir, id, "SKILL.md"), "utf8");
  const frontmatter = parseFrontmatter(markdown);

  if (frontmatter.name !== id) throw new Error(`${id} frontmatter name mismatch`);

  return {
    id,
    displayName: displayNames[id],
    description: frontmatter.description,
    url: `${repoBaseUrl}/skills/${id}/SKILL.md`
  };
});

for (const skill of skills) {
  if (!skill.displayName) throw new Error(`Missing display name for ${skill.id}`);
}

const existing = JSON.parse(
  request(`/v1/data_sources/${dataSourceId}/query`, "POST", { page_size: 100 })
).results;

const pagesByName = new Map(existing.map((page) => [pageName(page), page]));
const activeSkillNames = new Set(skills.map((skill) => skill.displayName));

const updated = [];
const created = [];
const archived = [];

for (const skill of skills) {
  const body = {
    properties: {
      Name: { title: [{ text: { content: skill.displayName } }] },
      Description: { rich_text: [{ text: { content: skill.description } }] },
      URL: { url: skill.url }
    }
  };

  let page = pagesByName.get(skill.displayName);

  if (!page) {
    const createdPage = JSON.parse(
      request("/v1/pages", "POST", {
        parent: { type: "data_source_id", data_source_id: dataSourceId },
        properties: body.properties
      })
    );
    page = createdPage;
    created.push(skill.displayName);
  } else {
    request(`/v1/pages/${page.id}`, "PATCH", body);
    updated.push(skill.displayName);
  }

  runNtn(["pages", "update", page.id, "--content", contentFor(skill), "--allow-deleting-content"]);
}

for (const page of existing) {
  const name = pageName(page);

  if (!activeSkillNames.has(name)) {
    request(`/v1/pages/${page.id}`, "PATCH", { in_trash: true });
    archived.push(name);
  }
}

console.log(JSON.stringify({ updated, created, archived }, null, 2));
