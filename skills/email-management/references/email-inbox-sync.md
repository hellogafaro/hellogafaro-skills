Load whenever an email action affects `INBOX.md`.
Email and Inbox are one system. Every opened email loop must end closed, waiting, assigned as to do, flagged as alert, or handed off.
Every email that needs a reply belongs in `INBOX.md` To do until it is answered, even before a draft exists. Reply needed means the user or active agent owns the next action, which is To do, not Waiting. Waiting is only for loops where someone else owns the next response.
Create one To do per reply-needed thread. Do not merge separate threads into one item, even from the same sender. The To do set must mirror every open reply-needed thread one to one.
## Action table
<table header-row="true">
<tr>
<td>Email action</td>
<td>Inbox action</td>
</tr>
<tr>
<td>Reply needed, with or without a draft</td>
<td>Add or update To do</td>
</tr>
<tr>
<td>Reply sent and response expected</td>
<td>Move to Waiting</td>
</tr>
<tr>
<td>Reply sent and loop closed</td>
<td>Remove from Inbox and archive source</td>
</tr>
<tr>
<td>Snoozed</td>
<td>Add dated To do or Waiting</td>
</tr>
<tr>
<td>Waiting item gets real reply</td>
<td>Promote to To do, never duplicate</td>
</tr>
<tr>
<td>Waiting older than 24 hours</td>
<td>Suggest gentle nudge</td>
</tr>
<tr>
<td>Waiting older than 3 to 5 days</td>
<td>Suggest stronger nudge or escalation</td>
</tr>
</table>
## Item format
Use the section rules from `inbox-management`. New durable items start with an ISO 8601 timestamp.
Keep item text concise. Link the natural action text to the source. Do not write Source or Sources labels.
Sub-bullets only for essential detail. No key-value dumps. No parenthetical clutter.
