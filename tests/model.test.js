import test from "node:test";
import assert from "node:assert/strict";
import {
  records,
  projects,
  selectRecords,
  metrics,
  selectProjects,
  csv,
} from "../src/model.js";
test("unit totals reconcile with organization totals", () => {
  const total = metrics(records);
  const parts = ["product", "sales", "operations"].map((u) =>
    metrics(selectRecords(u)),
  );
  for (const key of ["revenue", "cost", "target", "profit"])
    assert.equal(
      parts.reduce((s, p) => s + p[key], 0),
      total[key],
    );
  assert.equal(total.profit, total.revenue - total.cost);
});
test("period filter changes totals and includes correct months", () => {
  const last = selectRecords("all", 1);
  assert.equal(last.length, 3);
  assert.ok(last.every((r) => r.month === 5));
  assert.ok(metrics(last).revenue < metrics(records).revenue);
  assert.equal(selectRecords("sales", 3).length, 3);
});
test("project filtering composes search, unit, period and status", () => {
  assert.deepEqual(
    selectProjects({
      unit: "sales",
      range: 3,
      status: "risk",
      query: "بازطراحی",
    }).map((p) => p.id),
    ["DB-102"],
  );
  assert.equal(selectProjects({ query: "NO MATCH" }).length, 0);
  assert.equal(selectProjects({ query: "db-101" }).length, 1);
});
test("empty metrics are finite and zero", () =>
  assert.deepEqual(metrics([]), {
    revenue: 0,
    cost: 0,
    profit: 0,
    margin: 0,
    target: 0,
    attainment: 0,
  }));
test("CSV preserves unicode, quotes, newlines and neutralizes formulas", () => {
  const result = csv([
    ["نام", "مقدار"],
    ["الف، ب", '"سلام"'],
    ['=HYPERLINK("x")', "line\nnext"],
  ]);
  assert.ok(result.startsWith("\uFEFF"));
  assert.ok(result.includes('""سلام""'));
  assert.ok(result.includes("\"'=HYPERLINK"));
  assert.ok(result.includes('"line\nnext"'));
});
test("demo project IDs unique and progress bounded", () => {
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  assert.ok(
    projects.every(
      (p) =>
        p.progress >= 0 &&
        p.progress <= 100 &&
        p.budget > 0 &&
        p.spent >= 0 &&
        p.done <= p.tasks.length,
    ),
  );
});
