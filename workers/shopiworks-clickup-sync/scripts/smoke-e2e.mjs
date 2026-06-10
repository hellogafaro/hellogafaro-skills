#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const TASKS_DATA_SOURCE_ID = "25ffc798-2e43-801b-9eed-000b4bc5f349";
const TIMESHEETS_DATA_SOURCE_ID = "e6f1b1a0-0a27-434e-b220-00f79ee95859";
const HELLO_GAFARO_PROJECT_ID = "335fc798-2e43-8116-8e97-c8aa6f43f234";
const JOHAN_NOTION_USER_ID = "db9de131-61b1-4bfa-975c-ed5cc1474e36";
const CLICKUP_TEAM_ID = "20421257";
const CLICKUP_LIST_ID = "901216495401";
const CLICKUP_ASSIGNEE_ID = 182449615;
const DATE = "2026-06-10";

function run(command, args, options = {}) {
  const output = execFileSync(command, args, {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return output.trim();
}

function json(command, args, options = {}) {
  return JSON.parse(run(command, args, options));
}

function worker(tool, data) {
  return json("ntn", ["workers", "exec", "-l", tool, "-d", JSON.stringify(data)], { cwd: ROOT });
}

function notion(path, dataOrQuery) {
  const args = ["api", path];
  if (typeof dataOrQuery === "string") {
    args.push(dataOrQuery);
  } else if (dataOrQuery) {
    args.push("-d", JSON.stringify(dataOrQuery));
  }
  return json("ntn", args, { cwd: ROOT });
}

function loadClickUpToken() {
  const envText = fs.readFileSync(`${ROOT}/.env`, "utf8");
  const token = envText.match(/^CLICKUP_API_TOKEN=(.+)$/m)?.[1]?.trim();
  if (!token) throw new Error("CLICKUP_API_TOKEN missing from .env. Run `ntn workers env pull --yes --file .env` first.");
  return token;
}

async function clickup(path, method = "GET", body) {
  const response = await fetch(`https://api.clickup.com/api/v2${path}`, {
    method,
    headers: {
      Authorization: loadClickUpToken(),
      "Content-Type": "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`ClickUp ${method} ${path} failed ${response.status}: ${text}`);
  return parsed;
}

function taskPayload(name, markdown) {
  return {
    parent: { type: "data_source_id", data_source_id: TASKS_DATA_SOURCE_ID },
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Owner: { people: [{ id: JOHAN_NOTION_USER_ID }] },
      Assignee: { people: [{ id: JOHAN_NOTION_USER_ID }] },
      Project: { relation: [{ id: HELLO_GAFARO_PROJECT_ID }] },
      Priority: { select: { name: "Low" } },
      Status: { status: { name: "Done" } },
      Recurrence: { select: { name: "One-time" } },
      "Due date": { date: { start: DATE } }
    },
    markdown
  };
}

function timePayload(taskId, minutes) {
  return {
    parent: { type: "data_source_id", data_source_id: TIMESHEETS_DATA_SOURCE_ID },
    properties: {
      Name: { title: [{ mention: { type: "page", page: { id: taskId } } }] },
      Owner: { people: [{ id: JOHAN_NOTION_USER_ID }] },
      Task: { relation: [{ id: taskId }] },
      Project: { relation: [{ id: HELLO_GAFARO_PROJECT_ID }] },
      Date: { date: { start: DATE } },
      Minutes: { number: minutes }
    }
  };
}

function commentPayload(taskId, markdown) {
  return {
    parent: { type: "page_id", page_id: taskId },
    markdown
  };
}

async function verifyClickUp(taskId, expectedName, expectedTimeMs) {
  const task = await clickup(`/task/${taskId}`);
  const time = await clickup(`/team/${CLICKUP_TEAM_ID}/time_entries?task_id=${taskId}&start_date=${Date.UTC(2020, 0, 1)}&end_date=${Date.UTC(2035, 0, 1)}`);
  const entries = time.data ?? [];
  if (task.name !== expectedName) throw new Error(`Unexpected ClickUp title for ${taskId}: ${task.name}`);
  if (task.status?.status !== "cerrada") throw new Error(`Unexpected ClickUp status for ${taskId}: ${task.status?.status}`);
  if (!entries.some((entry) => Number(entry.duration) === expectedTimeMs && entry.billable === false)) {
    throw new Error(`Missing non-billable ${expectedTimeMs}ms time entry for ${taskId}`);
  }
  return {
    taskId,
    url: task.url,
    title: task.name,
    status: task.status?.status,
    timeEntries: entries.map((entry) => ({
      id: entry.id,
      duration: Number(entry.duration),
      billable: entry.billable,
      description: entry.description
    }))
  };
}

function archiveNotionPage(pageId) {
  return json("ntn", [
    "api",
    `/v1/pages/${pageId}`,
    "-X",
    "PATCH",
    "-d",
    JSON.stringify({ in_trash: true })
  ], { cwd: ROOT });
}

async function cleanup(ids) {
  const results = { clickupDeleted: [], notionArchived: [] };
  for (const taskId of ids.clickupTaskIds ?? []) {
    await clickup(`/task/${taskId}`, "DELETE");
    results.clickupDeleted.push(taskId);
  }
  for (const pageId of ids.notionPageIds ?? []) {
    archiveNotionPage(pageId);
    results.notionArchived.push(pageId);
  }
  return results;
}

async function createAndVerify() {
  const created = {
    clickupTaskIds: [],
    notionPageIds: [],
    links: {}
  };

  try {
    const newNotionTask = notion("/v1/pages", taskPayload(
      "Demo sync creates a new ClickUp mirror task",
      [
        "This demo task validates the full worker path when a completed Notion task does not yet exist in ClickUp and needs a new client-facing mirror.",
        "",
        "- The worker should create a Spanish ClickUp task in Apps > Github, close it, assign Johan, log non-billable time, and add a natural first-person comment.",
        "- This is a disposable smoke-test record that should be cleaned up after inspection."
      ].join("\n")
    ));
    created.notionPageIds.push(newNotionTask.id);
    created.links.newNotionTask = newNotionTask.url;

    const newSync = worker("syncCompletedTask", {
      listId: CLICKUP_LIST_ID,
      clickupTaskId: null,
      clickupTaskTitle: "Crear réplica demo desde una tarea nueva",
      taskBodyParagraphs: ["Esta tarea demo valida el flujo completo cuando una tarea terminada en Notion todavía no existe en ClickUp y necesita convertirse en una réplica clara para revisión."],
      taskBodyBullets: [
        "La prueba debe quedar en la lista Github del folder Apps para que sea fácil encontrarla y limpiarla después.",
        "El cuerpo debe mantener una descripción breve seguida de bullets naturales, sin títulos internos."
      ],
      completionCommentParagraphs: ["Hice la réplica demo desde el worker y dejé la tarea cerrada para validar el flujo de creación completa."],
      completionCommentBullets: ["También dejé tiempo no facturable registrado para confirmar que el worker respeta esa regla."],
      minutes: 15,
      date: `${DATE}T12:00:00.000Z`,
      assigneeIds: [CLICKUP_ASSIGNEE_ID],
      priority: 4
    });
    created.clickupTaskIds.push(newSync.taskId);
    created.links.newClickUpTask = newSync.taskUrl;

    const newTime = notion("/v1/pages", timePayload(newNotionTask.id, 15));
    created.notionPageIds.push(newTime.id);
    created.links.newNotionTime = newTime.url;

    notion("/v1/comments", commentPayload(
      newNotionTask.id,
      `I synced this to ClickUp as [${newSync.taskId}](${newSync.taskUrl}) and left the task closed with non-billable time tracked.`
    ));

    const existingSeed = worker("syncCompletedTask", {
      listId: CLICKUP_LIST_ID,
      clickupTaskId: null,
      clickupTaskTitle: "Preparar tarea demo existente para cierre",
      taskBodyParagraphs: ["Esta tarea demo queda como base para validar el flujo en el que ClickUp ya tiene una tarea y solo necesitamos cerrarla con tiempo y comentario."],
      taskBodyBullets: [
        "La sincronización final no debe cambiar este título ni esta descripción.",
        "El worker debe limitarse a actualizar campos operativos, registrar tiempo no facturable y dejar un comentario natural."
      ],
      completionCommentParagraphs: ["Hice la tarea demo inicial para preparar el caso de sincronización sobre una tarea existente."],
      completionCommentBullets: ["Después la reabriré con el worker y volveré a cerrarla usando el flujo de tarea existente."],
      minutes: 15,
      date: `${DATE}T12:00:00.000Z`,
      assigneeIds: [CLICKUP_ASSIGNEE_ID],
      priority: 4
    });
    created.clickupTaskIds.push(existingSeed.taskId);

    worker("updateTask", {
      taskId: existingSeed.taskId,
      name: "",
      description: "",
      status: "en progreso"
    });

    const existingNotionTask = notion("/v1/pages", taskPayload(
      "Demo sync closes an existing ClickUp task",
      [
        "This demo task validates the full worker path when the ClickUp task already exists and should not have its title or body rewritten.",
        "",
        "- The worker should update only operational fields, close the task, log non-billable time, and add a natural first-person comment.",
        "- This is a disposable smoke-test record that should be cleaned up after inspection."
      ].join("\n")
    ));
    created.notionPageIds.push(existingNotionTask.id);
    created.links.existingNotionTask = existingNotionTask.url;

    const existingSync = worker("syncExistingCompletedTask", {
      clickupTaskId: existingSeed.taskId,
      clickupTaskTitle: "Cerrar tarea demo existente sin reescribir contenido",
      completionCommentParagraphs: ["Hice el cierre demo sobre una tarea que ya existía en ClickUp y mantuve intactos el título y la descripción."],
      completionCommentBullets: ["También registré tiempo no facturable y dejé la tarea cerrada para validar el flujo real de sincronización existente."],
      minutes: 30,
      date: `${DATE}T13:00:00.000Z`
    });
    created.links.existingClickUpTask = existingSync.taskUrl;

    const existingTime = notion("/v1/pages", timePayload(existingNotionTask.id, 30));
    created.notionPageIds.push(existingTime.id);
    created.links.existingNotionTime = existingTime.url;

    notion("/v1/comments", commentPayload(
      existingNotionTask.id,
      `I synced this to the existing ClickUp task [${existingSync.taskId}](${existingSync.taskUrl}), kept its title and body intact, and left it closed with non-billable time tracked.`
    ));

    const verified = [
      await verifyClickUp(newSync.taskId, "Crear réplica demo desde una tarea nueva", 900000),
      await verifyClickUp(existingSync.taskId, "Preparar tarea demo existente para cierre", 1800000)
    ];

    return { ok: true, created, verified };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error), created };
  }
}

const mode = process.argv[2] ?? "run";

if (mode === "cleanup") {
  const ids = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  console.log(JSON.stringify(await cleanup(ids), null, 2));
} else if (mode === "run") {
  console.log(JSON.stringify(await createAndVerify(), null, 2));
} else {
  throw new Error("Usage: node scripts/smoke-e2e.mjs [run|cleanup cleanup.json]");
}
