#!/usr/bin/env node
// Deploy skills from this source repo to every local consumer for both CLIs.
//
// Source of truth: <repo>/skills/<skill-id>/
// Targets: Claude and Codex local skill dirs (project and global).
//
// Rules:
// - Only update skills that ALREADY exist in a target. Never add a skill a
//   target did not already carry, and never delete a target-only skill.
//   This preserves each target's curated subset while killing drift.
// - A skill present in source but absent from a target is reported, not pushed.
// - A skill present in a target but absent from source is reported as unmanaged.
//
// Usage:
//   node scripts/deploy-skills.mjs            # deploy all shared skills
//   node scripts/deploy-skills.mjs --only email-management,inbox-management
//   node scripts/deploy-skills.mjs --dry-run  # report only, no writes

import { existsSync, readdirSync, statSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'skills');
const HOME = homedir();

const TARGETS = [
  join(HOME, 'Dev', 'ops', '.claude', 'skills'),   // Claude Code, ops project
  join(HOME, 'Dev', 'ops', '.agents', 'skills'),   // Codex / agents, ops project
  join(HOME, '.claude', 'skills'),                  // Claude Code, global
  join(HOME, '.codex', 'skills'),                   // Codex, global
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyArg = args.find((a) => a.startsWith('--only'));
const only = onlyArg
  ? (onlyArg.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf(onlyArg) + 1] || '')
      .split(',').map((s) => s.trim()).filter(Boolean)
  : null;

const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
const skillsIn = (dir) =>
  isDir(dir)
    ? readdirSync(dir).filter((n) => !n.startsWith('.') && isDir(join(dir, n)))
    : [];

const sourceSkills = skillsIn(SRC).filter((s) => !only || only.includes(s));
if (!sourceSkills.length) {
  console.error(only ? `No source skills match --only ${only.join(',')}` : 'No source skills found.');
  process.exit(1);
}

console.log(`Source: ${SRC}`);
console.log(`Skills: ${sourceSkills.join(', ')}${dryRun ? '  [DRY RUN]' : ''}\n`);

let updated = 0;
for (const target of TARGETS) {
  if (!isDir(target)) {
    console.log(`SKIP target (missing): ${target}\n`);
    continue;
  }
  const present = new Set(skillsIn(target));
  const pushed = [];
  const absent = [];
  for (const skill of sourceSkills) {
    if (!present.has(skill)) { absent.push(skill); continue; }
    const from = join(SRC, skill);
    const to = join(target, skill);
    if (!dryRun) {
      rmSync(to, { recursive: true, force: true });
      mkdirSync(dirname(to), { recursive: true });
      cpSync(from, to, { recursive: true });
    }
    pushed.push(skill);
    updated++;
  }
  console.log(`TARGET ${target}`);
  if (pushed.length) console.log(`  updated: ${pushed.join(', ')}`);
  if (absent.length) console.log(`  not present here, skipped: ${absent.join(', ')}`);
  console.log('');
}

console.log(`${dryRun ? 'Would update' : 'Updated'} ${updated} skill copies across ${TARGETS.length} targets.`);
