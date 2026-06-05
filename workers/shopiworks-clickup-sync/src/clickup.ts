const API_BASE = "https://api.clickup.com/api/v2";

export const TEAM_ID = "20421257";
export const ACCOUNT_LABEL = "jolebrahim";
export const DEFAULT_ASSIGNEE_ID = 182449615;
export const CLICKUP_TASK_TITLE_MAX_LENGTH = 80;

export type ClickUpTask = {
  id: string;
  name: string;
  url?: string;
  status?: { status?: string; type?: string };
  list?: { id?: string; name?: string };
  folder?: { id?: string; name?: string };
  project?: { id?: string; name?: string };
  time_spent?: number | null;
};

export type TaskSummary = {
  id: string;
  name: string;
  url: string;
  status: string;
  statusType: string;
  listId: string;
  listName: string;
  folderId: string;
  folderName: string;
  timeSpentMs: number;
};

export type TimeEntrySummary = {
  id: string;
  taskId: string;
  description: string;
  durationMs: number;
  startMs: number;
};

export type SyncInput = {
  clickupTaskTitle: string;
  clickupTaskId?: string | null;
  listId?: string | null;
  problem?: string | null;
  solution?: string | null;
  implementation?: string | null;
  references?: string[] | null;
  taskBodyParagraphs?: string[] | null;
  taskBodyBullets?: string[] | null;
  completionCommentParagraphs?: string[] | null;
  completionCommentBullets?: string[] | null;
  minutes: number;
  date: string;
  assigneeIds?: number[] | null;
  priority?: number | null;
};

export type SimpleSyncInput = {
  clickupTaskTitle: string;
  taskBodyParagraphs?: string[];
  taskBodyBullets?: string[];
  completionCommentParagraphs?: string[];
  completionCommentBullets?: string[];
  minutes: number;
  date: string;
};

export type SyncResult = {
  taskId: string;
  taskUrl: string;
  taskName: string;
  status: string;
  statusType: string;
  listId: string;
  listName: string;
  folderId: string;
  folderName: string;
  timeLoggedMs: number;
  createdTask: boolean;
  markedDone: boolean;
  loggedTime: boolean;
  commented: boolean;
  comment: string;
};

export const CLICKUP_MAP = {
  workspace: { name: "Jol Ebrahim", teamId: TEAM_ID, accountLabel: ACCOUNT_LABEL },
  notes: [
    "Normal spaces discovery returned no active spaces for this connection.",
    "Use shared hierarchy for read-only mapping when structure is needed.",
    "This map is guidance only, not exhaustive and not a hard gate."
  ],
  statuses: {
    closedNames: ["cerrada", "Closed"],
    preferClosedType: true
  },
  folders: [
    {
      name: "udeplab x Somomu",
      id: "90127715842",
      statuses: ["Open", "in progress", "review", "Closed"],
      lists: [
        { name: "General", id: "901212940671" },
        { name: "Mejoras web", id: "901202879959" },
        { name: "Ads", id: "901212940661" }
      ]
    },
    {
      name: "Apps",
      id: "90125419935",
      statuses: ["en planificación", "pendiente", "en progreso", "revisión", "cerrada"],
      lists: [
        { name: "Gift Card", id: "901215513835" },
        { name: "Gift Registry", id: "901209180337" },
        { name: "Gift Verse", id: "901212132544" },
        { name: "Colour me", id: "901216214638" },
        { name: "Product flex", id: "901212173479" },
        { name: "Catálogo", id: "901216079997" },
        { name: "Talleres", id: "901216196733" },
        { name: "QR dinámicos", id: "901218221065" },
        { name: "mincioton dashboard", id: "901218169279" },
        { name: "Github", id: "901216495401" }
      ]
    },
    {
      name: "udeplab x minicoton",
      id: "90127406121",
      statuses: ["abierta", "en progreso", "revisión", "cerrada"],
      lists: [
        { name: "General", id: "901212281203" },
        { name: "Marketing", id: "901214324820" },
        { name: "revisión de subida de theme", id: "901216185241" },
        { name: "Rocket digital", id: "901211869782" },
        { name: "Tienda online", id: "901212741061" },
        { name: "POS - Minicoton Store", id: "901217984217" }
      ]
    },
    {
      name: "Gerard x minicoton",
      id: "90128634502",
      statuses: ["abierta", "en progreso", "revisión", "cerrada"],
      lists: [
        { name: "Campañas", id: "901214681540" },
        { name: "Sergio", id: "901215978155" },
        { name: "Varios", id: "901214423325" },
        { name: "Multimedia", id: "901216492059" },
        { name: "Influencers + UGC", id: "901216492274" },
        { name: "SEO", id: "901216770239" }
      ]
    },
    {
      name: "Lucas x minicoton",
      id: "90128018238",
      statuses: ["abierta", "en progreso", "revisión", "cerrada"],
      lists: [
        { name: "Ads", id: "901213687882" },
        { name: "Roas Hunter", id: "901214123959" },
        { name: "Web", id: "901213253749" }
      ]
    },
    {
      name: "Themes",
      id: "901210348195",
      statuses: ["abierta", "en progreso", "revisión", "cerrada"],
      lists: [
        { name: "Paper", id: "901217020939" },
        { name: "Headless", id: "901217020948" }
      ]
    }
  ],
  folderlessLists: [
    { name: "Highdatanet.com Post migración somomu", id: "901217377046" },
    { name: "Montseesteve.com", id: "901208311062" }
  ],
  validatedExamples: [
    {
      taskId: "869djg7ff",
      name: "Problema con el Charm ABC de colour me",
      folder: "Apps",
      list: "Colour me",
      status: "cerrada",
      timeSpentMs: 3600000
    }
  ]
};

export function requireToken(): string {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    throw new Error("CLICKUP_API_TOKEN is missing. Set it in the worker environment before live ClickUp calls.");
  }
  return token;
}

export async function clickupRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: requireToken(),
      "Content-Type": "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = typeof parsed?.err === "string" ? parsed.err : text;
    throw new Error(`ClickUp ${method} ${path} failed ${response.status}. ${message}`);
  }

  return parsed as T;
}

export function assertMinutes(minutes: number): void {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error("minutes must be greater than 0. No ClickUp write is allowed without confirmed time.");
  }
}

export function assertNeutralSpanishTitle(title: string): void {
  const normalized = title.trim();
  if (!normalized) throw new Error("clickupTaskTitle is required and must be natural neutral Spanish.");
  if (normalized.length > CLICKUP_TASK_TITLE_MAX_LENGTH) {
    throw new Error(`clickupTaskTitle must be ${CLICKUP_TASK_TITLE_MAX_LENGTH} characters or fewer.`);
  }

  const englishSignals = [
    /\b(add|adjust|build|check|create|fix|implement|improve|launch|make|optimize|rebuild|remove|review|send|sync|test|update)\b/i,
    /\b(page|product|registry|theme|variant|description|spacing|border|active|gift card|gift registry)\b/i
  ];

  if (englishSignals.some((pattern) => pattern.test(normalized))) {
    throw new Error("clickupTaskTitle must be natural neutral Spanish. Translate the Notion task title before creating or syncing a ClickUp task.");
  }
}

export function dateToStartMs(date: string): number {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.valueOf())) throw new Error("date must be a valid ISO date or datetime.");
  return parsed.valueOf();
}

export function normalizeLines(lines?: string[] | null): string[] {
  return (lines ?? []).map((line) => line.trim()).filter(Boolean);
}

export function renderParagraphsWithBullets(paragraphs: string[], bullets: string[]): string {
  const body = paragraphs.join("\n\n");
  const list = bullets.map((bullet) => `- ${bullet}`).join("\n");
  return [body, list].filter(Boolean).join("\n\n");
}

export function buildCompletionComment(
  input: Pick<SyncInput, "problem" | "solution" | "implementation" | "references" | "completionCommentParagraphs" | "completionCommentBullets">
): string {
  const paragraphs = normalizeLines(input.completionCommentParagraphs);
  const directBullets = normalizeLines(input.completionCommentBullets);
  if (paragraphs.length) {
    return renderParagraphsWithBullets(paragraphs.slice(0, 3), directBullets);
  }

  const implementation = input.implementation?.trim();
  const references = input.references?.filter(Boolean) ?? [];
  const problem = input.problem?.trim();
  const solution = input.solution?.trim();
  const lines = [[problem, solution].filter(Boolean).join(" ")];

  const bullets = [];
  if (implementation) bullets.push(`- ${implementation}`);
  if (references.length) bullets.push(`- Cambios o enlaces relacionados en ${references.join(", ")}.`);

  if (bullets.length) lines.push("", ...bullets);

  return lines.join("\n");
}

export function parseReferencesText(referencesText: string): string[] {
  return referencesText
    .split(/\n|,/)
    .map((reference) => reference.trim())
    .filter(Boolean);
}

export function normalizeSimpleInput(input: SimpleSyncInput): SyncInput {
  return {
    ...input,
    taskBodyParagraphs: input.taskBodyParagraphs ?? null,
    taskBodyBullets: input.taskBodyBullets ?? null,
    completionCommentParagraphs: input.completionCommentParagraphs ?? null,
    completionCommentBullets: input.completionCommentBullets ?? null
  };
}

export function buildTaskDescription(input: SyncInput): string {
  const paragraphs = normalizeLines(input.taskBodyParagraphs);
  const directBullets = normalizeLines(input.taskBodyBullets);
  if (paragraphs.length) {
    return renderParagraphsWithBullets(paragraphs.slice(0, 3), directBullets);
  }

  const problem = input.problem?.trim();
  const solution = input.solution?.trim();
  const lines = [[problem, solution].filter(Boolean).join(" "), ""];

  const implementation = input.implementation?.trim();
  const references = input.references?.filter(Boolean) ?? [];

  if (implementation) lines.push(`- ${implementation}`);
  if (references.length) lines.push(`- Cambios o enlaces relacionados en ${references.join(", ")}.`);

  return lines.join("\n");
}

export function closedStatusForTask(task?: ClickUpTask): string {
  const current = task?.status?.status;
  const known = current && CLICKUP_MAP.statuses.closedNames.includes(current) ? current : undefined;
  return known ?? "cerrada";
}

export function summarizeTask(task: ClickUpTask): TaskSummary {
  return {
    id: task.id,
    name: task.name,
    url: task.url ?? "",
    status: task.status?.status ?? "",
    statusType: task.status?.type ?? "",
    listId: task.list?.id ?? "",
    listName: task.list?.name ?? "",
    folderId: task.folder?.id ?? task.project?.id ?? "",
    folderName: task.folder?.name ?? task.project?.name ?? "",
    timeSpentMs: task.time_spent ?? 0
  };
}

export function summarizeTimeEntry(entry: Record<string, unknown>, taskId: string): TimeEntrySummary {
  const task = entry.task as { id?: string } | undefined;
  return {
    id: String(entry.id ?? ""),
    taskId: task?.id ?? taskId,
    description: String(entry.description ?? ""),
    durationMs: Number(entry.duration ?? 0),
    startMs: Number(entry.start ?? 0)
  };
}

export function shouldCommentOnClickUpTask(createdTask: boolean): boolean {
  return !createdTask;
}

export function resolveAssigneeIds(assigneeIds?: number[] | null): number[] {
  return assigneeIds?.length ? assigneeIds : [DEFAULT_ASSIGNEE_ID];
}

export async function getTaskRaw(taskId: string): Promise<ClickUpTask> {
  return clickupRequest<ClickUpTask>("GET", `/task/${encodeURIComponent(taskId)}`);
}

export async function getTask(taskId: string): Promise<TaskSummary> {
  return summarizeTask(await getTaskRaw(taskId));
}

export async function searchTasks(query: string, includeClosed = true): Promise<{ tasks: TaskSummary[] }> {
  const params = new URLSearchParams({
    query,
    include_closed: String(includeClosed),
    subtasks: "true"
  });
  const result = await clickupRequest<{ tasks: ClickUpTask[] }>("GET", `/team/${TEAM_ID}/task?${params.toString()}`);
  return { tasks: result.tasks.map(summarizeTask) };
}

export async function createTask(input: SyncInput): Promise<ClickUpTask> {
  assertMinutes(input.minutes);
  assertNeutralSpanishTitle(input.clickupTaskTitle);
  if (!input.listId) throw new Error("listId is required when creating a ClickUp task.");

  const body: Record<string, unknown> = {
    name: input.clickupTaskTitle,
    description: buildTaskDescription(input),
    status: "cerrada"
  };

  body.assignees = resolveAssigneeIds(input.assigneeIds);
  if (input.priority) body.priority = input.priority;

  return clickupRequest<ClickUpTask>("POST", `/list/${input.listId}/task`, body);
}

export async function updateTaskFields(taskId: string, input: { name: string; description: string; status: string }): Promise<ClickUpTask> {
  const body: Record<string, unknown> = {};
  const name = input.name.trim();
  const description = input.description.trim();
  const status = input.status.trim();

  if (name) body.name = name;
  if (description) body.description = description;
  if (status) body.status = status;
  if (!Object.keys(body).length) throw new Error("At least one field is required to update a ClickUp task.");

  return clickupRequest<ClickUpTask>("PUT", `/task/${encodeURIComponent(taskId)}`, body);
}

export async function updateTaskDone(taskId: string, status: string): Promise<ClickUpTask> {
  return clickupRequest<ClickUpTask>("PUT", `/task/${encodeURIComponent(taskId)}`, { status });
}

export async function deleteTask(taskId: string): Promise<{ ok: boolean; taskId: string }> {
  await clickupRequest<Record<string, unknown>>("DELETE", `/task/${encodeURIComponent(taskId)}`);
  return { ok: true, taskId };
}

export async function createTaskComment(taskId: string, commentText: string): Promise<Record<string, unknown>> {
  return clickupRequest("POST", `/task/${encodeURIComponent(taskId)}/comment`, {
    comment_text: commentText,
    notify_all: false
  });
}

export async function createTimeEntry(taskId: string, date: string, minutes: number, description: string): Promise<Record<string, unknown>> {
  assertMinutes(minutes);
  return clickupRequest("POST", `/team/${TEAM_ID}/time_entries`, {
    tid: taskId,
    start: dateToStartMs(date),
    duration: Math.round(minutes * 60 * 1000),
    description
  });
}

export async function listTimeEntries(taskId: string): Promise<{ timeEntries: TimeEntrySummary[] }> {
  const params = new URLSearchParams({
    task_id: taskId,
    start_date: String(Date.UTC(2020, 0, 1)),
    end_date: String(Date.UTC(2035, 0, 1))
  });
  const result = await clickupRequest<{ data?: Record<string, unknown>[] }>("GET", `/team/${TEAM_ID}/time_entries?${params.toString()}`);
  return { timeEntries: (result.data ?? []).map((entry) => summarizeTimeEntry(entry, taskId)) };
}

export async function deleteTimeEntry(timeEntryId: string): Promise<{ ok: boolean; timeEntryId: string }> {
  await clickupRequest<Record<string, unknown>>("DELETE", `/team/${TEAM_ID}/time_entries/${encodeURIComponent(timeEntryId)}`);
  return { ok: true, timeEntryId };
}

export async function syncCompletedTask(input: SyncInput): Promise<{
  taskId: string;
  taskUrl: string;
  taskName: string;
  status: string;
  statusType: string;
  listId: string;
  listName: string;
  folderId: string;
  folderName: string;
  timeLoggedMs: number;
  createdTask: boolean;
  markedDone: boolean;
  loggedTime: boolean;
  commented: boolean;
  comment: string;
}> {
  assertMinutes(input.minutes);

  const comment = buildCompletionComment(input);
  let task: ClickUpTask;
  let createdTask = false;

  if (input.clickupTaskId) {
    task = await getTaskRaw(input.clickupTaskId);
  } else {
    task = await createTask(input);
    createdTask = true;
  }

  const status = closedStatusForTask(task);
  task = await updateTaskDone(task.id, status);
  await createTimeEntry(task.id, input.date, input.minutes, `Trabajo completado. ${input.clickupTaskTitle}`);
  const commented = shouldCommentOnClickUpTask(createdTask);
  if (commented) await createTaskComment(task.id, comment);

  const summary = summarizeTask(task);
  return {
    taskId: summary.id,
    taskUrl: summary.url,
    taskName: summary.name,
    status: summary.status,
    statusType: summary.statusType,
    listId: summary.listId,
    listName: summary.listName,
    folderId: summary.folderId,
    folderName: summary.folderName,
    timeLoggedMs: Math.round(input.minutes * 60 * 1000),
    createdTask,
    markedDone: true,
    loggedTime: true,
    commented,
    comment
  };
}
