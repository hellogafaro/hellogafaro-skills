import assert from "node:assert/strict";
import { test } from "node:test";

const mod = await import("../src/clickup.ts");

test("completion comment is prose with optional context bullets", () => {
  const comment = mod.buildCompletionComment({
    problem: "El selector no mostraba claramente el color activo.",
    solution: "Añadimos un borde negro al color seleccionado.",
    implementation: "La variante activa queda marcada visualmente en la ficha de producto.",
    references: ["abc1234"]
  });

  assert.match(comment, /^El selector no mostraba claramente el color activo\. Añadimos un borde negro al color seleccionado\./);
  assert.match(comment, /\n\n- La variante activa queda marcada visualmente en la ficha de producto\./);
  assert.match(comment, /- Cambios o enlaces relacionados en abc1234\./);
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

test("created task description includes context bullets", () => {
  const description = mod.buildTaskDescription({
    clickupTaskTitle: "Corregir selector",
    notionTaskUrl: "https://notion.so/task",
    problem: "Problema detectado.",
    solution: "Solución aplicada.",
    implementation: "Se ajustó el selector activo.",
    references: ["abc1234"],
    minutes: 30,
    date: "2026-06-04"
  });

  assert.match(description, /^Problema detectado\. Solución aplicada\./);
  assert.doesNotMatch(description, /Contexto|Implementación\.|Referencias\.|Origen Notion\.|Referencias:|Tiempo registrado:/);
  assert.match(description, /- Se ajustó el selector activo\./);
  assert.match(description, /- Se registraron 30 min\./);
  assert.match(description, /- Cambios o enlaces relacionados en abc1234\./);
  assert.doesNotMatch(description, /Notion|origen|source/i);
});

test("new tasks do not get duplicate clickup comments", () => {
  assert.equal(mod.shouldCommentOnClickUpTask(true), false);
  assert.equal(mod.shouldCommentOnClickUpTask(false), true);
});

test("simple worker input normalizes empty strings", () => {
  const input = mod.normalizeSimpleInput({
    clickupTaskTitle: "Corregir selector",
    notionTaskUrl: "",
    problem: "Problema detectado.",
    solution: "Solución aplicada.",
    implementation: "",
    referencesText: "https://github.com/one\nabc1234",
    minutes: 30,
    date: "2026-06-04"
  });

  assert.equal(input.notionTaskUrl, null);
  assert.equal(input.implementation, null);
  assert.deepEqual(input.references, ["https://github.com/one", "abc1234"]);
});

test("clickup task title must not be raw English", () => {
  assert.throws(
    () => mod.assertNeutralSpanishTitle("Implement black border to highlight active variant on product page"),
    /must be natural neutral Spanish/
  );
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
