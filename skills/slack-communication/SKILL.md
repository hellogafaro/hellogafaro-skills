---
name: slack-communication
description: Use when work involves Slack routing, drafting, posting, replying, privacy decisions, urgency, failure updates, DM versus channel choices, or durable follow-up from Slack communication.
---

# slack-communication

Use this skill when an agent needs to decide whether to use Slack, draft a Slack message, post to Slack, reply in Slack, or route a Slack-triggered request.

Slack is timely communication. Notion remains the durable work record.

## purpose

Use Slack only when it is the right channel and keep private context private.

## routing

- Project updates go in the project channel when the update belongs to the project team.
- Cross-project risk goes in the agreed risk channel when the risk affects more than one project.
- Private blockers, sensitive context, and user decisions go in DM.
- Reply where the request was triggered unless routing, privacy, or urgency says otherwise.

## rules

- Never post private context in shared channels.
- Never post secrets, credentials, account ids, tokens, financial private data, or personal context.
- Never DM to report doing nothing.
- Never use Slack as durable source of truth for assigned work.
- Create or update the relevant Inbox item, Handoff, task, or page when state must persist.
- Keep Slack messages concise, natural, and useful.
- Use emoji only when the context is informal and Soul allows it.

## failure handling

For systemic failure, report once in the agreed error channel with agent, trigger, action, error, and affected source.

For the same systemic failure three runs in a row, DM the user once and pause scheduled runs until acknowledged.

## completion

Slack work is complete when the message is sent or drafted, private context stayed private, and durable follow-up is stored outside Slack when needed.
