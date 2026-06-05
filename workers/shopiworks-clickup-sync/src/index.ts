import { Worker } from "@notionhq/workers";
import { j } from "@notionhq/workers/schema-builder";
import {
  CLICKUP_MAP,
  buildCompletionComment,
  createTaskComment,
  createTimeEntry,
  deleteTask,
  deleteTimeEntry,
  getTask,
  listTimeEntries,
  normalizeSimpleInput,
  searchTasks,
  summarizeTask,
  syncCompletedTask,
  updateTaskDone,
  updateTaskFields
} from "./clickup.js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const worker = new Worker();
export default worker;

const syncInputSchema = j.object({
  clickupTaskTitle: j.string().describe("Natural neutral Spanish ClickUp task title, 80 characters or fewer. Translate and shorten the internal task title before calling this tool."),
  clickupTaskId: j.string().nullable().describe("Existing ClickUp task ID when the task already exists."),
  listId: j.string().nullable().describe("ClickUp list ID. Required only when creating a new task."),
  taskBodyParagraphs: j.array(j.string()).nullable().describe("For new tasks only. Natural neutral Spanish task body paragraphs, 1 to 3 short paragraphs. No Notion, source system, sync, or internal workflow mentions."),
  taskBodyBullets: j.array(j.string()).nullable().describe("For new tasks only. Optional natural neutral Spanish bullets for acceptance criteria or useful context."),
  completionCommentParagraphs: j.array(j.string()).nullable().describe("For existing tasks only. Natural neutral Spanish completion comment paragraphs, 1 to 3 short paragraphs about what changed and value."),
  completionCommentBullets: j.array(j.string()).nullable().describe("For existing tasks only. Optional natural neutral Spanish bullets for implementation notes, commits, PRs, or links."),
  minutes: j.number().describe("Confirmed minutes from Notion Timesheets. Required and must be greater than 0."),
  date: j.string().describe("ISO date or datetime for the time entry."),
  assigneeIds: j.array(j.number()).nullable().describe("Optional ClickUp assignee user IDs. New tasks default to Johan Gafaro when omitted."),
  priority: j.number().nullable().describe("ClickUp priority id.")
});

const createCompletedSchema = {
  clickupTaskTitle: j.string().describe("Natural neutral Spanish ClickUp task title, 80 characters or fewer. Translate and shorten the internal task title."),
  taskBodyParagraphs: j.array(j.string()).describe("Natural neutral Spanish task body paragraphs, 1 to 3 short paragraphs. Explain context, problem, and goal. Do not mention Notion, source systems, sync, or internal workflow."),
  taskBodyBullets: j.array(j.string()).describe("Optional natural neutral Spanish bullets for acceptance criteria or useful context. Empty array allowed."),
  minutes: j.number().describe("Confirmed minutes from Notion Timesheets. Required and must be greater than 0."),
  date: j.string().describe("ISO date or datetime for the time entry.")
};

const existingCompletedSchema = {
  clickupTaskTitle: j.string().describe("Natural neutral Spanish ClickUp task title, 80 characters or fewer. Used only for the time entry description, not to rename the existing task."),
  completionCommentParagraphs: j.array(j.string()).describe("Natural neutral Spanish completion comment paragraphs, 1 to 3 short paragraphs. Say what changed and the value. Do not repeat the task body."),
  completionCommentBullets: j.array(j.string()).describe("Optional natural neutral Spanish bullets for implementation notes, commits, PRs, or links. Empty array allowed."),
  minutes: j.number().describe("Confirmed minutes from Notion Timesheets. Required and must be greater than 0."),
  date: j.string().describe("ISO date or datetime for the time entry.")
};

const taskSummarySchema = j.object({
  id: j.string(),
  name: j.string(),
  url: j.string(),
  status: j.string(),
  statusType: j.string(),
  listId: j.string(),
  listName: j.string(),
  folderId: j.string(),
  folderName: j.string(),
  timeSpentMs: j.number()
});

const syncResultSchema = j.object({
  taskId: j.string(),
  taskUrl: j.string(),
  taskName: j.string(),
  status: j.string(),
  statusType: j.string(),
  listId: j.string(),
  listName: j.string(),
  folderId: j.string(),
  folderName: j.string(),
  timeLoggedMs: j.number(),
  createdTask: j.boolean(),
  markedDone: j.boolean(),
  loggedTime: j.boolean(),
  commented: j.boolean(),
  comment: j.string()
});

const timeEntrySummarySchema = j.object({
  id: j.string(),
  taskId: j.string(),
  description: j.string(),
  durationMs: j.number(),
  startMs: j.number()
});

worker.tool("getMap", {
  title: "Get ClickUp map",
  description: "Returns the read-only Jol Ebrahim ClickUp workspace map for Shopiworks sync.",
  schema: j.object({}),
  hints: { readOnlyHint: true },
  execute: () => CLICKUP_MAP
});

worker.tool("formatCompletionComment", {
  title: "Format completion comment",
  description: "Formats a structured Spanish completion comment without writing to ClickUp.",
  schema: j.object({
    completionCommentParagraphs: j.array(j.string()).describe("Natural neutral Spanish completion comment paragraphs, 1 to 3 short paragraphs."),
    completionCommentBullets: j.array(j.string()).describe("Optional natural neutral Spanish bullets. Empty array allowed.")
  }),
  outputSchema: j.object({ comment: j.string() }),
  hints: { readOnlyHint: true },
  execute: (input) => ({
    comment: buildCompletionComment(input)
  })
});

worker.tool("getTask", {
  title: "Get ClickUp task",
  description: "Fetches a ClickUp task by task ID.",
  schema: j.object({
    taskId: j.string().describe("ClickUp task ID, for example 869djg7ff.")
  }),
  outputSchema: taskSummarySchema,
  hints: { readOnlyHint: true },
  execute: ({ taskId }) => getTask(taskId)
});

worker.tool("searchTasks", {
  title: "Search ClickUp tasks",
  description: "Searches ClickUp tasks across the Jol Ebrahim workspace.",
  schema: j.object({
    query: j.string().describe("Search query."),
    includeClosed: j.boolean().nullable().describe("Include closed tasks. Defaults to true.")
  }),
  outputSchema: j.object({ tasks: j.array(taskSummarySchema) }),
  hints: { readOnlyHint: true },
  execute: ({ query, includeClosed }) => searchTasks(query, includeClosed ?? true)
});

worker.tool("completeTask", {
  title: "Complete ClickUp task",
  description: "Marks an existing ClickUp task done using the provided or known closed status.",
  schema: j.object({
    taskId: j.string(),
    status: j.string().nullable().describe("Closed status name. Defaults to cerrada.")
  }),
  outputSchema: taskSummarySchema,
  execute: async ({ taskId, status }) => summarizeTask(await updateTaskDone(taskId, status ?? "cerrada"))
});

worker.tool("updateTask", {
  title: "Update ClickUp task",
  description: "Repair tool for mistaken ClickUp task title, description, or status. Use only after verifying the target task.",
  schema: j.object({
    taskId: j.string(),
    name: j.string().describe("New task title, or an empty string to leave unchanged."),
    description: j.string().describe("New task description, or an empty string to leave unchanged."),
    status: j.string().describe("New status, or an empty string to leave unchanged.")
  }),
  outputSchema: taskSummarySchema,
  execute: async ({ taskId, name, description, status }) => summarizeTask(await updateTaskFields(taskId, { name, description, status }))
});

worker.tool("deleteTask", {
  title: "Delete ClickUp task",
  description: "Repair tool for deleting a mistakenly created ClickUp mirror task. Never use for legitimate client tasks.",
  schema: j.object({
    taskId: j.string().describe("ClickUp task ID to delete.")
  }),
  outputSchema: j.object({
    ok: j.boolean(),
    taskId: j.string()
  }),
  execute: ({ taskId }) => deleteTask(taskId)
});

worker.tool("logTime", {
  title: "Log ClickUp time",
  description: "Creates a manual ClickUp time entry. Requires confirmed minutes.",
  schema: j.object({
    taskId: j.string(),
    date: j.string(),
    minutes: j.number(),
    description: j.string()
  }),
  outputSchema: j.object({
    ok: j.boolean(),
    taskId: j.string(),
    timeLoggedMs: j.number()
  }),
  execute: async ({ taskId, date, minutes, description }) => ({
    ok: Boolean((await createTimeEntry(taskId, date, minutes, description)) as JsonValue),
    taskId,
    timeLoggedMs: Math.round(minutes * 60 * 1000)
  })
});

worker.tool("listTimeEntries", {
  title: "List ClickUp time entries",
  description: "Lists manual time entries for a ClickUp task before repairing time.",
  schema: j.object({
    taskId: j.string()
  }),
  outputSchema: j.object({
    timeEntries: j.array(timeEntrySummarySchema)
  }),
  hints: { readOnlyHint: true },
  execute: ({ taskId }) => listTimeEntries(taskId)
});

worker.tool("deleteTimeEntry", {
  title: "Delete ClickUp time entry",
  description: "Repair tool for deleting an incorrect time entry after listTimeEntries identifies the exact entry.",
  schema: j.object({
    timeEntryId: j.string()
  }),
  outputSchema: j.object({
    ok: j.boolean(),
    timeEntryId: j.string()
  }),
  execute: ({ timeEntryId }) => deleteTimeEntry(timeEntryId)
});

worker.tool("commentTask", {
  title: "Comment on ClickUp task",
  description: "Adds a Spanish value-focused completion comment to a ClickUp task.",
  schema: j.object({
    taskId: j.string(),
    body: j.string()
  }),
  outputSchema: j.object({
    ok: j.boolean(),
    taskId: j.string()
  }),
  execute: async ({ taskId, body }) => ({
    ok: Boolean((await createTaskComment(taskId, body)) as JsonValue),
    taskId
  })
});

worker.tool("syncCompletedTask", {
  title: "Sync completed task to ClickUp",
  description: "Creates or updates a completed Shopiworks ClickUp task, marks it done, logs time, and comments only when the task already existed.",
  schema: syncInputSchema,
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask(input)
});

worker.tool("syncExistingCompletedTask", {
  title: "Sync existing completed ClickUp task",
  description: "Marks an existing ClickUp task done, logs time, and leaves the Spanish completion comment.",
  schema: j.object({
    ...existingCompletedSchema,
    clickupTaskId: j.string().describe("Existing ClickUp task ID.")
  }),
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask({ ...normalizeSimpleInput(input), clickupTaskId: input.clickupTaskId, listId: null })
});

worker.tool("createCompletedTask", {
  title: "Create completed ClickUp task",
  description: "Creates a completed ClickUp task in a known list and logs time. It does not add a ClickUp comment because the description already carries the context.",
  schema: j.object({
    ...createCompletedSchema,
    listId: j.string().describe("ClickUp list ID where the new task should be created.")
  }),
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask({ ...normalizeSimpleInput(input), clickupTaskId: null, listId: input.listId })
});
