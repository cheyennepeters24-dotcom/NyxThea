const STRUCTURED_DAYS = new Set([1, 2, 3, 4]); // Mon-Thu

export const DEFAULT_RHYTHM = Object.freeze({
  checkInTime: "10:30",
  structuredDays: [1, 2, 3, 4],
  flexDays: [5, 6, 0],
  anchors: {
    morning: ["coffee", "supplement", "protein smoothie"],
    workout: "15-20 minute bodyweight session",
    lunch: "13:00-14:00",
    dinner: "17:00-19:00",
    bedtime: "21:00-22:00"
  },
  movementSources: ["workout", "walking", "stairs", "chores", "wearable"],
  wearableSources: ["apple-health", "garmin"],
  mealInputs: ["photo", "manual"],
  principle: "Continue; never punish a missed day with catch-up exercise."
});

export function dayMode(date = new Date()) {
  return STRUCTURED_DAYS.has(date.getDay()) ? "structured" : "flex";
}

export function createDailyLog({ date = new Date(), mode = dayMode(date) } = {}) {
  return {
    date: date.toISOString().slice(0, 10),
    mode,
    wentSideways: false,
    sidewaysReason: "",
    meals: [],
    movement: [],
    chores: [],
    work: [],
    checkIns: [],
    symptoms: [],
    measurements: [],
    wearable: null
  };
}

export function logMeal(day, meal) {
  day.meals.push({
    at: meal.at || new Date().toISOString(),
    kind: meal.kind || "meal",
    input: meal.input || "manual",
    description: meal.description || "",
    imageRef: meal.imageRef || null
  });
  return day;
}

export function logMovement(day, movement) {
  day.movement.push({
    at: movement.at || new Date().toISOString(),
    type: movement.type || "activity",
    minutes: movement.minutes ?? null,
    distanceMiles: movement.distanceMiles ?? null,
    source: movement.source || "manual",
    note: movement.note || ""
  });
  return day;
}

export function logChore(day, chore) {
  day.chores.push({
    at: chore.at || new Date().toISOString(),
    name: chore.name,
    done: chore.done !== false,
    stairs: chore.stairs ?? null,
    minutes: chore.minutes ?? null
  });
  return day;
}

export function markSideways(day, reason = "Life changed today's plan") {
  day.wentSideways = true;
  day.sidewaysReason = reason;
  return day;
}

export function attachWearable(day, payload) {
  day.wearable = {
    provider: payload.provider,
    steps: payload.steps ?? null,
    distanceMiles: payload.distanceMiles ?? null,
    activeMinutes: payload.activeMinutes ?? null,
    workouts: payload.workouts || [],
    heartRate: payload.heartRate || null,
    syncedAt: payload.syncedAt || new Date().toISOString()
  };
  return day;
}

export function planForDay(day, { energy = "normal", sore = false, dizzy = false, backPain = false } = {}) {
  const safetyLimited = dizzy || backPain;
  if (safetyLimited) {
    return {
      mode: "recovery",
      workout: false,
      priorities: ["food and fluids", "essential household tasks only", "rest/reassess symptoms"],
      message: "Skip the planned workout today; do not push through dizziness or back pain."
    };
  }

  if (day.wentSideways || day.mode === "flex") {
    return {
      mode: "flex",
      workout: !sore && energy !== "low",
      priorities: ["one useful movement anchor if it fits", "family/life plans", "normal meals"],
      message: "No catch-up workout. Continue with the next normal day."
    };
  }

  return {
    mode: "structured",
    workout: !sore && energy !== "low",
    priorities: ["morning fuel", "household movement", "focused work block", "workout", "lunch", "afternoon chores/walk", "dinner"],
    message: sore || energy === "low" ? "Use an easier movement day." : "Use the normal structured routine."
  };
}

export function summarizeDay(day) {
  return {
    mode: day.mode,
    wentSideways: day.wentSideways,
    mealsLogged: day.meals.length,
    movementEntries: day.movement.length,
    choresCompleted: day.chores.filter((c) => c.done).length,
    totalLoggedMovementMinutes: day.movement.reduce((n, m) => n + (Number(m.minutes) || 0), 0),
    wearableSteps: day.wearable?.steps ?? null
  };
}
