const API_BASE = "https://api.clickup.com/api/v2";

export const TEAM_ID = "20421257";
export const ACCOUNT_LABEL = "jolebrahim";

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

export type SyncInput = {
  notionTaskTitle: string;
  notionTaskUrl?: string | null;
  clickupTaskId?: string | null;
  listId?: string | null;
  problem: string;
  solution: string;
  implementation?: string | null;
  references?: string[] | null;
  minutes: number;
  date: string;
  assigneeIds?: number[] | null;
  priority?: number | null;
};

export type SimpleSyncInput = {
  notionTaskTitle: string;
  notionTaskUrl: string;
  problem: string;
  solution: string;
  implementation: string;
  referencesText: string;
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

export function dateToStartMs(date: string): number {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.valueOf())) throw new Error("date must be a valid ISO date or datetime.");
  return parsed.valueOf();
}

export function buildCompletionComment(input: Pick<SyncInput, "problem" | "solution" | "implementation" | "references">): string {
  const implementation = input.implementation?.trim();
  const references = input.references?.filter(Boolean) ?? [];
  const lines = [
    `Problema. ${input.problem.trim()}`,
    `Solución. ${input.solution.trim()}`
  ];

  if (implementation) lines.push(`Implementación. ${implementation}`);
  if (references.length) lines.push(`Referencia. ${references.join(", ")}`);

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
    notionTaskUrl: input.notionTaskUrl.trim() || null,
    implementation: input.implementation.trim() || null,
    references: parseReferencesText(input.referencesText)
  };
}

export function buildTaskDescription(input: SyncInput): string {
  const lines = [
    buildCompletionComment(input),
    "",
    `Tiempo registrado. ${input.minutes} min.`
  ];

  if (input.notionTaskUrl) lines.push(`Origen Notion. ${input.notionTaskUrl}`);

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
  if (!input.listId) throw new Error("listId is required when creating a ClickUp task.");

  const body: Record<string, unknown> = {
    name: input.notionTaskTitle,
    description: buildTaskDescription(input),
    status: "cerrada"
  };

  if (input.assigneeIds?.length) body.assignees = input.assigneeIds;
  if (input.priority) body.priority = input.priority;

  return clickupRequest<ClickUpTask>("POST", `/list/${input.listId}/task`, body);
}

export async function updateTaskDone(taskId: string, status: string): Promise<ClickUpTask> {
  return clickupRequest<ClickUpTask>("PUT", `/task/${encodeURIComponent(taskId)}`, { status });
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
    description,
    billable: true
  });
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
  await createTimeEntry(task.id, input.date, input.minutes, `Trabajo completado. ${input.notionTaskTitle}`);
  await createTaskComment(task.id, comment);

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
    commented: true,
    comment
  };
}
