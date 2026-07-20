# Edge cases

Notify by default. Nothing silent.

- Empty Project relation: surface it in Notes with task ID, title, and link.
- Multiple Project relations: surface the data error in Notes.
- Project page archived or trashed: surface it in Notes.
- Task query fails: rediscover the live data source and schema before reporting task state.
- Same task in Notion and ClickUp: keep it where time tracking lives.
- Source failure: surface source, operation, and error. Continue with available sources.
- Self-mention: surface it like any other mention.
- ClickUp status varies: filter by status type.
- ClickUp pagination: page until exhausted.
- Item written manually by the user: preserve it unless its source confirms closure.
- High-priority task with no due date: flag it in Notes.
- ClickUp Complete with no time tracked: surface a log-time prompt.
- Project paused or archived: remove tied items unless a closure action remains.
