# Edge cases

- Missing dated Inbox: create it with Brief, To do, and Notes.
- Duplicate Inbox pages for the same user and date: stop and report both. Never merge by guesswork.
- Missing Memory: create the host's empty standard Memory structure.
- Duplicate Memory records for one user: stop and report them.
- Source failure: preserve the existing item, name the unavailable source, and continue with verified sources.
- Canonical write failure: do not change the Inbox projection as if the write succeeded.
- Stale Memory: live state controls current facts. Repair Memory only when the durable correction is clear; otherwise ask.
- Manually written item: preserve it unless the user removes it or a linked source proves closure.
- Same item from multiple sources: deduplicate by canonical Task mention, email thread, calendar event, or equivalent normalized local text. Never merge separate threads or events merely because their titles match.
- Three consecutive carryovers of the same local task: surface it in Brief and ask whether to do, schedule, promote, or remove it. Never choose automatically.
- More than three yellow items: preserve them, report the overflow, and recommend the strongest three.
- Past Inbox pages: treat them as journal history. Do not reconcile them against today's source state unless the user asks for a correction.
