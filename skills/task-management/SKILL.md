---
name: task-management
description: Use when work involves task creation, updates, completion, cancellation, workload review, blockers, task extraction, priority recommendations, routing, or time tracking across Hello Gafaro Tasks and Jol ClickUp.
---

# task-management

Use this skill when AI is asked to create tasks, update tasks, review workload, surface blockers, extract tasks from notes or plans, recommend what someone should work on next, complete tasks, cancel tasks, or track time.

General Notion AI may find, summarize, organize, propose, and draft task wording. Task system mutations route through Handoffs to the task-management agent.

## purpose

Keep work clear, balanced, and moving while using the right task system consistently.

## hard rules

- Search before creating.
- Update an existing task when the work already exists.
- Do not create duplicate tasks.
- Stop if required schema, owner, project, or source context cannot be verified.
- Use live task properties for status, owner, due date, project, and priority.
- Do not infer project from title when a Project relation exists.
- Never change task status without confirming with the responsible person unless the source explicitly proves the state.
- Completion requires time tracking when work is substantive.
- No completed substantive task is allowed to have missing time.

## routing

Hello Gafaro internal and client work uses the Notion Tasks database.

Jol Ebrahim work uses ClickUp and Spanish by default.

Hello Gafaro and Notion task work is English by default unless project language says otherwise.

Match project language when known.

## allowed values

- Status: `Backlog`, `Not started`, `In progress`, `Under review`, `Blocked`, `Completed`, `Canceled`.
- Priority: `High`, `Medium`, `Low`.
- Recurrence: `One-time`, `Daily`, `Weekly`, `Monthly`, `Quarterly`.

No one should have more than 3 active tasks at once.

Active tasks are `In progress`, `Under review`, and `Blocked`.

## required properties

Every real task must have Owner, Project, Priority, Due date, Status, and Recurrence.

Default owner to the requester unless someone else is specified.

Default status to `Not started`.

Default recurrence to `One-time`.

Do not leave Project, Priority, or Due date unclear.

Tasks owner property is `Owner`, not `Assignee`.

Read `references/tasks-schema.md` before mutating task or time-tracking records.

## task format

- Create one task per clear action or outcome.
- Start the title with a verb.
- Keep the title under 10 words.
- Avoid client or project names in the title unless needed for clarity.
- Do not use colons in titles.
- Include month and year for time-bound campaigns when needed.
- First description sentence states what will be delivered and why it matters.
- Add 2 to 4 acceptance criteria bullets.
- Start each acceptance criterion with a verb.
- Keep due dates and other property data out of the description.

## time tracking

Every completed substantive task needs time tracked.

- Log only against real tasks.
- Project relation is always required on time entries.
- Task relation is required when the work is task-related.
- Task relation is optional for non-task work such as meetings.
- When a task relation exists, the time entry title must be the task page reference.
- When no task relation exists, the title should be one clear sentence about what was done.
- Inbox items, reminders, alerts, and meeting prep placeholders are not tasks unless they link to a task page.
- If the item was only a reminder, remove or update it and do not create a time entry.
- Use 15-minute increments, rounded up.
- Task management counts.
- Context switching counts.
- If duration is unknown, ask before completing.

## working from source material

For meeting notes or action items, turn each action item into one task, use stated owner and due date when available, and ask if owner or project is unclear.

For plans or strategies, break into concrete tasks and split into now, next, and later when scope is larger than one week.

For threads or conversations, extract only actionable items, ignore chatter, and confirm before creating if intent is not explicit.

For Inbox items, read the source item for ask and context, apply validation, and keep task-backed Inbox To do items linked until the task is completed or canceled.

## workflow

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

## Inbox sync

Task-backed work stays in Inbox To do until the task is completed or canceled.

Remove closed, canceled, archived, unassigned, or no-longer-actionable Inbox items.

Rewrite stale Inbox items with the current next action.

Do not duplicate source URLs.

## completion

Task work is complete when the live source is updated, required time tracking is handled, Inbox is current, and any needed Handoff exists.
