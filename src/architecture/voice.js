import { now, table } from "../state/store.js";
export const wakeWords=["nyxthea","nyx","nixie"];
export const voiceStates=["idle","listening","thinking","speaking","interrupted","quiet","unavailable"];
export const CORE_VOICE=Object.freeze({
  name:"Core",genderPresentation:"feminine",register:"medium-low",
  qualities:["warm","smooth","intelligent","naturally confident","slightly mysterious","subtly playful"],
  delivery:["conversational","emotionally adaptive","natural contractions","tiny pauses","variable speed and emphasis"],
  avoid:["robotic cadence","announcer delivery","exaggerated breathiness","forced cheerfulness","movie-trailer drama"],
  target:"human, grounded, warm, capable"
});
const sessions=()=>table("voice_sessions");
export function assessWakeContext({phrase="",confidence=0,authorizedNicknames=[],contextConfidence=0}){
 const normalized=phrase.trim().toLowerCase(),recognized=wakeWords.includes(normalized)||authorizedNicknames.includes(normalized);
 const safeToRespond=recognized&&Number(confidence)>=.85&&Number(contextConfidence)>=.75;
 return {recognized,safeToRespond,response:safeToRespond?"session_may_start":"remain_quiet"};
}
export function transitionVoice(profileId,event,meta={}){
 const previous=sessions().get(profileId)?.state||"idle";
 const map={wake:"listening",listen:"listening",think:"thinking",speak:"speaking",interrupt:"interrupted",quiet:"quiet",reset:"idle",unavailable:"unavailable"};
 let next=map[event]||previous;
 if(event==="interrupt"&&previous!=="speaking") next=previous;
 const session={profileId,state:next,provider:meta.provider||sessions().get(profileId)?.provider||"browser_or_future_provider",audioActive:["listening","speaking"].includes(next),simulated:false,voice:CORE_VOICE,updatedAt:now()};
 sessions().set(profileId,session); return session;
}
export function voiceState(profileId){return sessions().get(profileId)||{profileId,identity:"NyxThea — Core",state:"idle",provider:"browser_or_future_provider",audioActive:false,simulated:false,voice:CORE_VOICE,supports:["NyxThea / NYX / Nixie wake identity","interruptions","push-to-talk","speech synthesis fallback","speech recognition fallback","future premium voice adapter"]};}
export function voicePlan(){return {identity:"NyxThea",aliases:["NYX","Nixie"],baseline:CORE_VOICE,rule:"Voice recognition is convenience, never authentication.",fallback:"If premium/live voice is unavailable, remain usable through browser speech and text."};}
