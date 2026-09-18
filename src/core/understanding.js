export function understand(message) {
  const text = (message || "").trim();
  if (!text) return { intent: "empty", text: "" };
  if (/\b(remember|save this|memorize)\b/i.test(text)) return { intent: "remember", text };
  if (/\b(forget|delete memory|remove memory)\b/i.test(text)) return { intent: "forget", text };
  if (/\b(research|look up|search|wikipedia|who is|what is)\b/i.test(text)) return { intent: "research", text };
  return { intent: "conversation", text };
}
