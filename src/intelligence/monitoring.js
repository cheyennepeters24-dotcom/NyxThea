import { id, list, table, now } from "../state/store.js";

const audits=()=>table("self_audit_findings");
const allowedSeverities=new Set(["critical","high","medium","low"]);
const allowedKinds=new Set(["detected","suspected"]);
const activeStatuses=new Set(["awaiting_approval","prepared","approved","deferred","failed"]);
const normalize=value=>String(value||"").trim().toLowerCase().replace(/\s+/g," ");
const dedupeFor=({source,affected,summary,dedupeKey})=>normalize(dedupeKey||`${source}:${affected}:${summary}`);

export function recordAuditFinding(profileId,{source="runtime",kind="detected",severity="medium",summary,evidence="",affected="unknown",proposedFix="",requiresAuthorization=true,dedupeKey=""}={}){
  if(!summary)throw Object.assign(new Error("An audit finding needs a summary."),{status:400});
  const key=dedupeFor({source,affected,summary,dedupeKey});
  const existing=list("self_audit_findings",x=>x.profileId===profileId&&x.dedupeKey===key&&activeStatuses.has(x.status))[0];
  if(existing){
    existing.occurrenceCount=(existing.occurrenceCount||1)+1;
    existing.lastSeenAt=now(); existing.updatedAt=existing.lastSeenAt;
    if(evidence)existing.evidence=String(evidence);
    if(proposedFix)existing.proposedFix=String(proposedFix);
    if(allowedSeverities.has(severity))existing.severity=severity;
    audits().set(existing.id,existing); return existing;
  }
  const createdAt=now();
  const finding={
    id:id("audit"),profileId,source,
    kind:allowedKinds.has(kind)?kind:"suspected",
    severity:allowedSeverities.has(severity)?severity:"medium",
    summary:String(summary),evidence:String(evidence||""),affected:String(affected||"unknown"),
    proposedFix:String(proposedFix||""),requiresAuthorization:Boolean(requiresAuthorization),dedupeKey:key,
    occurrenceCount:1,firstSeenAt:createdAt,lastSeenAt:createdAt,
    status:requiresAuthorization?"awaiting_approval":"prepared",createdAt,updatedAt:createdAt,
    acknowledgedAt:null,resolvedAt:null,decision:null,verification:null
  };
  audits().set(finding.id,finding); return finding;
}

export function auditFindings(profileId,{status}={}){
  return list("self_audit_findings",x=>x.profileId===profileId&&(!status||x.status===status)).sort((a,b)=>String(b.lastSeenAt||b.createdAt).localeCompare(String(a.lastSeenAt||a.createdAt)));
}
export function systemAuditFindings({status}={}){
  return list("self_audit_findings",x=>(!status||x.status===status)).sort((a,b)=>String(b.lastSeenAt||b.createdAt).localeCompare(String(a.lastSeenAt||a.createdAt)));
}

function ownedFinding(profileId,idValue){
  const finding=audits().get(idValue);
  if(!finding||finding.profileId!==profileId)throw Object.assign(new Error("Audit finding not found."),{status:404});
  return finding;
}

export function acknowledgeAuditFinding(profileId,idValue){
  const finding=ownedFinding(profileId,idValue); finding.acknowledgedAt=now(); finding.updatedAt=finding.acknowledgedAt; audits().set(idValue,finding); return finding;
}

export function resolveAuditFinding(profileId,idValue,{note=""}={}){
  const finding=ownedFinding(profileId,idValue); finding.status="resolved"; finding.resolvedAt=now(); finding.updatedAt=finding.resolvedAt;
  if(note)finding.resolutionNote=String(note); audits().set(idValue,finding); return finding;
}

export function decideAuditRepair(profileId,idValue,decision){
  const finding=ownedFinding(profileId,idValue);
  const map={approve:"approved",reject:"rejected",defer:"deferred",ignore:"ignored"};
  if(!map[decision])throw Object.assign(new Error("Decision must be approve, reject, defer, or ignore."),{status:400});
  finding.decision=decision; finding.status=map[decision]; finding.updatedAt=now(); audits().set(idValue,finding); return finding;
}

export function verifyAuditRepair(profileId,idValue,{passed=false,evidence=""}={}){
  const finding=ownedFinding(profileId,idValue);
  if(finding.requiresAuthorization&&finding.status!=="approved")throw Object.assign(new Error("This repair must be approved before verification."),{status:409});
  finding.verification={passed:Boolean(passed),evidence:String(evidence||""),verifiedAt:now()};
  finding.status=passed?"verified":"failed"; finding.updatedAt=now(); audits().set(idValue,finding); return finding;
}

export function selfMonitor(profileId,{aiConnected=false,systemWide=false}={}){
  const endpoints=list("endpoints",x=>x.ownerProfileId===profileId);
  const integrations=list("integration_connections",x=>x.profileId===profileId);
  const facts=list("world_facts",x=>x.profileId===profileId);
  const stale=facts.filter(x=>new Date(x.expiresAt).getTime()<=Date.now());
  return{
    mode:aiConnected?"available":"degraded",
    whatStillWorks:["local profiles","local memory","local records","local reasoning","safety evaluation"],
    unavailable:[...(!aiConnected?["AI conversation"]:[]),"external provider actions","provider-backed voice"],
    endpoints:{registered:endpoints.length,connected:0},
    integrations:{registered:integrations.length,connected:integrations.filter(x=>x.state==="active_connection").length},
    knowledge:{total:facts.length,stale:stale.length},
    failures:systemWide?systemAuditFindings({status:"failed"}):auditFindings(profileId,{status:"failed"}),findings:systemWide?systemAuditFindings():auditFindings(profileId),
    assumptions:[],retry:aiConnected?null:"Retry when the AI binding or internet service is available."
  };
}

export function explainFailure({operation,error,retryable=true}){
  return{whatFailed:String(operation||"operation"),why:String(error||"The operation did not complete."),whatStillWorks:"Local, non-provider features remain available.",cannotDo:"Nyxthea will not claim the action succeeded.",retry:retryable?"You can retry after checking the connection or configuration.":"This action requires a new authorization or configuration."};
}
