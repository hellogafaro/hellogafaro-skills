Load whenever an email action affects the user's Inbox.
Email and Inbox are one system. Every opened email loop must end closed, waiting, assigned as to do, flagged as alert, or handed off.
## Action table
<table header-row="true">
<tr>
<td>Email action</td>
<td>Inbox action</td>
</tr>
<tr>
<td>Reply needed and draft ready</td>
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
Use the Inbox section rules from Collaboration. New durable items start with a Notion date mention with time, usually @now in the Notion UI.
Keep item text concise. Link the natural action text to the source. Do not write Source or Sources labels.
Sub-bullets only for essential detail. No key-value dumps. No parenthetical clutter.