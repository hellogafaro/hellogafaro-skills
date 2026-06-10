import assert from "node:assert/strict";
import { test } from "node:test";

const mod = await import("../src/clickup.ts");

test("completion comment is natural prose chunks", () => {
  const comment = mod.buildCompletionComment({
    problem: "El selector no mostraba claramente el color activo.",
    solution: "Añadimos un borde negro al color seleccionado.",
    implementation: "La variante activa queda marcada visualmente en la ficha de producto.",
    references: ["abc1234"]
  });

  assert.match(comment, /^El selector no mostraba claramente el color activo\. Añadimos un borde negro al color seleccionado\./);
  assert.match(comment, /\n\nLa variante activa queda marcada visualmente en la ficha de producto\./);
  assert.match(comment, /\n\nLos cambios relacionados se pueden revisar en abc1234\./);
  assert.doesNotMatch(comment, /\n- /);
  assert.doesNotMatch(comment, /Problema\.|Solución\.|Implementación\.|Referencia\.|Referencias:/);
});

test("minutes are required for write operations", () => {
  assert.throws(() => mod.assertMinutes(0), /No ClickUp write is allowed without confirmed time/);
  assert.throws(() => mod.assertMinutes(Number.NaN), /minutes must be greater than 0/);
  assert.doesNotThrow(() => mod.assertMinutes(1));
});

test("map includes validated workspace and closed statuses", () => {
  assert.equal(mod.CLICKUP_MAP.workspace.teamId, "20421257");
  assert.equal(mod.CLICKUP_MAP.workspace.accountLabel, "jolebrahim");
  assert.ok(mod.CLICKUP_MAP.statuses.closedNames.includes("cerrada"));
  assert.ok(mod.CLICKUP_MAP.statuses.closedNames.includes("Closed"));
});

test("created task description uses overview prose and context bullets without headings", () => {
  const description = mod.buildTaskDescription({
    clickupTaskTitle: "Corregir selector",
    problem: "Problema detectado.",
    solution: "Solución aplicada.",
    implementation: "Se ajustó el selector activo.",
    references: ["abc1234"],
    minutes: 30,
    date: "2026-06-04"
  });

  assert.match(description, /^Problema detectado\. Solución aplicada\./);
  assert.doesNotMatch(description, /Resumen|Recursos|Contexto|Overview|Resources|Implementación\.|Referencias\.|Origen Notion\.|Referencias:|Tiempo registrado:/);
  assert.match(description, /- Se ajustó el selector activo\./);
  assert.match(description, /- Los recursos relacionados están disponibles en abc1234\./);
  assert.doesNotMatch(description, /30 min|registraron/i);
  assert.doesNotMatch(description, /Notion|origen|source/i);
});

test("created task description accepts structured paragraphs and bullets", () => {
  const description = mod.buildTaskDescription({
    clickupTaskTitle: "Corregir selector",
    taskBodyParagraphs: ["El selector de variantes necesitaba una lectura más clara."],
    taskBodyBullets: ["La variante activa debe quedar marcada visualmente."],
    minutes: 30,
    date: "2026-06-04"
  });

  assert.match(description, /^El selector de variantes necesitaba una lectura más clara\./);
  assert.doesNotMatch(description, /Resumen|Recursos|Overview|Resources|Contexto/);
  assert.match(description, /- La variante activa debe quedar marcada visualmente\./);
  assert.doesNotMatch(description, /30 min|registraron/i);
  assert.doesNotMatch(description, /Notion|origen|source/i);
});

test("all synced tasks get clickup comments", () => {
  assert.equal(mod.shouldCommentOnClickUpTask(true), true);
  assert.equal(mod.shouldCommentOnClickUpTask(false), true);
});

test("new tasks default to Johan as assignee", () => {
  assert.deepEqual(mod.resolveAssigneeIds(null), [182449615]);
  assert.deepEqual(mod.resolveAssigneeIds([]), [182449615]);
  assert.deepEqual(mod.resolveAssigneeIds([123]), [123]);
});

test("simple worker input keeps structured fields", () => {
  const input = mod.normalizeSimpleInput({
    clickupTaskTitle: "Corregir selector",
    taskBodyParagraphs: ["Problema detectado."],
    taskBodyBullets: [],
    completionCommentParagraphs: ["Solución aplicada."],
    completionCommentBullets: ["https://github.com/one"],
    minutes: 30,
    date: "2026-06-04"
  });

  assert.deepEqual(input.taskBodyParagraphs, ["Problema detectado."]);
  assert.deepEqual(input.taskBodyBullets, []);
  assert.deepEqual(input.completionCommentParagraphs, ["Solución aplicada."]);
  assert.deepEqual(input.completionCommentBullets, ["https://github.com/one"]);
});

test("content rejects key-value style labels", () => {
  assert.throws(
    () => mod.renderProseChunks(["Code changes: abc1234"]),
    /must use natural prose/
  );
  assert.throws(
    () => mod.renderTaskBody(["El cambio aclara el flujo."], ["Repo: https://github.com/example/repo"]),
    /must use natural prose/
  );
  assert.throws(
    () => mod.renderTaskBody(["Resumen: El cambio aclara el flujo."], []),
    /must use natural prose/
  );
});

test("date and assignees are normalized for required fields", () => {
  assert.equal(mod.dueDateMs("2026-06-04"), Date.parse("2026-06-04"));
  assert.deepEqual(mod.resolveAssigneeIds(null), [182449615]);
});

test("clickup task title must not be raw English", () => {
  assert.throws(
    () => mod.assertNeutralSpanishTitle("Implement black border to highlight active variant on product page"),
    /must be natural neutral Spanish/
  );
  assert.throws(() => mod.assertNeutralSpanishTitle("x".repeat(81)), /80 characters or fewer/);
  assert.doesNotThrow(() => mod.assertNeutralSpanishTitle("Resaltar la variante activa en la ficha de producto"));
});

test("time entries are summarized for repair", () => {
  const summary = mod.summarizeTimeEntry(
    {
      id: "time_1",
      task: { id: "task_1" },
      description: "Trabajo completado.",
      duration: 60000,
      start: 1780599600000
    },
    "fallback_task"
  );

  assert.deepEqual(summary, {
    id: "time_1",
    taskId: "task_1",
    description: "Trabajo completado.",
    durationMs: 60000,
    startMs: 1780599600000
  });
});

test("time entries are always non-billable", async () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.CLICKUP_API_TOKEN;
  let capturedBody;

  process.env.CLICKUP_API_TOKEN = "test-token";
  globalThis.fetch = async (_url, init) => {
    capturedBody = JSON.parse(init.body);
    return {
      ok: true,
      text: async () => "{}"
    };
  };

  try {
    await mod.createTimeEntry("task_1", "2026-06-10T12:00:00.000Z", 60, "Trabajo completado.");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) {
      delete process.env.CLICKUP_API_TOKEN;
    } else {
      process.env.CLICKUP_API_TOKEN = originalToken;
    }
  }

  assert.equal(capturedBody.billable, false);
  assert.equal(capturedBody.duration, 3600000);
});
