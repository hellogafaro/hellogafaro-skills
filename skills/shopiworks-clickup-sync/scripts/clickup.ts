#!/usr/bin/env bun

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Input = Record<string, unknown>;

const API_BASE = "https://api.clickup.com/api/v2";
const TITLE_MAX = 80;
const COMPOSIO = process.env.COMPOSIO_BIN?.trim()
  || (process.env.HOME ? `${process.env.HOME}/.composio/composio` : "composio");

export const TOOL = {
  getTask: "CLICKUP_GET_TASK",
  getTasks: "CLICKUP_GET_TASKS",
  createTask: "CLICKUP_CREATE_TASK",
  updateTask: "CLICKUP_UPDATE_TASK",
  getComments: "CLICKUP_GET_TASK_COMMENTS",
  createTime: "CLICKUP_CREATE_A_TIME_ENTRY",
  listTime: "CLICKUP_GET_TIME_ENTRIES_IN_DATE_RANGE",
  getTime: "CLICKUP_GET_TIME_ENTRY",
  deleteTime: "CLICKUP_DELETE_TIME_ENTRY",
  deleteTask: "CLICKUP_DELETE_TASK",
  getWorkspaces: "CLICKUP_GET_AUTHORIZED_TEAMS_WORKSPACES",
  getSpaces: "CLICKUP_GET_SPACES",
  getFolders: "CLICKUP_GET_FOLDERS",
  getFolderlessLists: "CLICKUP_GET_FOLDERLESS_LISTS",
  getList: "CLICKUP_GET_LIST"
} as const;

const COMMANDS = [
  "get-task", "search-tasks", "get-comments", "list-time", "get-workspaces",
  "get-spaces", "get-folders", "get-folderless-lists", "get-list", "create-task",
  "update-task", "complete-task", "add-comment", "log-time", "delete-task", "delete-time"
] as const;

function fail(message: string): never {
  throw new Error(message);
}

function text(input: Input, key: string): string {
  const value = input[key];
  if (typeof value !== "string" || !value.trim()) fail(`${key} is required.`);
  return value.trim();
}

function optionalText(input: Input, key: string): string | undefined {
  const value = input[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") fail(`${key} must be a string.`);
  return value.trim();
}

function boolean(input: Input, key: string, fallback = false): boolean {
  const value = input[key];
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") fail(`${key} must be a boolean.`);
  return value;
}

function positiveInt(input: Input, key: string): number {
  const value = input[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) fail(`${key} must be a positive integer.`);
  return value;
}

function integerArray(input: Input, key: string): number[] | undefined {
  const value = input[key];
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((item) => !Number.isInteger(item) || Number(item) <= 0)) {
    fail(`${key} must be an array of positive integers.`);
  }
  return value as number[];
}

function epochMs(value: string, key: string): number {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00.000Z` : value;
  const parsed = Date.parse(normalized);
  if (!Number.isFinite(parsed)) fail(`${key} must be an ISO date or datetime.`);
  return parsed;
}

function inclusiveEndEpochMs(value: string, key: string): number {
  const parsed = epochMs(value, key);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parsed + 86_400_000 : parsed;
}

function priority(input: Input): number | undefined {
  if (!own(input, "priority")) return undefined;
  const value = positiveInt(input, "priority");
  if (value > 4) fail("priority must be 1, 2, 3, or 4.");
  return value;
}

function assertSpanishTitle(value: string): void {
  if (value.length > TITLE_MAX) fail(`name must be ${TITLE_MAX} characters or fewer.`);
  const english = [
    /\b(add|adjust|build|check|create|fix|implement|improve|launch|optimize|remove|review|sync|test|update)\b/i,
    /\b(page|product|theme|variant|description|spacing|border|active|gift card|gift registry)\b/i
  ];
  if (english.some((pattern) => pattern.test(value))) fail("name must be natural neutral Spanish, not a raw English title.");
}

function assertClientContent(value: string, key: string): void {
  if (!value.trim()) fail(`${key} is required.`);
  if (/\b(notion|sync(?:hroniz\w+)?|source system|sistema de origen|flujo interno)\b/i.test(value)) {
    fail(`${key} must not mention Notion, synchronization, source systems, or internal workflows.`);
  }
  if (/\b\d+\s*(?:min(?:ute|uto)?s?|hours?|horas?)\b/i.test(value)) fail(`${key} must not mention tracked time.`);
}

function own(object: Input, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function clean(object: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

function argsForExecute(slug: string, data: Input, dryRun = false): string[] {
  const args = ["execute", slug];
  if (process.env.COMPOSIO_ACCOUNT?.trim()) args.push("--account", process.env.COMPOSIO_ACCOUNT.trim());
  if (dryRun) args.push("--dry-run", "--skip-connection-check");
  args.push("-d", JSON.stringify(data));
  return args;
}

function argsForProxy(url: string, method: string, data?: Input): string[] {
  const args = ["proxy", url, "--toolkit", "clickup", "-X", method];
  if (data) args.push("-H", "content-type: application/json", "-d", JSON.stringify(data));
  return args;
}

async function spawnJson(args: string[]): Promise<Json> {
  const process = Bun.spawn([COMPOSIO, ...args], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(), new Response(process.stderr).text(), process.exited
  ]);
  if (exitCode !== 0) fail(`Composio failed (${exitCode}): ${stderr.trim() || stdout.trim()}`);
  const output = stdout.trim();
  if (!output) return {};
  try {
    const parsed = JSON.parse(output) as Json;
    if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
      const object = parsed as Record<string, Json>;
      if (object.successful === false) {
        const detail = typeof object.error === "string" ? object.error : JSON.stringify(object.data ?? object);
        fail(`Composio action failed: ${detail}`);
      }
    }
    return parsed;
  } catch {
    fail(`Composio returned non-JSON output: ${output}`);
  }
}

async function execute(slug: string, data: Input): Promise<Json> {
  return spawnJson(argsForExecute(slug, data));
}

async function proxy(url: string, method: string, data?: Input): Promise<Json> {
  return spawnJson(argsForProxy(url, method, data));
}

export function unwrap(value: Json): Json {
  let current = value;
  for (let depth = 0; depth < 4; depth++) {
    if (!current || Array.isArray(current) || typeof current !== "object") break;
    const object = current as Record<string, Json>;
    if (object.successful !== undefined && object.data !== undefined) {
      current = object.data;
      continue;
    }
    if (object.response && typeof object.response === "object" && !Array.isArray(object.response)) {
      current = object.response;
      continue;
    }
    if (Object.keys(object).length === 1 && object.data !== undefined) {
      current = object.data;
      continue;
    }
    break;
  }
  return current;
}

function tasksFrom(value: Json): Record<string, Json>[] {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") return [];
  const tasks = (data as Record<string, Json>).tasks;
  return Array.isArray(tasks) ? tasks.filter((task): task is Record<string, Json> => Boolean(task) && !Array.isArray(task) && typeof task === "object") : [];
}

function taskIdFrom(value: Json): string {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") fail("ClickUp response did not contain a task object.");
  const id = (data as Record<string, Json>).id;
  if (typeof id !== "string" || !id) fail("ClickUp response did not contain a task id.");
  return id;
}

function entityIdFrom(value: Json, label: string): string {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") fail(`${label} response did not contain an object.`);
  const id = (data as Record<string, Json>).id;
  if ((typeof id !== "string" && typeof id !== "number") || String(id).length === 0) fail(`${label} response did not contain an id.`);
  return String(id);
}

async function getTask(taskId: string): Promise<Json> {
  return execute(TOOL.getTask, { task_id: taskId, include_subtasks: false, include_markdown_description: true });
}

async function getList(listId: string): Promise<Json> {
  return execute(TOOL.getList, { list_id: listId });
}

function listIdFromTask(value: Json): string {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") fail("Task response did not contain list context.");
  const list = (data as Record<string, Json>).list;
  if (!list || Array.isArray(list) || typeof list !== "object") fail("Task response did not contain a list.");
  const id = (list as Record<string, Json>).id;
  if (typeof id !== "string" || !id) fail("Task response did not contain a list id.");
  return id;
}

function closedStatusFromList(value: Json): string {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") fail("List response did not contain statuses.");
  const statuses = (data as Record<string, Json>).statuses;
  if (!Array.isArray(statuses)) fail("List response did not contain statuses.");
  for (const status of statuses) {
    if (status && !Array.isArray(status) && typeof status === "object") {
      const record = status as Record<string, Json>;
      if (record.type === "closed" && typeof record.status === "string") return record.status;
    }
  }
  fail("The target list has no status whose type is closed.");
}

function assertStatusInList(value: Json, requested: string): void {
  const data = unwrap(value);
  if (!data || Array.isArray(data) || typeof data !== "object") fail("List response did not contain statuses.");
  const statuses = (data as Record<string, Json>).statuses;
  if (!Array.isArray(statuses)) fail("List response did not contain statuses.");
  const allowed = statuses.flatMap((status) => {
    if (!status || Array.isArray(status) || typeof status !== "object") return [];
    const name = (status as Record<string, Json>).status;
    return typeof name === "string" ? [name] : [];
  });
  if (!allowed.includes(requested)) fail(`status must exactly match one of the target list statuses: ${allowed.join(", ")}.`);
}

export async function run(command: string, input: Input, dryRun = false): Promise<Json> {
  let args: string[] | undefined;
  let result: Json;

  if (command === "get-task") args = argsForExecute(TOOL.getTask, { task_id: text(input, "taskId"), include_subtasks: false, include_markdown_description: true }, dryRun);
  else if (command === "get-comments") args = argsForExecute(TOOL.getComments, { task_id: text(input, "taskId") }, dryRun);
  else if (command === "get-workspaces") args = argsForExecute(TOOL.getWorkspaces, {}, dryRun);
  else if (command === "get-spaces") args = argsForExecute(TOOL.getSpaces, { team_id: text(input, "workspaceId"), archived: false }, dryRun);
  else if (command === "get-folders") args = argsForExecute(TOOL.getFolders, { space_id: text(input, "spaceId"), archived: false }, dryRun);
  else if (command === "get-folderless-lists") args = argsForExecute(TOOL.getFolderlessLists, { space_id: text(input, "spaceId"), archived: false }, dryRun);
  else if (command === "get-list") args = argsForExecute(TOOL.getList, { list_id: text(input, "listId") }, dryRun);
  else if (command === "list-time") {
    const workspaceId = text(input, "workspaceId");
    const params = new URLSearchParams();
    const taskId = optionalText(input, "taskId");
    const startDate = optionalText(input, "startDate");
    const endDate = optionalText(input, "endDate");
    if (taskId) params.set("task_id", taskId);
    if (!taskId && startDate) params.set("start_date", String(epochMs(startDate, "startDate")));
    if (!taskId && endDate) params.set("end_date", String(inclusiveEndEpochMs(endDate, "endDate")));
    const url = `${API_BASE}/team/${encodeURIComponent(workspaceId)}/time_entries?${params.toString()}`;
    const proxyArgs = argsForProxy(url, "GET");
    if (dryRun) return { command, dryRun: true, invocation: [COMPOSIO, ...proxyArgs], note: taskId ? "Date bounds are applied locally because ClickUp returned empty task-filtered results when server-side date bounds were combined." : undefined };
    const response = await proxy(url, "GET");
    if (!taskId || (!startDate && !endDate)) return { command, data: response };
    const entries = unwrap(response);
    if (!Array.isArray(entries)) fail("ClickUp time-entry response did not contain an array.");
    const lower = startDate ? epochMs(startDate, "startDate") : Number.NEGATIVE_INFINITY;
    const upper = endDate ? inclusiveEndEpochMs(endDate, "endDate") : Number.POSITIVE_INFINITY;
    const filtered = entries.filter((entry) => {
      if (!entry || Array.isArray(entry) || typeof entry !== "object") return false;
      const start = Number((entry as Record<string, Json>).start);
      return Number.isFinite(start) && start >= lower && start < upper;
    });
    return { command, data: filtered };
  } else if (command === "search-tasks") {
    const listId = text(input, "listId");
    const query = text(input, "query").toLocaleLowerCase("es");
    const matches: Record<string, Json>[] = [];
    for (let page = 0; page < 100; page++) {
      if (dryRun) return { command, dryRun: true, invocation: [COMPOSIO, ...argsForExecute(TOOL.getTasks, { list_id: listId, page, include_closed: boolean(input, "includeClosed", true), subtasks: true }, true)] };
      const pageResult = await execute(TOOL.getTasks, { list_id: listId, page, include_closed: boolean(input, "includeClosed", true), subtasks: true });
      const tasks = tasksFrom(pageResult);
      matches.push(...tasks.filter((task) => typeof task.name === "string" && task.name.toLocaleLowerCase("es").includes(query)));
      const unwrapped = unwrap(pageResult);
      const lastPage = unwrapped && !Array.isArray(unwrapped) && typeof unwrapped === "object" ? (unwrapped as Record<string, Json>).last_page : undefined;
      if (lastPage === true || tasks.length === 0) break;
    }
    return { command, matches };
  } else if (command === "create-task") {
    const name = text(input, "name");
    const description = text(input, "description");
    assertSpanishTitle(name);
    assertClientContent(description, "description");
    const listId = text(input, "listId");
    const data = clean({
      list_id: listId, name, description, status: optionalText(input, "status"),
      due_date: optionalText(input, "dueDate") ? epochMs(text(input, "dueDate"), "dueDate") : undefined,
      due_date_time: optionalText(input, "dueDate") ? false : undefined,
      assignees: integerArray(input, "assigneeIds"), priority: priority(input),
      notify_all: false
    });
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getList, { list_id: listId }, true)], invocation: [COMPOSIO, ...argsForExecute(TOOL.createTask, data, true)] };
    const list = await getList(listId);
    if (typeof data.status === "string") assertStatusInList(list, data.status);
    const created = await execute(TOOL.createTask, data);
    const verified = await getTask(taskIdFrom(created));
    return { command, created, verified };
  } else if (command === "update-task") {
    const taskId = text(input, "taskId");
    const data = clean({
      task_id: taskId, name: optionalText(input, "name"), description: optionalText(input, "description"),
      status: optionalText(input, "status"), archived: own(input, "archived") ? boolean(input, "archived") : undefined,
      due_date: optionalText(input, "dueDate") ? epochMs(text(input, "dueDate"), "dueDate") : undefined,
      due_date_time: optionalText(input, "dueDate") ? false : undefined,
      priority: priority(input),
      assignees__add: integerArray(input, "assigneeIdsToAdd"), assignees__rem: integerArray(input, "assigneeIdsToRemove")
    });
    if (Object.keys(data).length === 1) fail("update-task requires at least one field to change.");
    if (data.name) assertSpanishTitle(String(data.name));
    if (data.description) assertClientContent(String(data.description), "description");
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getTask, { task_id: taskId }, true)], invocation: [COMPOSIO, ...argsForExecute(TOOL.updateTask, data, true)] };
    const before = await getTask(taskId);
    if (typeof data.status === "string") assertStatusInList(await getList(listIdFromTask(before)), data.status);
    const updated = await execute(TOOL.updateTask, data);
    const verified = await getTask(taskId);
    return { command, before, updated, verified };
  } else if (command === "complete-task") {
    const taskId = text(input, "taskId");
    if (dryRun) return { command, dryRun: true, note: "Runtime preflight reads the task and list, selects the list status whose type is closed, then updates only status." };
    const before = await getTask(taskId);
    const list = await getList(listIdFromTask(before));
    const status = closedStatusFromList(list);
    const updated = await execute(TOOL.updateTask, { task_id: taskId, status });
    const verified = await getTask(taskId);
    return { command, status, before, updated, verified };
  } else if (command === "add-comment") {
    const taskId = text(input, "taskId");
    const body = text(input, "body");
    assertClientContent(body, "body");
    const proxyArgs = argsForProxy(`${API_BASE}/task/${encodeURIComponent(taskId)}/comment`, "POST", { comment_text: body, notify_all: false });
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getTask, { task_id: taskId }, true)], invocation: [COMPOSIO, ...proxyArgs] };
    const task = await getTask(taskId);
    const created = await proxy(`${API_BASE}/task/${encodeURIComponent(taskId)}/comment`, "POST", { comment_text: body, notify_all: false });
    const comments = await execute(TOOL.getComments, { task_id: taskId });
    return { command, task, created, verifiedComments: comments };
  } else if (command === "log-time") {
    const workspaceId = text(input, "workspaceId");
    const taskId = text(input, "taskId");
    const minutes = positiveInt(input, "minutes");
    const description = text(input, "description");
    assertClientContent(description, "description");
    const start = epochMs(text(input, "date"), "date");
    const data = { team_Id: workspaceId, tid: taskId, start, duration: minutes * 60_000, description, billable: false };
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getTask, { task_id: taskId }, true)], invocation: [COMPOSIO, ...argsForExecute(TOOL.createTime, data, true)] };
    const task = await getTask(taskId);
    const created = await execute(TOOL.createTime, data);
    const verified = await execute(TOOL.getTime, { team_id: Number(workspaceId), timer_id: entityIdFrom(created, "Time entry"), include__task: true, include_location_names: true });
    return { command, task, created, verified };
  } else if (command === "delete-task") {
    const taskId = text(input, "taskId");
    if (text(input, "confirm") !== `DELETE ${taskId}`) fail(`confirm must equal DELETE ${taskId}.`);
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getTask, { task_id: taskId }, true)], invocation: [COMPOSIO, ...argsForExecute(TOOL.deleteTask, { task_id: taskId }, true)] };
    const target = await getTask(taskId);
    const deleted = await execute(TOOL.deleteTask, { task_id: taskId });
    return { command, target, deleted };
  } else if (command === "delete-time") {
    const workspaceId = text(input, "workspaceId");
    const timeEntryId = text(input, "timeEntryId");
    if (text(input, "confirm") !== `DELETE ${timeEntryId}`) fail(`confirm must equal DELETE ${timeEntryId}.`);
    if (dryRun) return { command, dryRun: true, preflight: [COMPOSIO, ...argsForExecute(TOOL.getTime, { team_id: Number(workspaceId), timer_id: timeEntryId, include__task: true }, true)], invocation: [COMPOSIO, ...argsForExecute(TOOL.deleteTime, { team_id: workspaceId, timer_id: timeEntryId }, true)] };
    const target = await execute(TOOL.getTime, { team_id: Number(workspaceId), timer_id: timeEntryId, include__task: true });
    const deleted = await execute(TOOL.deleteTime, { team_id: workspaceId, timer_id: timeEntryId });
    return { command, target, deleted };
  } else fail(`Unknown command: ${command}. Expected one of: ${COMMANDS.join(", ")}.`);

  if (dryRun) return { command, dryRun: true, invocation: [COMPOSIO, ...args!] };
  result = await spawnJson(args!);
  return { command, data: result };
}

async function readInput(argument?: string): Promise<Input> {
  if (!argument) return {};
  let raw = argument;
  if (argument === "-") raw = await new Response(Bun.stdin.stream()).text();
  else if (argument.startsWith("@")) raw = await Bun.file(argument.slice(1)).text();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") fail("Input JSON must be an object.");
    return parsed as Input;
  } catch (error) {
    if (error instanceof SyntaxError) fail(`Invalid input JSON: ${error.message}`);
    throw error;
  }
}

async function main(argv: string[]): Promise<void> {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h") {
    console.log(`Usage: bun scripts/clickup.ts <command> -d '<json>' [--dry-run]\nCommands: ${COMMANDS.join(", ")}`);
    return;
  }
  const dataIndex = argv.findIndex((arg) => arg === "-d" || arg === "--data");
  const input = await readInput(dataIndex >= 0 ? argv[dataIndex + 1] : undefined);
  const output = await run(command, input, argv.includes("--dry-run"));
  console.log(JSON.stringify({ ok: true, ...output as object }, null, 2));
}

if (import.meta.main) {
  main(Bun.argv.slice(2)).catch((error) => {
    console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }, null, 2));
    process.exitCode = 1;
  });
}
