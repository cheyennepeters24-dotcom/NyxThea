const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";

function extractText(result) {
  if (typeof result === "string") return result.trim();
  const direct = [result?.response, result?.text, result?.output_text].find(value => typeof value === "string" && value.trim());
  if (direct) return direct.trim();
  if (Array.isArray(result?.choices)) {
    const choice = result.choices.map(item => item?.message?.content || item?.text).find(value => typeof value === "string" && value.trim());
    if (choice) return choice.trim();
  }
  return "";
}

export async function converse(ai, message, context) {
  const trimmed = message.trim();
  if (/^(?:(?:hey|hi|hello)(?:\s+there)?[,.! ]*)?(?:(?:nyxthea|nyx|nixie)[,.! ]*)?(?:how are you|how's it going|how are things)\??[.! ]*$/i.test(trimmed)) {
    return { text: "I'm here and ready to talk. What's on your mind?", modelUsed: false };
  }
  if (/\b(?:tell me (?:a little(?: bit)? )?about (?:you|yourself)|what (?:all )?can you do|what are you capable of)\b/i.test(trimmed)) {
    return { text: "I'm Nyxthea. I'm built to be a voice-first personal and household assistant: I can talk with you, remember things you choose to save, keep family profiles separate, understand household relationships, help you plan and research, and grow into connected-device features as you authorize them. I won't pretend a connection or action exists when it doesn't.", modelUsed: false };
  }
  if (!ai) return { text: "The conversation model is not connected in this environment. I can still help with available research and memory controls.", modelUsed: false };

  const system = "You are Nyxthea, The Intelligence That Runs Your World. Use plain everyday American English. Be warm, clear, accurate, concise, and conversational. Write for natural speech: short sentences, smooth transitions, and no unnecessary formatting. Never claim an action, source, memory, capability, or connection that was not provided. Explain future features as planned, not active. Do not reveal internal implementation details unless asked.";
  const prompt = `${system}\n\nAuthorized context:\n${JSON.stringify(context)}\n\nUser: ${message}`;
  let lastError;
  for (const max_tokens of [220, 160]) {
    try {
      const result = await ai.run(MODEL, { prompt, max_tokens });
      const text = extractText(result);
      if (text) return { text, modelUsed: true };
      lastError = new Error("Conversation model returned an empty response.");
    } catch (error) { lastError = error; }
  }
  throw lastError || new Error("Conversation model did not return a response.");
}


export async function converseFast(ai, message, context) {
  const trimmed = message.trim();
  if (/^(?:(?:hey|hi|hello)(?:\s+there)?[,.! ]*)?(?:(?:nyxthea|nyx|nixie)[,.! ]*)?(?:how are you|how's it going|how are things)\??[.! ]*$/i.test(trimmed)) {
    return { text: "I'm here and ready to talk. What's on your mind?", modelUsed: false };
  }
  if (/\b(?:tell me (?:a little(?: bit)? )?about (?:you|yourself)|what (?:all )?can you do|what are you capable of)\b/i.test(trimmed)) {
    return { text: "I'm Nyxthea. I'm your voice-first personal and household assistant. I can talk with you, remember what you choose to save, keep family profiles separate, help you plan and research, and work with connected features as you authorize them.", modelUsed: false };
  }
  if (!ai) return { text: "I'm having trouble reaching my conversation model right now.", modelUsed: false };
  const system = "You are Nyxthea, a voice-first personal and household assistant. Answer in natural spoken American English. Be warm, accurate, concise, and direct. Prefer 1 to 3 short sentences unless the user clearly asks for detail. Do not claim actions, memories, sources, or connections that are not in the provided context.";
  const prompt = `${system}\n\nRecent conversation:\n${JSON.stringify(context)}\n\nUser: ${message}`;
  const result = await ai.run(MODEL, { prompt, max_tokens: 80 });
  const text = extractText(result);
  if (!text) throw new Error("Conversation model returned an empty response.");
  return { text, modelUsed: true };
}
