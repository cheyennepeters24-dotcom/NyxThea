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
export const interfaceModules = Object.freeze(["world","devices","health","security","memories","music","vehicle","apple_siri_iphone","amazon_alexa_echo","google_nest","smart_home","tv","wearable","computer","health_data","pet_care","emergency_contacts"]);

const settings = () => table("experience_settings");
const later = () => table("later_queue");

export function defaultExperience(profileId) {
  return {
    profileId, proactiveMode:"helpful", communicationStyle:"natural", soundMode:"minimal",
    motionMode:"full", lockScreenPrivacy:"private", focusMode:false, doNotDisturb:false,
    privateConversation:false, voiceEnabled:true, handsFreeEnabled:false, handsFreeConfigured:false, voiceAssistantMode:true, decorativeSounds:true,
    wakeEnrollmentComplete:false, wakeEnrollmentSamples:0, wakeEnrollmentVersion:0, wakeEnrollmentDeviceId:null, wakeEnrollmentUpdatedAt:null,
    visibleModules:["world","devices","health","security","memories","music","vehicle"],
    pronunciation:null, preferredName:null, onboarded:false, onboardingVersion:0, updatedAt:now()
  };
}
export function experienceSettings(profileId) { const saved=settings().get(profileId); if(!saved)return defaultExperience(profileId); const merged={...defaultExperience(profileId),...saved}; if(saved.handsFreeConfigured===undefined&&saved.onboarded&&saved.voiceEnabled!==false&&saved.voiceAssistantMode!==false)merged.handsFreeEnabled=true; return merged; }
export function updateExperience(profileId, patch={}) {
  const current=experienceSettings(profileId);
  const next={...current};
  const enumSet=(key,values)=>{ if(patch[key]!==undefined){ if(!values.includes(patch[key])) throw Object.assign(new Error("Invalid "+key+"."),{status:400}); next[key]=patch[key]; }};
  enumSet("proactiveMode",proactiveModes); enumSet("communicationStyle",communicationStyles); enumSet("soundMode",soundModes); enumSet("motionMode",motionModes); enumSet("lockScreenPrivacy",lockScreenPrivacy);
  for(const key of ["focusMode","doNotDisturb","privateConversation","voiceEnabled","handsFreeEnabled","handsFreeConfigured","voiceAssistantMode","decorativeSounds","wakeEnrollmentComplete"]) if(patch[key]!==undefined) next[key]=Boolean(patch[key]);
  if(patch.wakeEnrollmentSamples!==undefined){const count=Number(patch.wakeEnrollmentSamples);if(!Number.isInteger(count)||count<0||count>5)throw Object.assign(new Error("Invalid wakeEnrollmentSamples."),{status:400});next.wakeEnrollmentSamples=count;}
  if(patch.wakeEnrollmentVersion!==undefined){const version=Number(patch.wakeEnrollmentVersion);if(!Number.isInteger(version)||version<0||version>20)throw Object.assign(new Error("Invalid wakeEnrollmentVersion."),{status:400});next.wakeEnrollmentVersion=version;}
  if(patch.wakeEnrollmentDeviceId!==undefined)next.wakeEnrollmentDeviceId=patch.wakeEnrollmentDeviceId===null?null:String(patch.wakeEnrollmentDeviceId).trim().slice(0,128)||null;
  if(patch.wakeEnrollmentUpdatedAt!==undefined){const value=patch.wakeEnrollmentUpdatedAt===null?null:String(patch.wakeEnrollmentUpdatedAt);if(value&&!Number.isFinite(Date.parse(value)))throw Object.assign(new Error("Invalid wakeEnrollmentUpdatedAt."),{status:400});next.wakeEnrollmentUpdatedAt=value;}
  for(const key of ["pronunciation","preferredName"]) if(patch[key]!==undefined) next[key]=patch[key]===null?null:String(patch[key]).trim().slice(0,120);
  if(patch.visibleModules!==undefined){ if(!Array.isArray(patch.visibleModules)) throw Object.assign(new Error("Invalid visibleModules."),{status:400}); next.visibleModules=[...new Set(patch.visibleModules.map(String).filter(x=>interfaceModules.includes(x)))]; }
  if(patch.onboarded!==undefined) next.onboarded=Boolean(patch.onboarded); if(patch.onboardingVersion!==undefined) next.onboardingVersion=Math.max(0,Math.min(99,Number(patch.onboardingVersion)||0));
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
