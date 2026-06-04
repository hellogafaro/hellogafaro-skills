import { Worker } from "@notionhq/workers";
import { j } from "@notionhq/workers/schema-builder";
import {
  CLICKUP_MAP,
  buildCompletionComment,
  createTaskComment,
  createTimeEntry,
  getTask,
  searchTasks,
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

worker.tool("getMap", {
  title: "Get ClickUp map",
  description: "Returns the read-only Jol Ebrahim ClickUp workspace map for Shopiworks sync.",
  schema: j.object({}),
  execute: () => CLICKUP_MAP
});

worker.tool("formatCompletionComment", {
  title: "Format completion comment",
  description: "Formats the Spanish problem, solution, implementation, and reference comment without writing to ClickUp.",
  schema: j.object({
    problem: j.string(),
    solution: j.string(),
    implementation: j.string().nullable(),
    references: j.array(j.string()).nullable()
  }),
  execute: (input) => buildCompletionComment(input)
});

worker.tool("getTask", {
  title: "Get ClickUp task",
  description: "Fetches a ClickUp task by task ID.",
  schema: j.object({
    taskId: j.string().describe("ClickUp task ID, for example 869djg7ff.")
  }),
  execute: ({ taskId }) => getTask(taskId)
});

worker.tool("searchTasks", {
  title: "Search ClickUp tasks",
  description: "Searches ClickUp tasks across the Jol Ebrahim workspace.",
  schema: j.object({
    query: j.string().describe("Search query."),
    includeClosed: j.boolean().nullable().describe("Include closed tasks. Defaults to true.")
  }),
  execute: ({ query, includeClosed }) => searchTasks(query, includeClosed ?? true)
});

worker.tool("completeTask", {
  title: "Complete ClickUp task",
  description: "Marks an existing ClickUp task done using the provided or known closed status.",
  schema: j.object({
    taskId: j.string(),
    status: j.string().nullable().describe("Closed status name. Defaults to cerrada.")
  }),
  execute: ({ taskId, status }) => updateTaskDone(taskId, status ?? "cerrada")
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
  execute: async ({ taskId, date, minutes, description }) => ({
    result: (await createTimeEntry(taskId, date, minutes, description)) as JsonValue
  })
});

worker.tool("commentTask", {
  title: "Comment on ClickUp task",
  description: "Adds a Spanish value-focused completion comment to a ClickUp task.",
  schema: j.object({
    taskId: j.string(),
    body: j.string()
  }),
  execute: async ({ taskId, body }) => ({
    result: (await createTaskComment(taskId, body)) as JsonValue
  })
});

worker.tool("syncCompletedTask", {
  title: "Sync completed task to ClickUp",
  description: "Creates or updates a completed Shopiworks ClickUp task, marks it done, logs time, and leaves the Spanish completion comment.",
  schema: syncInputSchema,
  execute: (input) => syncCompletedTask(input)
});
