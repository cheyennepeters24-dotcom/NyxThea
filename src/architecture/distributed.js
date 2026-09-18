/** Platform-neutral model for one Nyxthea intelligence with many authorized endpoints. */
export const endpointKinds = ["microphone", "speaker", "screen", "sensor", "phone", "vehicle", "wearable", "computer", "tv"];

export function describeDistributedSystem() {
  return {
    model: "one intelligence, many authorized interfaces",
    state: "designed_not_connected",
    rules: [
      "Every signal carries a source identifier and confidence.",
      "Uncertain signals are retained as uncertain; they do not become facts.",
      "An endpoint is an interface to Nyxthea, not a separate intelligence."
    ]
  };
}

export function normalizeSignal({ sourceId, kind, confidence = 0, observedAt = new Date().toISOString(), payload = null }) {
  if (!sourceId || !endpointKinds.includes(kind)) throw new Error("An authorized source identifier and supported endpoint kind are required.");
  const boundedConfidence = Number(confidence);
  if (!Number.isFinite(boundedConfidence) || boundedConfidence < 0 || boundedConfidence > 1) throw new Error("Signal confidence must be between 0 and 1.");
  return { sourceId, kind, confidence: boundedConfidence, observedAt, payload, certainty: boundedConfidence >= 0.8 ? "high" : boundedConfidence >= 0.5 ? "limited" : "uncertain" };
}
