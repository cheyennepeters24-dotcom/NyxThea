import { id, list, now, table } from "../state/store.js";

export const LIVE_GUIDE_MODEL = "@cf/google/gemma-4-26b-a4b-it";
const SESSION_TTL_MS = 30 * 60 * 1000;
const allowedSources = new Set(["camera", "screen", "microphone"]);
const dangerousObjective = /\b(mains? voltage|breaker panel|electrical panel|live wire|gas leak|gas line|weapon|firearm|explosive|medical emergency|surgery|overdose|suicid|jack stand|under (?:a |the )?vehicle|disable (?:a )?safety|bypass (?:a )?lock)\b/i;
const schoolworkRequest = /\b(homework|schoolwork|assignment|worksheet|essay|quiz|exam|test question|classwork|coursework|grade(?:d)? work|fix (?:my|the) (?:answer|answers|work|mistake|mistakes|error|errors)|check (?:my|the) answers?|give me (?:the )?answers?|solve (?:this|it|these) for me)\b/i;
const answerLeak = /(?:\b(?:the (?:correct )?answer is|answer\s*:|write\s+(?:this|that)|submit\s+(?:this|that)|change\s+.+\s+to|it should be|equals?)\b\s*[-+]?\d*|=\s*[-+]?\d)/i;
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
    audience: session.audience,
    guidanceMode: session.guidanceMode,
    analysis: session.analysis,
    observationCount: session.observationCount,
    lastGuidance: session.lastGuidance,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    mediaRetention: "Raw camera, screen, and microphone data is not stored by Nyxthea.",
  };
}

export function startLiveGuide(profileId, input, { visionAvailable = false, profileRole = "adult" } = {}) {
  const objective = clean(input.objective, 500);
  if (!objective) fail("Describe what you want Nyxthea to help you fix.");
  if (input.confirm !== true) fail("Explicit permission is required before Live Guide can view or listen.", 403);
  const sources = [...new Set(Array.isArray(input.sources) ? input.sources : [])].filter((source) => allowedSources.has(source));
  if (!sources.length) fail("Choose camera, screen, or microphone access for this session.");
  const highRisk = dangerousObjective.test(objective);
  const schoolwork = schoolworkRequest.test(objective);
  const createdAt = now();
  const session = {
    id: id("guide"), profileId, objective, sources, status: highRisk ? "safety_hold" : "active",
    audience: profileRole === "child" ? "child" : "adult",
    guidanceMode: schoolwork ? "guided_learning" : profileRole === "child" ? "child_safe" : "general",
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
    mode: value?.mode === "guided_learning" ? "guided_learning" : "general",
    observation: clean(value?.observation, 700) || "Nyxthea analyzed the current view but could not confidently summarize it.",
    nextStep: clean(value?.nextStep, 900) || raw || "Adjust the view and ask Nyxthea to check again.",
    verification: clean(value?.verification, 700) || "Show the result before continuing.",
    caution: clean(value?.caution, 700) || "Do not continue if anything looks unsafe or differs from the instructions.",
    confidence: ["low", "medium", "high"].includes(value?.confidence) ? value.confidence : "low",
    risk: ["normal", "caution", "stop"].includes(value?.risk) ? value.risk : "caution",
  };
}

function enforceLearningIntegrity(guidance, required) {
  if (!required && guidance.mode !== "guided_learning") return guidance;
  return {
    ...guidance,
    mode: "guided_learning",
    observation: answerLeak.test(guidance.observation) ? "One or more items need another look." : guidance.observation,
    nextStep: answerLeak.test(guidance.nextStep) ? "Return to the first item Nyxthea flagged and explain which rule or idea you think applies before trying it again." : guidance.nextStep,
    caution: "Nyxthea can identify what needs another look and offer a hint, but it will not provide or correct the answer.",
  };
}

export async function analyzeLiveGuide(profileId, sessionId, input, { ai } = {}) {
  const session = owned(profileId, sessionId);
  if (session.status === "safety_hold") return { session: publicSession(session), guidance: { observation: "The requested task is high risk.", nextStep: session.safety.message, verification: "Do not begin the task.", caution: session.safety.message, confidence: "high", risk: "stop" } };
  if (session.status !== "active") fail(`This Live Guide session is ${session.status}.`, 409);
  const image = clean(input.image, 1_900_000);
  const transcript = clean(input.transcript, 1200);
  const note = clean(input.note, 1200);
  if (schoolworkRequest.test(`${session.objective}\n${transcript}\n${note}`)) session.guidanceMode = "guided_learning";
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
    `Audience: ${session.audience}. Guidance mode: ${session.guidanceMode}.`,
    "Never claim certainty from an unclear image. Never instruct work on live electricity, gas, weapons, fire, medical emergencies, or going under a raised vehicle. If danger is visible or suspected, set risk to stop and tell the user to stop.",
    "Children may use Live Guide for chores, routines, and learning. If the view is schoolwork, identify which question or area needs another look and the broad kind of issue (for example: sign, skipped step, rule, reasoning, or missing evidence), then explain the relevant concept and give one hint or guiding question. Never reveal a corrected answer, solve a problem, rewrite a response, or complete work for the user. Set mode to guided_learning whenever schoolwork is visible.",
    'Return only JSON with keys: mode (general|guided_learning), observation, nextStep, verification, caution, confidence (low|medium|high), risk (normal|caution|stop).',
  ].filter(Boolean).join("\n");
  const content = image ? [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] : prompt;
  const response = await ai.run(LIVE_GUIDE_MODEL, { messages: [{ role: "user", content }], max_completion_tokens: 420, temperature: 0.1, response_format: { type: "json_object" }, store: false });
  const guidance = enforceLearningIntegrity(parseGuidance(response), session.guidanceMode === "guided_learning");
  if (guidance.mode === "guided_learning") session.guidanceMode = "guided_learning";
  if (guidance.risk === "stop") session.status = "safety_hold";
  session.observationCount += 1;
  session.lastGuidance = { ...guidance, observedAt: now() };
  return { session: publicSession(session), guidance, mediaRetention: "The submitted frame and transcript were analyzed for this response and were not written to Nyxthea storage." };
}
