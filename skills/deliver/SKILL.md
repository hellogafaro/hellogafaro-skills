---
name: |-
  deliver
description: |-
  Use when handing over finished work or reconciling its completion records, proof, actual time, and stakeholder communication. Use summarize for a recap only and handoff when another owner must continue unfinished work.
notion_page_id: 3f2fc798-2e43-814c-acf0-f70c2773e6e7
---

# deliver

Get the verified result to its intended audience and reconcile the records that make it usable. This skill coordinates existing owners; it does not replace their procedures or grant new permissions.

## Establish the delivery state

Read the owning task, project context, accepted outcome, evidence, and current artifact or release state. Resolve recipients, channels, language, and approval boundaries from those sources. Ask only for missing facts that change delivery.

Use `verify` when the outcome has not been proven. Keep implementation ready, PR ready, merged, deployed, and verified in production distinct. Close only the outcome the task actually requested. Failed or unverified required checks remain blockers, not a completed delivery.

## Reconcile the record

Use `tasks-operations` to find or update the canonical task, link the relevant PR or artifact, retain useful evidence, and write a concise delivered-result comment. Read existing records before retrying so the same result, attachment, or time entry is not posted twice.

Time belongs at closure, not on every summary or handoff. Use only actual duration and date under `tasks-operations`. Ask when missing; do not infer human time from agent runtime or invent an estimate. Check for an existing matching entry before creating another. Do not mark a task Done while its required time remains unresolved, and do not reopen completed work merely to repair missing time.

## Communicate

Prepare the shortest audience-specific update with the result, useful proof, and any action needed. Internal reviewers need readiness and risks; customers need what is available and how to use it. Do not announce a feature as live from a PR alone.

Use the channel's existing procedure and authorization. For email, follow `email-operations`; for a project-specific provider, use its applicable skill. A request to close internal work is not permission to send a customer message. Show a draft when sending is not authorized, and label it unsent. Verify the resulting message or comment after an authorized send.

## Finish

Report what was delivered and what, if anything, still needs the user. Mention actual recorded time only when useful at closure or explicitly requested. If delivery is incomplete, identify the outstanding proof, time, record, or communication instead of claiming everything is done. Use `summarize` for the final recap and `handoff` if another owner must continue.
