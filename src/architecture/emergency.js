import { id, list, now, table } from "../state/store.js";
import { trustedEndpointSignal } from "./endpoints.js";

const policies = () => table("emergency_policies");
const evidence = () => table("emergency_evidence");
const replays = () => table("emergency_replays");
const incidents = () => table("emergency_incidents");

export const EMERGENCY_TTL_MS = 5 * 60 * 1000;
export const BASIC_EMERGENCY_TYPES = [
  "i_need_help", "i_cannot_speak", "home_emergency", "intruder", "medical",
  "fire_smoke", "water_leak", "vehicle_crash", "lost_or_unsafe",
];

const workflow = [
  "attempt_communication",
  "assess_responsiveness_when_available",
  "alert_household",
  "contact_configured_emergency_contacts",
  "contact_emergency_services_when_configured_conditions_are_met",
];
const unavailableConnections = Object.freeze({
  emergencyDispatch: "not_connected",
  trustedContactMessaging: "not_connected",
  backgroundLocation: "not_connected",
  audioRecording: "not_connected",
  videoRecording: "not_connected",
  nativeEmergencyCall: "user_initiated_device_handoff",
});
const validFraction = (value, min, max) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const ownedIncident = (profileId, incidentId) => {
  const incident = incidents().get(incidentId);
  if (!incident || incident.profileId !== profileId) fail("Emergency incident not found.", 404);
  return incident;
};
const event = (kind, detail) => ({ id: id("emergency_event"), kind, detail, at: now() });

export function startBasicEmergency(profileId, input = {}) {
  if (!BASIC_EMERGENCY_TYPES.includes(input.type) || input.confirm !== true) {
    fail("A recognized emergency type and deliberate confirmation are required.");
  }
  const practice = input.practice === true;
  const createdAt = now();
  const incident = {
    id: id("emergency_incident"), profileId, type: input.type, mode: "silent",
    state: "possible_emergency", status: practice ? "practice_active" : "active",
    practice, createdAt, updatedAt: createdAt, location: null,
    capabilities: { ...unavailableConnections },
    timeline: [event(practice ? "practice_started" : "incident_started", practice
      ? "Practice mode started. No outside service or contact was notified."
      : "Incident recorded locally. Nyxthea has not contacted emergency services or trusted contacts.")],
  };
  incidents().set(incident.id, incident);
  return incident;
}

export function basicEmergencyIncidents(profileId) {
  return list("emergency_incidents", (item) => item.profileId === profileId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function recordBasicEmergencyLocation(profileId, incidentId, input = {}) {
  const incident = ownedIncident(profileId, incidentId);
  if (input.share !== true) fail("Explicit permission is required to save a location snapshot.");
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);
  const accuracy = Number(input.accuracy);
  if (!validFraction(latitude, -90, 90) || !validFraction(longitude, -180, 180) || !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100000) fail("Location snapshot is invalid.");
  const observedAt = input.observedAt || now();
  if (!Number.isFinite(new Date(observedAt).getTime())) fail("Location timestamp is invalid.");
  incident.location = { latitude, longitude, accuracy, observedAt, kind: "one_time_browser_snapshot" };
  incident.updatedAt = now();
  incident.timeline.push(event("location_saved", "One-time browser location snapshot saved. It is not background or continuous tracking."));
  incidents().set(incident.id, incident);
  return incident;
}

export function markBasicEmergencySafe(profileId, incidentId, input = {}) {
  const incident = ownedIncident(profileId, incidentId);
  if (input.confirm !== true) fail("Deliberate confirmation is required to mark an incident safe.");
  incident.status = incident.practice ? "practice_complete" : "marked_safe_locally";
  incident.state = "resolved_locally";
  incident.updatedAt = now();
  incident.timeline.push(event("marked_safe", "Marked safe in Nyxthea. This does not cancel or update emergency services."));
  incidents().set(incident.id, incident);
  return incident;
}

export function saveEmergencyPolicy(profileId, policy) {
  if (!Array.isArray(policy.requiredSignalTypes) || policy.requiredSignalTypes.length < 2 || !policy.requiredSignalTypes.every((item) => typeof item === "string" && item.length <= 80) || !validFraction(policy.minimumConfidence ?? .8, 0, 1) || !Number.isInteger(Number(policy.minimumIndependentSources ?? 2)) || Number(policy.minimumIndependentSources ?? 2) < 2 || Number(policy.minimumIndependentSources ?? 2) > 10) fail("Emergency policy fields are invalid.");
  const existing = policy.id && policies().get(policy.id);
  if (existing && existing.profileId !== profileId) fail("Emergency policy ownership mismatch.", 403);
  const saved = { id: policy.id || id("emergency_policy"), profileId, enabled: policy.enabled === true, requiredSignalTypes: [...new Set(policy.requiredSignalTypes)], minimumConfidence: Number(policy.minimumConfidence ?? .8), minimumIndependentSources: Number(policy.minimumIndependentSources ?? 2), createdAt: existing?.createdAt || now(), updatedAt: now() };
  policies().set(saved.id, saved);
  return saved;
}

export function recordEmergencyEvidence(profileId, input) {
  if (!input.eventId || typeof input.eventId !== "string" || input.eventId.length > 120 || replays().has(`${profileId}:${input.eventId}`) || !input.type || typeof input.type !== "string" || input.type.length > 80 || !validFraction(input.confidence, 0, 1)) fail("Emergency evidence is malformed or replayed.");
  const trusted = trustedEndpointSignal(profileId, input, ["microphone", "sensor", "wearable", "phone", "vehicle"]);
  const observedAt = input.observedAt || now();
  const timestamp = new Date(observedAt).getTime();
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > EMERGENCY_TTL_MS) fail("Emergency evidence is stale or has an invalid timestamp.");
  const item = { id: id("emergency_evidence"), profileId, eventId: input.eventId, sourceId: trusted.sourceId, endpointKind: trusted.endpointKind, type: input.type, confidence: Number(input.confidence), provenance: trusted.provenance, observedAt, expiresAt: new Date(timestamp + EMERGENCY_TTL_MS).toISOString() };
  evidence().set(item.id, item);
  replays().set(`${profileId}:${input.eventId}`, item.expiresAt);
  return item;
}

export function evaluateEmergency({ signals = [], policy } = {}) {
  if (!policy?.enabled) return { triggered: false, reason: "No authorized emergency policy is enabled.", actions: [] };
  const current = Date.now();
  const qualifying = signals.filter((signal) => signal.provenance === "registered_endpoint" && Number(signal.confidence) >= policy.minimumConfidence && policy.requiredSignalTypes.includes(signal.type) && new Date(signal.expiresAt).getTime() > current);
  const types = new Set(qualifying.map((signal) => signal.type));
  const sources = new Set(qualifying.map((signal) => signal.sourceId));
  if (types.size < policy.requiredSignalTypes.length || sources.size < policy.minimumIndependentSources) return { triggered: false, reason: "Fresh independent trusted evidence threshold was not met.", actions: [] };
  return { triggered: true, reason: "Fresh independent trusted evidence threshold was met.", actions: workflow.map((step) => ({ step, status: "proposal_only_requires_authorized_active_connection" })) };
}

export function evaluateSavedEmergency(profileId, policyId) {
  const policy = policies().get(policyId);
  if (!policy || policy.profileId !== profileId) fail("Emergency policy not found.", 404);
  return evaluateEmergency({ policy, signals: list("emergency_evidence", (item) => item.profileId === profileId) });
}
