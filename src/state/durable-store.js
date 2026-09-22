import { replaceTable, snapshotTable } from "./store.js";

export const durableTables = ["profiles", "profile_grants", "access_audit", "memories", "person_models"];
let requestQueue = Promise.resolve();
const stableJson = (value) => JSON.stringify(value);

function rowsFrom(result) {
  if (Array.isArray(result?.results)) return result.results;
  return Array.isArray(result) ? result : [];
}

async function load(db) {
  const placeholders = durableTables.map(() => "?").join(", ");
  const result = await db.prepare(
    `SELECT collection, record_key, value FROM nyxthea_state WHERE collection IN (${placeholders})`,
  ).bind(...durableTables).all();
  const grouped = new Map(durableTables.map((name) => [name, []]));
  for (const row of rowsFrom(result)) {
    if (!grouped.has(row.collection)) continue;
    try { grouped.get(row.collection).push([row.record_key, JSON.parse(row.value)]); } catch { /* A corrupt row is never exposed as valid state. */ }
  }
  for (const [name, entries] of grouped) replaceTable(name, entries);
  return new Map(durableTables.map((name) => [name, new Map(snapshotTable(name).map(([key, value]) => [key, stableJson(value)]))]));
}

async function persist(db, before) {
  const statements = [];
  const timestamp = new Date().toISOString();
  for (const collection of durableTables) {
    const previous = before.get(collection) || new Map();
    const current = new Map(snapshotTable(collection).map(([key, value]) => [key, stableJson(value)]));
    for (const [key, value] of current) {
      if (previous.get(key) === value) continue;
      statements.push(db.prepare(
        "INSERT INTO nyxthea_state (collection, record_key, value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(collection, record_key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
      ).bind(collection, key, value, timestamp));
    }
    for (const key of previous.keys()) {
      if (!current.has(key)) statements.push(db.prepare(
        "DELETE FROM nyxthea_state WHERE collection = ? AND record_key = ?",
      ).bind(collection, key));
    }
  }
  if (statements.length) await db.batch(statements);
}

async function runWithD1(db, operation) {
  const before = await load(db);
  try { return await operation({ durable: true }); }
  finally { await persist(db, before); }
}

export function withDurableState(env, operation) {
  const db = env?.NYXTHEA_DB;
  if (!db?.prepare || !db?.batch) return operation({ durable: false });
  const run = requestQueue.then(() => runWithD1(db, operation));
  requestQueue = run.catch(() => undefined);
  return run;
}
