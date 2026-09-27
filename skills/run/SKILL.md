---
name: |-
  run
description: |-
  Use when the user says "work on this" or "run this" with a task link, or asks to start, resume, or check a run for a task. Starts the one-full-run workflow for the task from its own project.
notion_page_id: 3e8fc798-2e43-81cc-8080-fb9b143d8a28
---

# run

A run takes one task from brief to an approved, recorded result: a fresh brief, the owning agent's work, an independent review, the human's approval of the exact update, and the closing agent's write-back to the task system. The run is the `one-full-run` BB workflow. It lives in the shared workflow location, so any project can start it.

## Start a run

1. Read the task with the task system's read tool. Take the repository or workspace it names. Do not change the task.
2. Find the BB project for that repository with `bb project list`. If the task names no repository, use the personal project. If more than one project matches, ask which one.
3. If the current thread is already in that project and holds nothing else, start here. Otherwise spawn a fresh thread there and let it start the run:

```javascript
bb thread spawn --project <project-id> --prompt-file <brief>
```

The brief is one paragraph: the task link, the instruction to run the command below and reply with the run id, and the instruction to leave decision cards to the person.

1. Start the workflow from the origin thread:

```javascript
bb workflows run --name one-full-run --args '{"task":"<task url>"}' --json
```

1. Reply with the run id and the origin thread. Copy the workflow's preview directive once, on its own line, when the tool returns one.

## Rules

- One task per origin thread. The thread is the run's home: its cards, its panel, its result.
- Never answer a decision card on the person's behalf, and never start the same task twice; `bb workflows list` shows runs in the current project.
- The workers run as the agents the script names. Do not spawn your own children for a task that has a run.
- If the task is not in the task system yet, the closing agent creates it first; hand the request to that agent with the source, then start the run on the task it returns.

## Resume or inspect

- `bb workflows status <run-id>` and `bb workflows history <run-id>` from a thread in the run's project.
- Resume after a stop, restart, or script edit with the same command plus `--resume <run-id>`. Finished steps replay; the first changed step and everything after it runs live.
