import test from "node:test";
import assert from "node:assert/strict";
import { resetStateForTests } from "../state/store.js";
import { createProfile } from "../profiles/profiles.js";
import { isSystemAdmin, provisionSystemAdmin, recordSystemAdminAction, requireSystemAdmin, revokeSystemAdmin, systemAdminAudit } from "../security/system-admin.js";

test.beforeEach(()=>resetStateForTests());

test("household administration never implies NyxThea system administration",()=>{
  const householdOwner=createProfile({displayName:"Household Owner",permissions:["household_admin"]});
  assert.equal(isSystemAdmin(householdOwner),false);
  assert.throws(()=>requireSystemAdmin(householdOwner),error=>error.status===403);
});

test("system administration must be explicitly provisioned",()=>{
  const tech=createProfile({displayName:"Tech"});
  assert.equal(isSystemAdmin(tech),false);
  provisionSystemAdmin({profileId:tech.id,label:"NyxThea technical staff"});
  assert.equal(isSystemAdmin(tech),true);
  assert.doesNotThrow(()=>requireSystemAdmin(tech));
});

test("system admin actions have a dedicated audit trail",()=>{
  const tech=createProfile({displayName:"Tech"});
  provisionSystemAdmin({profileId:tech.id});
  recordSystemAdminAction(tech,"self_audit.repair_approved",{findingId:"audit-1"});
  const events=systemAdminAudit(tech);
  assert.ok(events.some(event=>event.action==="self_audit.repair_approved"));
});

test("revocation immediately removes system admin authority",()=>{
  const owner=createProfile({displayName:"Platform Owner"});
  const tech=createProfile({displayName:"Tech"});
  provisionSystemAdmin({profileId:owner.id});
  provisionSystemAdmin({profileId:tech.id});
  revokeSystemAdmin({actorProfile:owner,profileId:tech.id,reason:"offboarded"});
  assert.equal(isSystemAdmin(tech),false);
  assert.throws(()=>requireSystemAdmin(tech),error=>error.status===403);
});


test("trusted bootstrap provisions only the exact initial profile and only when no active admin exists",()=>{
  resetStore();
  const owner=createProfile({displayName:"Bootstrap Owner",permissions:["household_admin"]});
  const other=createProfile({displayName:"Other"});
  assert.equal(ensureInitialSystemAdmin(other,owner.id),null);
  assert.equal(isSystemAdmin(other),false);
  const grant=ensureInitialSystemAdmin(owner,owner.id);
  assert.equal(grant.profileId,owner.id);
  assert.equal(isSystemAdmin(owner),true);
  assert.equal(ensureInitialSystemAdmin(other,other.id),null);
  assert.equal(isSystemAdmin(other),false);
});
