import { id, list, now, table } from "../state/store.js";

const admins=()=>table("system_admins");
const audit=()=>table("system_admin_audit");

function auditEvent(actorProfileId,action,details={}){
  const event={id:id("sysadmin_audit"),actorProfileId,action,details,at:now()};
  audit().set(event.id,event);
  return event;
}

export function isSystemAdmin(profile){
  if(!profile?.id)return false;
  const grant=admins().get(profile.id);
  return Boolean(grant?.active===true);
}

export function requireSystemAdmin(profile){
  if(!isSystemAdmin(profile))throw Object.assign(new Error("NyxThea system administrator authorization is required."),{status:403});
  return admins().get(profile.id);
}

export function systemAdminAudit(profile){
  requireSystemAdmin(profile);
  return list("system_admin_audit").sort((a,b)=>String(b.at).localeCompare(String(a.at)));
}

// Provisioning is intentionally not exposed to household/admin APIs. A trusted
// deployment/bootstrap path must call this explicitly; household ownership,
// subscription state, and household_admin never imply system administration.
export function provisionSystemAdmin({actorProfileId="system",profileId,label="",reason="explicit platform provisioning"}={}){
  if(!profileId)throw Object.assign(new Error("A profile id is required."),{status:400});
  const existing=admins().get(profileId);
  const grant={id:existing?.id||id("sysadmin"),profileId,active:true,label:String(label||""),provisionedAt:existing?.provisionedAt||now(),updatedAt:now()};
  admins().set(profileId,grant);
  auditEvent(actorProfileId,"system_admin.provisioned",{profileId,reason});
  return grant;
}

export function revokeSystemAdmin({actorProfile,profileId,reason="revoked"}={}){
  requireSystemAdmin(actorProfile);
  const target=admins().get(profileId);
  if(!target)throw Object.assign(new Error("System administrator not found."),{status:404});
  target.active=false; target.revokedAt=now(); target.updatedAt=target.revokedAt;
  admins().set(profileId,target);
  auditEvent(actorProfile.id,"system_admin.revoked",{profileId,reason});
  return target;
}

export function recordSystemAdminAction(profile,action,details={}){
  requireSystemAdmin(profile);
  return auditEvent(profile.id,action,details);
}
