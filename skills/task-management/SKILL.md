---
name: task-management
description: Use when work involves task creation, updates, completion, cancellation, workload review, blockers, task extraction, priority recommendations, task routing, or time tracking across Hello Gafaro Tasks and Jol ClickUp.
---

# task-management

Use this skill when AI is asked to create tasks, update tasks, review workload, surface blockers, extract tasks from notes, meetings, or plans, recommend what someone should work on next, complete tasks, cancel tasks, or track time.

General Notion AI may find, summarize, organize, filter meeting actions, propose task wording, and execute exact user-owned daily hygiene when intent is clear.

Exact user-owned daily hygiene means the user clearly gives the task or meeting, the action, and the time. Examples include marking a named task done, adding exact time to a named task, or logging exact meeting time from a meeting page with a Project relation.

Route through Handoffs when the request needs new task creation, ambiguous updates, bulk changes, workload planning, blocker management, scheduling judgment, cross-person coordination, unclear time tracking, or missing required context.

Use `inbox-management` for the agent's active checkpoint. Use this skill for durable Tasks, Timesheets, workload, and task status.

## Purpose

Keep work clear, balanced, and moving while using the right task system consistently.

## References

Load only when needed.

- `references/tasks-schema.md` before creating or updating task properties.
- `references/task-queries.md` before querying, creating, or updating task records.
- `references/task-format.md` when creating or rewriting task content.
- `references/time-tracking.md` when completing tasks or logging time.
- `references/source-material.md` when extracting tasks from meetings, plans, threads, or Inbox items.
- `references/inbox-sync.md` when task-backed work affects Inbox.
- `references/completion.md` when marking tasks done.

## Hard rules

- Search before creating.
- Update an existing task when the work already exists.
- Do not create duplicate tasks.
- Stop if required schema, owner, project, or source context cannot be verified.
- Use live task properties for status, owner, assignee, due date, project, and priority.
- Do not infer project from title when a Project relation exists.
- Never change task status without confirming with the responsible person unless the source explicitly proves the state.
- Completion requires time tracking when work is substantive.
- No completed substantive task is allowed to have missing time.
- Meeting time inherits Project from the meeting page Project relation.
- If a meeting page has no Project relation, ask before creating tasks or time entries from it.

## Routing

Hello Gafaro internal and client work uses the Notion Tasks database and Timesheets data source.

Jol Ebrahim work uses ClickUp and Spanish by default.

Hello Gafaro internal task records are English by default.

Project language is for client-facing communication and deliverables, such as reports, emails, comments meant for clients, and ClickUp mirror tasks. Do not use project language to translate internal Notion task titles or task bodies unless the user explicitly asks.

## Allowed values

- Status: `Backlog`, `Not started`, `In progress`, `Under review`, `Blocked`, `Done`, `Canceled`.
- Priority: `High`, `Medium`, `Low`.
- Recurrence: `One-time`, `Daily`, `Weekly`, `Monthly`, `Quarterly`.

No one should have more than 3 active tasks at once.

Active tasks are `In progress`, `Under review`, and `Blocked`.

## Required properties

Every real task must have Owner, Assignee, Project, Priority, Due date, Status, and Recurrence.

Owner is the human supervisor who is accountable for the task.

Assignee is the person or agent executing the task.

Default Owner to the requester unless another supervisor is specified.

Default Assignee to the executing person or agent when known.

Do not leave Assignee, Project, Priority, or Due date unclear.

Assignee is a people property. Use the Team database Notion column to resolve agents and team members.

## Workflow

1. Identify request type.
2. Search existing tasks.
3. Surface similar tasks and ask whether to update when duplication is likely.
4. Create or update tasks with required properties.
5. Ask only the minimum question needed.
6. For large asks, split into now, next, and later.
7. For workload review, group blocked, active, due today or overdue, and upcoming work.
8. Before assigning, check active task count.
9. Flag anyone with 3 or more active tasks.
10. Recommend the single most impactful next action.

## Completion

Task work is complete when the live source is updated, required time tracking is handled, the final result comment is posted, Inbox is current, and any needed Handoff exists.
