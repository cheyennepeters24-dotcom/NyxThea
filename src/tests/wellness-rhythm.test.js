import test from "node:test";
import assert from "node:assert/strict";
import { grantConsent, listRecords } from "../domains/records.js";
import { createDailyLog, logChore, logMeal, logMovement, markSideways, summarizeDay } from "../capabilities/daily-rhythm.js";
import { saveDailyRhythm, saveWearableSnapshot } from "../capabilities/wellness-rhythm.js";

test("daily rhythm persists into the existing wellness domain", () => {
  const profileId = "wellness-rhythm-user";
  const day = createDailyLog({ date: new Date("2026-09-24T12:00:00Z"), mode: "structured" });
  logMeal(day, { kind: "smoothie", description: "protein smoothie" });
  logMovement(day, { type: "walk", minutes: 20, distanceMiles: 1 });
  logChore(day, { name: "laundry", minutes: 15 });
  markSideways(day, "family drive");
  saveDailyRhythm(profileId, day, summarizeDay(day));
  const records = listRecords(profileId, "wellness");
  assert.equal(records.some((r) => r.type === "meal"), true);
  assert.equal(records.some((r) => r.type === "movement"), true);
  assert.equal(records.some((r) => r.type === "chore"), true);
  assert.equal(records.some((r) => r.type === "daily_summary" && r.data.wentSideways), true);
});

test("connected wearable data requires wellness consent and preserves provenance", () => {
  const profileId = "wearable-user";
  assert.throws(() => saveWearableSnapshot(profileId, { provider: "garmin", consentId: "missing", steps: 1000 }), /consent/i);
  const consent = grantConsent(profileId, { domain: "wellness", source: "garmin", scopes: ["steps", "activity"] });
  const record = saveWearableSnapshot(profileId, { provider: "garmin", consentId: consent.id, steps: 4321, activeMinutes: 38 });
  assert.equal(record.data.provider, "garmin");
  assert.equal(record.data.provenance, "connected_device");
  assert.equal(record.data.metrics.steps, 4321);
});
