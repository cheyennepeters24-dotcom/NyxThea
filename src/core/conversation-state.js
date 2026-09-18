import { id, list, now, table } from "../state/store.js";
const turns = () => table("conversation_turns"); const states = () => table("conversation_states");
export function setConversationState(profileId, mode = "normal") { if (!["normal", "quiet", "interrupted"].includes(mode)) throw new Error("Unsupported conversation mode."); const state = { profileId, mode, updatedAt: now() }; states().set(profileId, state); return state; }
export function conversationState(profileId) { return states().get(profileId) || { profileId, mode: "normal" }; }
export function recordTurn(profileId, role, text) { const turn = { id: id("turn"), profileId, role, text, at: now() }; turns().set(turn.id, turn); return turn; }
export function recentTurns(profileId, limit = 8) { return list("conversation_turns", (turn) => turn.profileId === profileId).sort((a, b) => a.at.localeCompare(b.at)).slice(-limit); }
