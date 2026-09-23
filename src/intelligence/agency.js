import { id, list, now, table } from "../state/store.js";
const jobs=()=>table("agency_jobs");
const HIGH=new Set(["purchase","transfer_money","permanent_delete","legal_submit","change_security","public_publish","emergency_action"]);
export function classifyAction({intent="act",type="",reversible=true,external=false}={}) {
  const phase=["observe","prepare","act"].includes(intent)?intent:"act";
  const high=HIGH.has(type)||reversible===false;
  return {phase,consequence:high?"high":external?"meaningful":"low",requiresConfirmation:phase==="act"&&(high||external),requiresAuthentication:phase==="act"&&high,preferReversible:true};
}
export function createJob(profileId,{goal,steps=[]}={}) {
  if(!goal?.trim()) throw Object.assign(new Error("A job goal is required."),{status:400});
  const job={id:id("job"),profileId,goal:goal.trim().slice(0,500),steps:steps.map((s,i)=>({id:i+1,status:"pending",...s})),status:"active",createdAt:now(),stoppedAt:null};
  jobs().set(job.id,job); return job;
}
export function stopJob(profileId,jobId){ const job=jobs().get(jobId); if(!job||job.profileId!==profileId) throw Object.assign(new Error("Job not found."),{status:404}); job.status="stopped"; job.stoppedAt=now(); for(const s of job.steps) if(s.status==="pending") s.status="prevented"; return job; }
export function jobsFor(profileId){return list("agency_jobs",j=>j.profileId===profileId);}
