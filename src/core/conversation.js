const MODEL = "@cf/google/gemma-4-26b-a4b-it";
export async function converse(ai, message, context) {
  if (/^(?:(?:hey|hi|hello)(?:\s+there)?[,.! ]*)?(?:(?:nyxthea|nyx|nixie)[,.! ]*)?(?:how are you|how's it going|how are things)\??[.! ]*$/i.test(message.trim())) return { text: "I'm here and ready to talk. What's on your mind?", modelUsed: false };
  if (!ai) return { text: "The conversation model is not connected in this environment. I can still help with available research and memory controls.", modelUsed: false };
  const system = "You are Nyxthea, The Intelligence That Runs Your World. Use plain everyday American English. Be warm, clear, accurate, and concise. Never claim an action, source, memory, capability, or connection that was not provided. Explain future features as planned, not active. Do not reveal internal implementation details unless asked.";
  const prompt = `${system}\n\nAuthorized context:\n${JSON.stringify(context)}\n\nUser: ${message}`;
  const result = await ai.run(MODEL, { prompt, max_tokens: 500 });
  const text = typeof result === "string" ? result : result?.response;
  return { text: text || "I wasn't able to form a response just now.", modelUsed: true };
}
