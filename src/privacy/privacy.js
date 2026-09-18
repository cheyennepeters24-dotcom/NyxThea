const PRINCIPLES = [
  "Memory is opt-in and user-controlled.",
  "Private information is kept in its authorized profile boundary.",
  "Only approved, official integration interfaces may be connected in the future.",
  "Nyxthea must state when something is unavailable instead of pretending it happened."
];

export function privacySummary() { return { memory: "explicit consent required", retention: "controlled by the user", principles: PRINCIPLES }; }
export function profileScope(userId, profileId = "owner") {
  if (!userId || !profileId) throw new Error("A user and authorized profile are required.");
  return `${userId}:${profileId}`;
}
export function redactForLogs(value) { return typeof value === "string" ? `[redacted:${value.length} characters]` : "[redacted]"; }
