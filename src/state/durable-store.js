import { replaceTable, snapshotTable } from "./store.js";

export const durableTables = ["profiles", "profile_grants", "access_audit", "system_admins", "system_admin_audit", "self_audit_findings", "ci_build_runs", "memories", "person_models", "world_facts", "profile_identity", "households", "household_memberships", "profile_relationships", "profile_devices", "profile_locks", "profile_lock_challenges", "settings_authorizations", "emergency_policies", "emergency_evidence", "emergency_replays", "emergency_incidents", "experience_settings", "later_queue", "agency_jobs", "action_proposals", "learning_observations", "learning_proposals", "presence_signals", "endpoints", "domain_records", "consent_records", "integration_connections", "integration_audits", "household_items", "household_events", "goals", "experiments", "decisions", "conversation_turns", "conversation_states", "live_guide_sessions", "voice_sessions", "auth_accounts", "auth_sessions", "profile_claim_invites", "auth_rate_limits", "rate_limits", "alexa_oauth_codes", "alexa_oauth_tokens"];
const prefix = "nyxthea-state:";
const recordPrefix = (collection) => `${prefix}${collection}:`;
const recordKey = (collection, key) => `${recordPrefix(collection)}${encodeURIComponent(key)}`;
const stableJson = (value) => JSON.stringify(value);

export async function hydrateDurableState(storage) {
  const before = new Map();
  for (const collection of durableTables) {
    const records = await storage.list({ prefix: recordPrefix(collection) });
    const entries = [];
    for (const [key, value] of records) {
      const encodedKey=key.slice(recordPrefix(collection).length);let decodedKey;
      try{decodedKey=decodeURIComponent(encodedKey)}catch{continue}
      entries.push([decodedKey,value]);
    }
    replaceTable(collection, entries);
    before.set(collection, new Map(entries.map(([key, value]) => [key, stableJson(value)])));
  }
  return before;
}

export function snapshotDurableState() {
  const before = new Map();
  for (const collection of durableTables) {
    const entries = snapshotTable(collection);
    before.set(collection, new Map(entries.map(([key, value]) => [key, stableJson(value)])));
  }
  return before;
}

export async function persistDurableState(storage, before) {
  const writes = [];
  const deletes = [];
  const after = new Map();
  for (const collection of durableTables) {
    const previous = before.get(collection) || new Map();
    const currentEntries = snapshotTable(collection);
    const current = new Map(currentEntries.map(([key, value]) => [key, stableJson(value)]));
    after.set(collection, current);
    for (const [key, value] of currentEntries) {
      if (previous.get(key) !== current.get(key)) writes.push([recordKey(collection, key), value]);
    }
    for (const key of previous.keys()) {
      if (!current.has(key)) deletes.push(recordKey(collection, key));
    }
  }
  if (!writes.length && !deletes.length) return after;
  await storage.transaction(async (transaction) => {
    for (const [key, value] of writes) await transaction.put(key, value);
    for (const key of deletes) await transaction.delete(key);
  });
  return after;
}
