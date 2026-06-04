import { Worker } from "@notionhq/workers";
import { j } from "@notionhq/workers/schema-builder";
import {
  CLICKUP_MAP,
  buildCompletionComment,
  createTaskComment,
  createTimeEntry,
  getTask,
  normalizeSimpleInput,
  searchTasks,
  summarizeTask,
  syncCompletedTask,
  updateTaskDone
} from "./clickup.js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const worker = new Worker();
export default worker;

const syncInputSchema = j.object({
  notionTaskTitle: j.string().describe("The Notion task title."),
  notionTaskUrl: j.string().nullable().describe("The Notion task URL."),
  clickupTaskId: j.string().nullable().describe("Existing ClickUp task ID when the task already exists."),
  listId: j.string().nullable().describe("ClickUp list ID. Required only when creating a new task."),
  problem: j.string().describe("Spanish problem summary."),
  solution: j.string().describe("Spanish solution summary."),
  implementation: j.string().nullable().describe("Spanish implementation detail."),
  references: j.array(j.string()).nullable().describe("Commit links, PR links, source links, or useful references."),
  minutes: j.number().describe("Confirmed minutes from Notion Timesheets. Required and must be greater than 0."),
  date: j.string().describe("ISO date or datetime for the time entry."),
  assigneeIds: j.array(j.number()).nullable().describe("ClickUp assignee user IDs."),
  priority: j.number().nullable().describe("ClickUp priority id.")
});

const baseCompletedSchema = {
  notionTaskTitle: j.string().describe("The Notion task title."),
  notionTaskUrl: j.string().nullable().describe("The Notion task URL."),
  problem: j.string().describe("Spanish problem summary."),
  solution: j.string().describe("Spanish solution summary."),
  implementation: j.string().nullable().describe("Spanish implementation detail."),
  references: j.array(j.string()).nullable().describe("Commit links, PR links, source links, or useful references."),
  minutes: j.number().describe("Confirmed minutes from Notion Timesheets. Required and must be greater than 0."),
  date: j.string().describe("ISO date or datetime for the time entry."),
  assigneeIds: j.array(j.number()).nullable().describe("ClickUp assignee user IDs."),
  priority: j.number().nullable().describe("ClickUp priority id.")
};

const simpleCompletedSchema = {
  notionTaskTitle: j.string().describe("The Notion task title."),
  notionTaskUrl: j.string().describe("The Notion task URL, or an empty string when unavailable."),
  problem: j.string().describe("Spanish problem summary."),
  solution: j.string().describe("Spanish solution summary."),
  implementation: j.string().describe("Spanish implementation detail, or an empty string when not useful."),
  referencesText: j.string().describe("Commit links, PR links, source links, or useful references separated by new lines. Empty string allowed."),
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

worker.tool("getMap", {
  title: "Get ClickUp map",
  description: "Returns the read-only Jol Ebrahim ClickUp workspace map for Shopiworks sync.",
  schema: j.object({}),
  hints: { readOnlyHint: true },
  execute: () => CLICKUP_MAP
});

worker.tool("formatCompletionComment", {
  title: "Format completion comment",
  description: "Formats the Spanish problem, solution, implementation, and reference comment without writing to ClickUp.",
  schema: j.object({
    problem: j.string(),
    solution: j.string(),
    implementation: j.string().describe("Spanish implementation detail, or an empty string when not useful."),
    referencesText: j.string().describe("References separated by new lines, or an empty string.")
  }),
  outputSchema: j.object({ comment: j.string() }),
  hints: { readOnlyHint: true },
  execute: (input) => ({
    comment: buildCompletionComment({
      ...input,
      implementation: input.implementation || null,
      references: input.referencesText
        .split(/\n|,/)
        .map((reference) => reference.trim())
        .filter(Boolean)
    })
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
  description: "Creates or updates a completed Shopiworks ClickUp task, marks it done, logs time, and leaves the Spanish completion comment.",
  schema: syncInputSchema,
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask(input)
});

worker.tool("syncExistingCompletedTask", {
  title: "Sync existing completed ClickUp task",
  description: "Marks an existing ClickUp task done, logs time, and leaves the Spanish completion comment.",
  schema: j.object({
    ...simpleCompletedSchema,
    clickupTaskId: j.string().describe("Existing ClickUp task ID.")
  }),
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask({ ...normalizeSimpleInput(input), clickupTaskId: input.clickupTaskId, listId: null })
});

worker.tool("createCompletedTask", {
  title: "Create completed ClickUp task",
  description: "Creates a completed ClickUp task in a known list, logs time, and leaves the Spanish completion comment.",
  schema: j.object({
    ...simpleCompletedSchema,
    listId: j.string().describe("ClickUp list ID where the new task should be created.")
  }),
  outputSchema: syncResultSchema,
  execute: (input) => syncCompletedTask({ ...normalizeSimpleInput(input), clickupTaskId: null, listId: input.listId })
});
