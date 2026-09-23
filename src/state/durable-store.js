import { replaceTable, snapshotTable } from "./store.js";

export const durableTables = ["profiles", "profile_grants", "access_audit", "memories", "person_models", "profile_identity", "households", "household_memberships", "profile_relationships", "profile_devices", "emergency_policies", "emergency_incidents", "experience_settings", "later_queue", "agency_jobs", "auth_accounts", "auth_sessions", "profile_claim_invites", "auth_rate_limits", "voice_transcription_limits", "alexa_oauth_codes", "alexa_oauth_tokens"];
const prefix = "nyxthea-state:";
const recordPrefix = (collection) => `${prefix}${collection}:`;
const recordKey = (collection, key) => `${recordPrefix(collection)}${encodeURIComponent(key)}`;
const stableJson = (value) => JSON.stringify(value);

export async function hydrateDurableState(storage) {
  const before = new Map();
  for (const collection of durableTables) {
    const records = await storage.list({ prefix: recordPrefix(collection) });
    const entries = [];
    for (const [key, value] of records) entries.push([
      decodeURIComponent(key.slice(recordPrefix(collection).length)),
      value,
    ]);
    replaceTable(collection, entries);
    before.set(collection, new Map(entries.map(([key, value]) => [key, stableJson(value)])));
  }
  return before;
}

export async function persistDurableState(storage, before) {
  const writes = [];
  const deletes = [];
  for (const collection of durableTables) {
    const previous = before.get(collection) || new Map();
    const currentEntries = snapshotTable(collection);
    const current = new Map(currentEntries.map(([key, value]) => [key, stableJson(value)]));
    for (const [key, value] of currentEntries) {
      if (previous.get(key) !== stableJson(value)) writes.push([recordKey(collection, key), value]);
    }
    for (const key of previous.keys()) {
      if (!current.has(key)) deletes.push(recordKey(collection, key));
    }
  }
  if (!writes.length && !deletes.length) return;
  await storage.transaction(async (transaction) => {
    for (const [key, value] of writes) await transaction.put(key, value);
    for (const key of deletes) await transaction.delete(key);
  });
}
