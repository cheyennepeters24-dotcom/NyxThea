import test from "node:test";
import assert from "node:assert/strict";
import { withDurableState } from "../state/durable-store.js";
import { resetStateForTests, table } from "../state/store.js";
import { remember, inspect, forget } from "../memory/memory.js";

class FakeStatement {
  constructor(db, sql) { this.db = db; this.sql = sql; this.args = []; }
  bind(...args) { this.args = args; return this; }
  async all() {
    const allowed = new Set(this.args);
    return { results: [...this.db.rows.values()].filter((row) => allowed.has(row.collection)) };
  }
  async run() {
    if (this.sql.startsWith("INSERT")) {
      const [collection, record_key, value, updated_at] = this.args;
      this.db.rows.set(`${collection}:${record_key}`, { collection, record_key, value, updated_at });
    } else if (this.sql.startsWith("DELETE")) {
      const [collection, record_key] = this.args;
      this.db.rows.delete(`${collection}:${record_key}`);
    }
    return { success: true };
  }
}

class FakeD1 {
  constructor() { this.rows = new Map(); }
  prepare(sql) { return new FakeStatement(this, sql); }
  async batch(statements) { return Promise.all(statements.map((statement) => statement.run())); }
}

test("D1 restores profiles, permissions, settings, audit records, and scoped memories", async () => {
  resetStateForTests();
  const db = new FakeD1();
  await withDurableState({ NYXTHEA_DB: db }, async () => {
    table("profiles").set("owner", { id: "owner", permissions: ["household_admin"] });
    table("profile_grants").set("grant_1", { id: "grant_1", from: "owner", to: "child", domain: "preferences", active: true });
    table("person_models").set("owner", { profileId: "owner", preferences: { theme: "sapphire" } });
    table("access_audit").set("access_1", { id: "access_1", profileId: "owner", action: "POST /api/memories" });
    remember("local-user:owner", "Keep the celestial rose interface", "long_term");
  });

  resetStateForTests();
  await withDurableState({ NYXTHEA_DB: db }, async () => {
    assert.deepEqual(table("profiles").get("owner").permissions, ["household_admin"]);
    assert.equal(table("profile_grants").get("grant_1").active, true);
    assert.equal(table("person_models").get("owner").preferences.theme, "sapphire");
    assert.equal(table("access_audit").get("access_1").action, "POST /api/memories");
    assert.equal(inspect("local-user:owner")[0].text, "Keep the celestial rose interface");
    forget("local-user:owner", inspect("local-user:owner")[0].id);
  });

  resetStateForTests();
  await withDurableState({ NYXTHEA_DB: db }, async () => {
    assert.equal(inspect("local-user:owner").length, 0);
  });
});
