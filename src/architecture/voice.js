import { now, table } from "../state/store.js";
export const wakeWords=["nyx"];
export const voiceStates=["idle","listening","thinking","speaking","interrupted","quiet","unavailable"];
export const CORE_VOICE=Object.freeze({
  name:"Core",genderPresentation:"feminine",register:"medium-low",accent:"refined, subtle British",
  qualities:["warm","smooth","intelligent","naturally confident","slightly mysterious","subtly playful"],
  delivery:["conversational","emotionally adaptive","natural contractions","tiny pauses","variable speed and emphasis"],
  avoid:["robotic cadence","announcer delivery","exaggerated breathiness","forced cheerfulness","movie-trailer drama"],
  target:"human, grounded, warm, capable"
});
const sessions=()=>table("voice_sessions");
export function assessWakeContext({phrase="",confidence=0,contextConfidence=0}){
 const normalized=phrase.trim().toLowerCase(),recognized=wakeWords.includes(normalized);
 const safeToRespond=recognized&&Number(confidence)>=.7&&Number(contextConfidence)>=.6;
 return {recognized,safeToRespond,response:safeToRespond?"session_may_start":"remain_quiet"};
}
// An explicit address is enough to engage NyxThea. If words follow the alias,
// pass them through as the request instead of rejecting natural phrasing.
// Browser recognition is convenience only and never grants authorization.
export function assessWakeTranscript({transcript="",confidence=0}={}){
 const aliases=[...wakeWords];
 const spoken=String(transcript).trim().replace(/[.!?]+$/,"");
 for(const alias of aliases){
  const escaped=alias.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const match=spoken.match(new RegExp(`^(?:hey[ ,]+)?${escaped}(?:[ ,.!?]+|$)(.*)$`,"i"));
  if(!match)continue;
  const request=match[1].trim();
  if(!request&&Number(confidence)>=.65)return {recognized:true,safeToRespond:true,request:"",response:"session_may_start"};
  const quotedOrCorrective=/\b(?:said|say|called|named|name is|not the assistant|don't call|do not call)\b/i.test(request)||/^is\s+(?:a|an|the)\b/i.test(request);
  const safeToRespond=Number(confidence)>=.65&&!quotedOrCorrective;
  return {recognized:safeToRespond,safeToRespond,request:safeToRespond?request:"",response:safeToRespond?"session_may_start":"remain_quiet"};
 }
 return {recognized:false,safeToRespond:false,request:"",response:"remain_quiet"};
}
export function transitionVoice(profileId,event,meta={}){
 const previous=sessions().get(profileId)?.state||"idle";
 const map={wake:"listening",listen:"listening",think:"thinking",speak:"speaking",interrupt:"interrupted",quiet:"quiet",reset:"idle",unavailable:"unavailable"};
 let next=map[event]||previous;
 if(event==="interrupt"&&previous!=="speaking") next=previous;
 const session={profileId,state:next,provider:meta.provider||sessions().get(profileId)?.provider||"browser_or_future_provider",audioActive:["listening","speaking"].includes(next),simulated:false,voice:CORE_VOICE,updatedAt:now()};
 sessions().set(profileId,session); return session;
}
export function voiceState(profileId){return sessions().get(profileId)||{profileId,identity:"NyxThea — Core",state:"idle",provider:"browser_or_future_provider",audioActive:false,simulated:false,voice:CORE_VOICE,supports:["Nyx wake word","NyxThea and Nixie conversational names","interruptions","push-to-talk","speech synthesis fallback","speech recognition fallback","future local ONNX wake adapter"]};}
export function voicePlan(){return {identity:"NyxThea",wakeWord:"Nyx",conversationalNames:["NyxThea","Nixie"],baseline:CORE_VOICE,activation:"Opt-in foreground browser listening stays active while the page is visible, and stops on navigation, sign-out, or Stop. Only Nyx is a wake word. Background wake on iPhone is unavailable.",rule:"Voice recognition is convenience, never authentication.",fallback:"If browser wake recognition is unavailable, use the tap-to-talk microphone or text."};}
