import test from "node:test";
import assert from "node:assert/strict";
import { hydrateDurableState, persistDurableState } from "../state/durable-store.js";
import { resetStateForTests, table } from "../state/store.js";
import { remember, inspect, forget } from "../memory/memory.js";

class FakeStorage {
  constructor() { this.rows = new Map(); }
  async list({ prefix }) { return new Map([...this.rows].filter(([key]) => key.startsWith(prefix))); }
  async put(key, value) { this.rows.set(key, structuredClone(value)); }
  async delete(key) { return this.rows.delete(key); }
  async transaction(callback) { return callback(this); }
}

test("Durable Object storage restores profiles, permissions, settings, audit records, and scoped memories", async () => {
  resetStateForTests();
  const storage = new FakeStorage();
  let before = await hydrateDurableState(storage);
  table("profiles").set("owner", { id: "owner", permissions: ["household_admin"] });
  table("profile_grants").set("grant_1", { id: "grant_1", from: "owner", to: "child", domain: "preferences", active: true });
  table("person_models").set("owner", { profileId: "owner", preferences: { theme: "sapphire" } });
  table("access_audit").set("access_1", { id: "access_1", profileId: "owner", action: "POST /api/memories" });
  table("emergency_policies").set("policy_1", { id: "policy_1", profileId: "owner", enabled: true });
  table("emergency_incidents").set("incident_1", { id: "incident_1", profileId: "owner", status: "active" });
  remember("local-user:owner", "Keep the celestial rose interface", "long_term");
  await persistDurableState(storage, before);

  resetStateForTests();
  before = await hydrateDurableState(storage);
  assert.deepEqual(table("profiles").get("owner").permissions, ["household_admin"]);
  assert.equal(table("profile_grants").get("grant_1").active, true);
  assert.equal(table("person_models").get("owner").preferences.theme, "sapphire");
  assert.equal(table("access_audit").get("access_1").action, "POST /api/memories");
  assert.equal(table("emergency_policies").get("policy_1").enabled, true);
  assert.equal(table("emergency_incidents").get("incident_1").status, "active");
  assert.equal(inspect("local-user:owner")[0].text, "Keep the celestial rose interface");
  forget("local-user:owner", inspect("local-user:owner")[0].id);
  await persistDurableState(storage, before);

  resetStateForTests();
  await hydrateDurableState(storage);
  assert.equal(inspect("local-user:owner").length, 0);
});
