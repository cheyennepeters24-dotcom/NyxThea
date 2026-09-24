import { activeConsent, createRecord, listRecords } from "../domains/records.js";

const CONNECTED_SOURCES = new Set(["apple-health", "garmin"]);
const WELLNESS_TYPES = new Set([
  "meal", "movement", "chore", "symptom_checkin", "measurement", "daily_summary", "wearable_snapshot"
]);

function requireProfile(profileId) {
  if (!profileId) throw Object.assign(new Error("A profile is required for wellness data."), { status: 400 });
}

export function saveWellnessEntry(profileId, type, data = {}) {
  requireProfile(profileId);
  if (!WELLNESS_TYPES.has(type)) throw Object.assign(new Error("Unsupported wellness record type."), { status: 400 });
  return createRecord(profileId, "wellness", type, { ...data, provenance: "user" });
}

export function saveWearableSnapshot(profileId, { provider, consentId, ...metrics }) {
  requireProfile(profileId);
  if (!CONNECTED_SOURCES.has(provider)) throw Object.assign(new Error("Unsupported wearable provider."), { status: 400 });
  if (!activeConsent(profileId, consentId, "wellness")) throw Object.assign(new Error("Active wellness consent is required for connected data."), { status: 403 });
  return createRecord(profileId, "wellness", "wearable_snapshot", {
    provider,
    metrics,
    provenance: "connected_device",
    consentId
  });
}

export function saveDailyRhythm(profileId, day, summary) {
  requireProfile(profileId);
  const records = [];
  for (const meal of day.meals || []) records.push(saveWellnessEntry(profileId, "meal", meal));
  for (const movement of day.movement || []) records.push(saveWellnessEntry(profileId, "movement", movement));
  for (const chore of day.chores || []) records.push(saveWellnessEntry(profileId, "chore", chore));
  for (const symptom of day.symptoms || []) records.push(saveWellnessEntry(profileId, "symptom_checkin", symptom));
  for (const measurement of day.measurements || []) records.push(saveWellnessEntry(profileId, "measurement", measurement));
  records.push(saveWellnessEntry(profileId, "daily_summary", {
    date: day.date,
    mode: day.mode,
    wentSideways: Boolean(day.wentSideways),
    sidewaysReason: day.sidewaysReason || "",
    summary
  }));
  return records;
}

export function wellnessTimeline(profileId) {
  requireProfile(profileId);
  return listRecords(profileId, "wellness").sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}
