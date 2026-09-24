import { list, table, now } from "../state/store.js";

const audits=()=>table("self_audit_findings");
const allowedSeverities=new Set(["critical","high","medium","low"]);
const allowedKinds=new Set(["detected","suspected"]);

export function recordAuditFinding(profileId,{source="runtime",kind="detected",severity="medium",summary,evidence="",affected="unknown",proposedFix="",requiresAuthorization=true}={}){
  if(!summary)throw Object.assign(new Error("An audit finding needs a summary."),{status:400});
  const finding={
    id:`audit_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    profileId,source,
    kind:allowedKinds.has(kind)?kind:"suspected",
    severity:allowedSeverities.has(severity)?severity:"medium",
    summary:String(summary),evidence:String(evidence||""),affected:String(affected||"unknown"),
    proposedFix:String(proposedFix||""),requiresAuthorization:Boolean(requiresAuthorization),
    status:requiresAuthorization?"awaiting_approval":"prepared",createdAt:now(),updatedAt:now(),decision:null,verification:null
  };
  audits().set(finding.id,finding);
  return finding;
}

export function auditFindings(profileId,{status}={}){
  return list("self_audit_findings",x=>x.profileId===profileId&&(!status||x.status===status)).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function decideAuditRepair(profileId,id,decision){
  const finding=audits().get(id);
  if(!finding||finding.profileId!==profileId)throw Object.assign(new Error("Audit finding not found."),{status:404});
  const map={approve:"approved",reject:"rejected",defer:"deferred",ignore:"ignored"};
  if(!map[decision])throw Object.assign(new Error("Decision must be approve, reject, defer, or ignore."),{status:400});
  finding.decision=decision; finding.status=map[decision]; finding.updatedAt=now(); audits().set(id,finding); return finding;
}

export function verifyAuditRepair(profileId,id,{passed=false,evidence=""}={}){
  const finding=audits().get(id);
  if(!finding||finding.profileId!==profileId)throw Object.assign(new Error("Audit finding not found."),{status:404});
  finding.verification={passed:Boolean(passed),evidence:String(evidence||""),verifiedAt:now()};
  finding.status=passed?"verified":"failed"; finding.updatedAt=now(); audits().set(id,finding); return finding;
}

export function selfMonitor(profileId,{aiConnected=false}={}){
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
    failures:auditFindings(profileId,{status:"failed"}),
    findings:auditFindings(profileId),
    assumptions:["Isolate-local state may reset without durable storage."],
    retry:aiConnected?null:"Retry when the AI binding or internet service is available."
  };
}

export function explainFailure({operation,error,retryable=true}){
  return{whatFailed:String(operation||"operation"),why:String(error||"The operation did not complete."),whatStillWorks:"Local, non-provider features remain available.",cannotDo:"Nyxthea will not claim the action succeeded.",retry:retryable?"You can retry after checking the connection or configuration.":"This action requires a new authorization or configuration."};
}
