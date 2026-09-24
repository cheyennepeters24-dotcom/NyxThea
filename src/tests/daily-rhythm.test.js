import test from "node:test";
import assert from "node:assert/strict";
import {
  createDailyLog,
  dayMode,
  logMeal,
  logMovement,
  logChore,
  markSideways,
  attachWearable,
  planForDay,
  summarizeDay
} from "../capabilities/daily-rhythm.js";

test("Monday through Thursday are structured; Friday through Sunday flex", () => {
  assert.equal(dayMode(new Date("2026-09-24T12:00:00-07:00")), "structured");
  assert.equal(dayMode(new Date("2026-09-25T12:00:00-07:00")), "flex");
  assert.equal(dayMode(new Date("2026-09-27T12:00:00-07:00")), "flex");
});

test("sideways day adapts without catch-up", () => {
  const day = createDailyLog({ date: new Date("2026-09-24T12:00:00-07:00") });
  markSideways(day, "Family drive changed dinner and chores");
  const plan = planForDay(day);
  assert.equal(plan.mode, "flex");
  assert.match(plan.message, /No catch-up workout/);
});

test("food, chores, movement and wearable data contribute to one daily log", () => {
  const day = createDailyLog({ date: new Date("2026-09-24T12:00:00-07:00") });
  logMeal(day, { kind: "dinner", input: "photo", description: "spaghetti and garlic bread", imageRef: "meal-1" });
  logMovement(day, { type: "school walk", minutes: 22, distanceMiles: 1 });
  logChore(day, { name: "laundry", stairs: 4 });
  attachWearable(day, { provider: "apple-health", steps: 6200, activeMinutes: 31 });
  assert.deepEqual(summarizeDay(day), {
    mode: "structured",
    wentSideways: false,
    mealsLogged: 1,
    movementEntries: 1,
    choresCompleted: 1,
    totalLoggedMovementMinutes: 22,
    wearableSteps: 6200
  });
});

test("dizziness or back pain switches to recovery instead of pushing exercise", () => {
  const day = createDailyLog();
  assert.equal(planForDay(day, { dizzy: true }).mode, "recovery");
  assert.equal(planForDay(day, { backPain: true }).workout, false);
});
