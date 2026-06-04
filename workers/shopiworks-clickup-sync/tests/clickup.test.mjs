import assert from "node:assert/strict";
import { test } from "node:test";

const mod = await import("../src/clickup.ts");

test("completion comment has value narrative shape", () => {
  const comment = mod.buildCompletionComment({
    problem: "El selector no mostraba claramente el color activo.",
    solution: "Añadimos un borde negro al color seleccionado.",
    implementation: "La variante activa queda marcada visualmente en la ficha de producto.",
    references: ["abc1234"]
  });

  assert.match(comment, /^Problema\./);
  assert.match(comment, /Solución\./);
  assert.match(comment, /Implementación\./);
  assert.match(comment, /Referencia\. abc1234/);
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
    notionTaskTitle: "Fix selector",
    notionTaskUrl: "https://notion.so/task",
    problem: "Problema detectado.",
    solution: "Solución aplicada.",
    implementation: "Se ajustó el selector activo.",
    references: ["abc1234"],
    minutes: 30,
    date: "2026-06-04"
  });

  assert.match(description, /^Problema detectado\. Solución aplicada\./);
  assert.match(description, /Contexto/);
  assert.match(description, /- Tiempo registrado\. 30 min\./);
  assert.match(description, /- Implementación\. Se ajustó el selector activo\./);
  assert.match(description, /- Referencias\. abc1234/);
  assert.match(description, /- Origen Notion\. https:\/\/notion\.so\/task/);
});

test("simple worker input normalizes empty strings", () => {
  const input = mod.normalizeSimpleInput({
    notionTaskTitle: "Fix selector",
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
