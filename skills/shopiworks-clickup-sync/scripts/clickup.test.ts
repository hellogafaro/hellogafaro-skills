import { describe, expect, test } from "bun:test";
import { run, unwrap } from "./clickup";

describe("ClickUp command validation", () => {
  test("Composio response wrappers are normalized", () => {
    expect(unwrap({ successful: true, data: { id: "task_1" }, error: null })).toEqual({ id: "task_1" });
    expect(unwrap({ response: { successful: true, data: { tasks: [] } } })).toEqual({ tasks: [] });
    expect(unwrap({ successful: true, data: { data: { id: "time_1" } } })).toEqual({ id: "time_1" });
  });

  test("comment dry-run uses authenticated proxy without assignment or broad notifications", async () => {
    const result = await run("add-comment", {
      taskId: "task_1",
      body: "Hice el ajuste y deje la tarea lista para revision."
    }, true) as Record<string, unknown>;

    const invocation = result.invocation as string[];
    const payload = JSON.parse(invocation.at(-1)!);
    expect(invocation).toContain("proxy");
    expect(payload).toEqual({
      comment_text: "Hice el ajuste y deje la tarea lista para revision.",
      notify_all: false
    });
    expect(payload).not.toHaveProperty("assignee");
  });

  test("time logging enforces non-billable milliseconds and exact date", async () => {
    const result = await run("log-time", {
      workspaceId: "workspace_1",
      taskId: "task_1",
      date: "2026-07-18",
      minutes: 45,
      description: "Trabajo completado. Ajuste del flujo de compra."
    }, true) as Record<string, unknown>;

    const invocation = result.invocation as string[];
    const payload = JSON.parse(invocation.at(-1)!);
    expect(payload.start).toBe(Date.parse("2026-07-18T00:00:00.000Z"));
    expect(payload.duration).toBe(2_700_000);
    expect(payload.billable).toBe(false);
  });

  test("client-facing content rejects internal systems and tracked minutes", async () => {
    await expect(run("add-comment", { taskId: "task_1", body: "Sincronicé Notion en 30 minutos." }, true))
      .rejects.toThrow(/must not mention/);
  });

  test("raw English and overlong task titles are rejected", async () => {
    await expect(run("create-task", {
      listId: "list_1",
      name: "Implement active variant border",
      description: "La variante activa debe quedar clara."
    }, true)).rejects.toThrow(/natural neutral Spanish/);

    await expect(run("create-task", {
      listId: "list_1",
      name: "x".repeat(81),
      description: "La variante activa debe quedar clara."
    }, true)).rejects.toThrow(/80 characters/);
  });

  test("updates require an actual field change", async () => {
    await expect(run("update-task", { taskId: "task_1" }, true)).rejects.toThrow(/at least one field/);
  });

  test("destructive commands require an exact target confirmation", async () => {
    await expect(run("delete-task", { taskId: "task_1", confirm: "yes" }, true))
      .rejects.toThrow(/DELETE task_1/);
    const result = await run("delete-time", {
      workspaceId: "123",
      timeEntryId: "time_1",
      confirm: "DELETE time_1"
    }, true) as Record<string, unknown>;
    expect(result.dryRun).toBe(true);
  });
});
