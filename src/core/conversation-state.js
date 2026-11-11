import { id, list, now, table } from "../state/store.js";
const turns = () => table("conversation_turns"); const states = () => table("conversation_states");
export const CONVERSATION_CONTEXT_HOURS = 24;
const outage = /^(?:I heard you, but I couldn't finish|I hit a snag\.|I'm having trouble reaching|My daily AI allowance is used up)/;
export function setConversationState(profileId, mode = "normal") { if (!["normal", "quiet", "interrupted"].includes(mode)) throw new Error("Unsupported conversation mode."); const state = { ...conversationState(profileId), profileId, mode, updatedAt: now() }; states().set(profileId, state); return state; }
export function conversationState(profileId) { return states().get(profileId) || { profileId, mode: "normal" }; }
export function recordTurn(profileId, role, text) { const turn = { id: id("turn"), profileId, role, text, at: now() }; turns().set(turn.id, turn); return turn; }
export function recentTurns(profileId, limit = 24) { return list("conversation_turns", (turn) => turn.profileId === profileId).sort((a, b) => a.at.localeCompare(b.at)).slice(-limit); }
export function conversationContext(profileId, at = Date.now()) {
  const cutoff = at - CONVERSATION_CONTEXT_HOURS * 3600000;
  const active = list("conversation_turns", turn => turn.profileId === profileId && Date.parse(turn.at) >= cutoff && ["user","assistant"].includes(turn.role) && !(turn.role === "assistant" && outage.test(turn.text))).sort((a,b)=>a.at.localeCompare(b.at));
  const earlier = active.slice(0, -24);
  // Extractive notes use the actual conversation, without an extra AI request.
  // They are temporary context, never entries in permanent personal memory.
  const anchors = earlier.filter(turn=>turn.role === "user" && /\b(?:want|need|prefer|don't|do not|must|goal|decided)\b/i.test(turn.text)).slice(0,4);
  const selected = [...new Map([...anchors,...earlier.slice(-16)].map(turn=>[turn.id,turn])).values()];
  return {conversation:active.slice(-24), continuity:{kind:"temporary_quoted_context", windowHours:CONVERSATION_CONTEXT_HOURS, notes:selected.map(turn=>({role:turn.role,text:String(turn.text).slice(0,250)}))}};
}
export function clearConversation(profileId) {
  let removed=0;
  for(const [key,turn] of turns())if(turn.profileId===profileId){turns().delete(key);removed++;}
  states().delete(profileId);
  return {removed};
}
