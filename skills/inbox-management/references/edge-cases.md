# Edge cases

Notify by default. Nothing silent.

- Empty Project relation: surface in Notes with task ID, title, and link.
- Multiple Project relations: surface data error in Notes.
- Project page archived or trashed: surface in Notes.
- Tasks DB query returns 404: resolve current data source ID before reporting task state.
- Same task in Notion and ClickUp: keep where time tracking lives.
- Source failure: surface source, operation, and error. Continue with available sources.
- Self-mention: surface like any other mention.
- ClickUp status varies: filter by status type.
- ClickUp pagination: page until exhausted.
- Item written manually by User: preserve unless source confirms closed.
- High priority task with no due date: flag in push.
- ClickUp Complete with no time tracked: surface log time prompt.
- Project paused or archived: remove tied items unless closure action remains.
