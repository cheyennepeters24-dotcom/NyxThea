import { id, list, now, table } from "../state/store.js";

export const LIVE_GUIDE_MODEL = "@cf/google/gemma-4-26b-a4b-it";
const SESSION_TTL_MS = 30 * 60 * 1000;
const allowedSources = new Set(["camera", "screen", "microphone"]);
const dangerousObjective = /\b(mains? voltage|breaker panel|electrical panel|live wire|gas leak|gas line|weapon|firearm|explosive|medical emergency|surgery|overdose|suicid|jack stand|under (?:a |the )?vehicle|disable (?:a )?safety|bypass (?:a )?lock)\b/i;
const sessions = () => table("live_guide_sessions");
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const clean = (value, max = 800) => typeof value === "string" ? value.trim().slice(0, max) : "";

function owned(profileId, sessionId) {
  const session = sessions().get(sessionId);
  if (!session) fail("Live Guide session not found.", 404);
  if (session.profileId !== profileId) fail("This Live Guide session belongs to another profile.", 403);
  if (session.status === "active" && Date.now() >= Date.parse(session.expiresAt)) session.status = "expired";
  return session;
}

function publicSession(session) {
  return {
    id: session.id,
    objective: session.objective,
    sources: [...session.sources],
    status: session.status,
    safety: session.safety,
    analysis: session.analysis,
    observationCount: session.observationCount,
    lastGuidance: session.lastGuidance,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    mediaRetention: "Raw camera, screen, and microphone data is not stored by Nyxthea.",
  };
}

export function startLiveGuide(profileId, input, { visionAvailable = false } = {}) {
  const objective = clean(input.objective, 500);
  if (!objective) fail("Describe what you want Nyxthea to help you fix.");
  if (input.confirm !== true) fail("Explicit permission is required before Live Guide can view or listen.", 403);
  const sources = [...new Set(Array.isArray(input.sources) ? input.sources : [])].filter((source) => allowedSources.has(source));
  if (!sources.length) fail("Choose camera, screen, or microphone access for this session.");
  const highRisk = dangerousObjective.test(objective);
  const createdAt = now();
  const session = {
    id: id("guide"), profileId, objective, sources, status: highRisk ? "safety_hold" : "active",
    safety: highRisk ? { level: "stop", message: "Nyxthea cannot visually coach this high-risk task. Stop and contact a qualified professional or emergency service." } : { level: "normal", message: "Keep control of every action and stop if the situation becomes unsafe." },
    analysis: visionAvailable ? "vision_ready" : "vision_unavailable",
    observationCount: 0, lastGuidance: null, createdAt,
    expiresAt: new Date(Date.parse(createdAt) + SESSION_TTL_MS).toISOString(),
  };
  sessions().set(session.id, session);
  return publicSession(session);
}

export function liveGuideSessions(profileId) {
  return list("live_guide_sessions", (session) => session.profileId === profileId).map((session) => publicSession(owned(profileId, session.id)));
}

export function stopLiveGuide(profileId, sessionId) {
  const session = owned(profileId, sessionId);
  session.status = "ended";
  session.endedAt = now();
  return publicSession(session);
}

function parseGuidance(response) {
  const raw = clean(response?.response ?? response?.choices?.[0]?.message?.content ?? response?.result ?? response, 4000);
  let value = null;
  try { value = JSON.parse(raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")); } catch { /* Plain text remains usable as one bounded step. */ }
  return {
    observation: clean(value?.observation, 700) || "Nyxthea analyzed the current view but could not confidently summarize it.",
    nextStep: clean(value?.nextStep, 900) || raw || "Adjust the view and ask Nyxthea to check again.",
    verification: clean(value?.verification, 700) || "Show the result before continuing.",
    caution: clean(value?.caution, 700) || "Do not continue if anything looks unsafe or differs from the instructions.",
    confidence: ["low", "medium", "high"].includes(value?.confidence) ? value.confidence : "low",
    risk: ["normal", "caution", "stop"].includes(value?.risk) ? value.risk : "caution",
  };
}

export async function analyzeLiveGuide(profileId, sessionId, input, { ai } = {}) {
  const session = owned(profileId, sessionId);
  if (session.status === "safety_hold") return { session: publicSession(session), guidance: { observation: "The requested task is high risk.", nextStep: session.safety.message, verification: "Do not begin the task.", caution: session.safety.message, confidence: "high", risk: "stop" } };
  if (session.status !== "active") fail(`This Live Guide session is ${session.status}.`, 409);
  const image = clean(input.image, 1_900_000);
  const transcript = clean(input.transcript, 1200);
  const note = clean(input.note, 1200);
  if (!image && !transcript && !note) fail("Provide a current camera/screen snapshot, spoken transcript, or note.");
  if (image && !session.sources.some((source) => source === "camera" || source === "screen")) fail("Camera or screen permission was not granted for this session.", 403);
  if (transcript && !session.sources.includes("microphone")) fail("Microphone permission was not granted for this session.", 403);
  if (image && !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) fail("The snapshot must be a JPEG, PNG, or WebP data URL.");
  if (!ai?.run) fail("Live visual analysis is not available because the AI binding is not connected.", 503);
  const prompt = [
    "You are Nyxthea Live Guide. Inspect the current view and give exactly one safe, reversible step.",
    `User objective: ${session.objective}`,
    transcript ? `What the user said or the microphone transcribed: ${transcript}` : "",
    note ? `User note: ${note}` : "",
    session.lastGuidance ? `Previous step: ${session.lastGuidance.nextStep}` : "This is the first observation.",
    "Never claim certainty from an unclear image. Never instruct work on live electricity, gas, weapons, fire, medical emergencies, or going under a raised vehicle. If danger is visible or suspected, set risk to stop and tell the user to stop.",
    'Return only JSON with keys: observation, nextStep, verification, caution, confidence (low|medium|high), risk (normal|caution|stop).',
  ].filter(Boolean).join("\n");
  const content = image ? [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] : prompt;
  const response = await ai.run(LIVE_GUIDE_MODEL, { messages: [{ role: "user", content }], max_completion_tokens: 420, temperature: 0.1, response_format: { type: "json_object" }, store: false });
  const guidance = parseGuidance(response);
  if (guidance.risk === "stop") session.status = "safety_hold";
  session.observationCount += 1;
  session.lastGuidance = { ...guidance, observedAt: now() };
  return { session: publicSession(session), guidance, mediaRetention: "The submitted frame and transcript were analyzed for this response and were not written to Nyxthea storage." };
}
