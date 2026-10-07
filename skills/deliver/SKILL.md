---
name: |-
  deliver
description: |-
  Reconciles finished work, proof, task records, actual time, and approved stakeholder communication. Use for completion, not a recap alone or transfer of unfinished work.
notion_page_id: 3f2fc798-2e43-814c-acf0-f70c2773e6e7
---

# deliver

Own closure when requested. Helper calls to `verify`, `visualize`, or `tasks-operations` return here; do not recursively re-enter delivery.

Get verified work to its audience and reconcile the records that make it usable. Coordinate existing procedures without expanding authority.

1. Read the owning task, project context, accepted outcome, evidence, and current artifact or release. Resolve audience, channel, language, and permissions. Ask only for missing facts that change delivery.
2. Use `verify` for required outcomes lacking current proof; reuse valid evidence for the unchanged artifact. Distinguish implementation ready, PR ready, merged, deployed, and production-verified. Close only what the task requested; failed or unverified requirements remain blockers.
3. Use `tasks-operations` to link proof, reconcile state, and draft a useful result comment. Read existing records before retrying to prevent duplicate comments, assets, or time entries. Package the retained baseline and final evidence through `visualize`: screenshots or clips for simple proof, a shared-kit canvas when the evidence needs explanation. Use nonvisual proof when appropriate. Attach or link the actual artifacts in the authorized task or PR destination, verify access and privacy, and obtain approval before posting human-facing completion communication. Do not discard evidence during cleanup or present a missing baseline as a before/after comparison.
4. Reconcile actual duration and date under `tasks-operations`. Ask when missing; never infer human time from runtime or an estimate. Reuse matching entries. Required unresolved time prevents Done; repair missing time on completed work without reopening it.
5. Before any human-facing post or send, follow [communication approval](references/communication-approval.md) and the channel's stricter rules. Use `email-operations` for email or the matching domain skill for another channel. Show the exact draft and destination, obtain approval, then verify delivery. Internal comments also require approval. Continue authorized internal work while drafts wait.
6. After meaningful corrections, recurring failures, or costly rework, use `verify` and its correction-routing reference to identify the responsible layer and any durable improvement. Skip routine retrospectives when nothing useful was learned.
7. When recurring work has a stable trigger and repeatable outcome, check for an existing automation and propose the smallest useful addition or improvement. State its trigger, scope, expected benefit, failure handling, and approval gates. Prefer a script or native capability when scheduling adds no value. Do not create or enable an automation without approval, and never use automation to bypass human-communication or other action approvals.

Internal reviewers need readiness and risks; customers need what is available and how to use it. Never announce a PR as live. Report delivered state and any outstanding proof, time, record, or communication. Mention actual time only when useful at closure or requested. Transfer unfinished work with enough evidence to continue, not a false completion claim.
