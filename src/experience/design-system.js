import { now, table } from "../state/store.js";

export const NYXTHEA_PRINCIPLES = Object.freeze([
  "NyxThea speaks because she has a reason—not because there’s silence.",
  "NyxThea doesn’t wait for commands. She takes turns.",
  "NyxThea can fail without disappearing.",
  "NyxThea protects access to your world without constantly making you prove that you belong there.",
  "NyxThea learns patterns, but the human remains the authority on themselves.",
  "She adapts the relationship without replacing her identity.",
  "She accumulates context with you—not a dossier about you.",
  "NyxThea can take initiative with information. She earns permission for consequences.",
  "NyxThea does as much as she safely can without making the user babysit her—but consequences remain under human control.",
  "NyxThea protects the user’s attention as carefully as she protects their information.",
  "NyxThea doesn’t demand attention just because she has information."
]);

export const roseStates = Object.freeze(["idle","listening","thinking","speaking","amused","focused","emergency","standby"]);
export const proactiveModes = Object.freeze(["quiet","helpful","engaged"]);
export const communicationStyles = Object.freeze(["professional","natural","unfiltered"]);
export const soundModes = Object.freeze(["off","minimal","full"]);
export const motionModes = Object.freeze(["full","reduced","minimal"]);
export const lockScreenPrivacy = Object.freeze(["full","private","hidden"]);
export const attentionLevels = Object.freeze(["critical","time_sensitive","important","useful","background"]);

const settings = () => table("experience_settings");
const later = () => table("later_queue");

export function defaultExperience(profileId) {
  return {
    profileId, proactiveMode:"helpful", communicationStyle:"natural", soundMode:"minimal",
    motionMode:"full", lockScreenPrivacy:"private", focusMode:false, doNotDisturb:false,
    privateConversation:false, voiceEnabled:true, handsFreeEnabled:false, decorativeSounds:true,
    pronunciation:null, preferredName:null, onboarded:false, updatedAt:now()
  };
}
export function experienceSettings(profileId) { return settings().get(profileId) || defaultExperience(profileId); }
export function updateExperience(profileId, patch={}) {
  const current=experienceSettings(profileId);
  const next={...current};
  const enumSet=(key,values)=>{ if(patch[key]!==undefined){ if(!values.includes(patch[key])) throw Object.assign(new Error("Invalid "+key+"."),{status:400}); next[key]=patch[key]; }};
  enumSet("proactiveMode",proactiveModes); enumSet("communicationStyle",communicationStyles); enumSet("soundMode",soundModes); enumSet("motionMode",motionModes); enumSet("lockScreenPrivacy",lockScreenPrivacy);
  for(const key of ["focusMode","doNotDisturb","privateConversation","voiceEnabled","handsFreeEnabled","decorativeSounds"]) if(patch[key]!==undefined) next[key]=Boolean(patch[key]);
  for(const key of ["pronunciation","preferredName"]) if(patch[key]!==undefined) next[key]=patch[key]===null?null:String(patch[key]).trim().slice(0,120);
  if(patch.onboarded!==undefined) next.onboarded=Boolean(patch.onboarded);
  next.updatedAt=now(); settings().set(profileId,next); return next;
}
export function rosePresentation(state="idle") {
  if(!roseStates.includes(state)) state="idle";
  return {
    state,
    rose:"blue",
    background:state==="emergency"?"red_glow":"galaxy",
    particles:state==="focused"||state==="emergency"?"reduced":state==="standby"?"minimal":"ambient",
    behavior:{idle:"breathe",listening:"orient",thinking:"orbit",speaking:"petal_pulse",amused:"shimmer",focused:"steady",emergency:"steady",standby:"close"}[state]
  };
}
export function queueLater(profileId,{kind="useful",summary,relatedTo=null,dueAt=null}={}) {
  if(!summary?.trim()) throw Object.assign(new Error("A Later summary is required."),{status:400});
  const id=crypto.randomUUID(); const item={id,profileId,kind,summary:summary.trim().slice(0,500),relatedTo,dueAt,status:"held",createdAt:now()};
  later().set(id,item); return item;
}
export function laterItems(profileId){ return [...later().values()].filter(x=>x.profileId===profileId&&x.status==="held"); }
export function resolveLater(profileId,id,status="done"){ const item=later().get(id); if(!item||item.profileId!==profileId) throw Object.assign(new Error("Later item not found."),{status:404}); item.status=status; item.resolvedAt=now(); return item; }
