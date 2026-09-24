import test from "node:test";
import assert from "node:assert/strict";
import { resetStateForTests } from "../state/store.js";
import { recordCiBuildRun, acknowledgeAuditFinding, auditFindings, decideAuditRepair, recordAuditFinding, resolveAuditFinding, verifyAuditRepair } from "../intelligence/monitoring.js";

test.beforeEach(()=>resetStateForTests());

test("repeated audit events are grouped instead of flooding alerts",()=>{
  const first=recordAuditFinding("owner",{source:"fafo",affected:"voice",summary:"Voice request failed",evidence:"first"});
  const repeated=recordAuditFinding("owner",{source:"fafo",affected:"voice",summary:"Voice request failed",evidence:"second"});
  assert.equal(first.id,repeated.id);
  assert.equal(repeated.occurrenceCount,2);
  assert.equal(repeated.evidence,"second");
  assert.equal(auditFindings("owner").length,1);
});

test("protected repairs require approval before verification",()=>{
  const finding=recordAuditFinding("owner",{summary:"Protected repair",requiresAuthorization:true});
  assert.throws(()=>verifyAuditRepair("owner",finding.id,{passed:true}),error=>error.status===409);
  const approved=decideAuditRepair("owner",finding.id,"approve");
  assert.equal(approved.status,"approved");
  const verified=verifyAuditRepair("owner",finding.id,{passed:true,evidence:"regression passed"});
  assert.equal(verified.status,"verified");
  assert.equal(verified.verification.evidence,"regression passed");
});

test("alerts can be acknowledged and resolved without email semantics",()=>{
  const finding=recordAuditFinding("owner",{summary:"Integration warning",requiresAuthorization:false});
  const acknowledged=acknowledgeAuditFinding("owner",finding.id);
  assert.ok(acknowledged.acknowledgedAt);
  const resolved=resolveAuditFinding("owner",finding.id,{note:"configuration corrected"});
  assert.equal(resolved.status,"resolved");
  assert.equal(resolved.resolutionNote,"configuration corrected");
});

test("audit findings remain isolated to their owning profile",()=>{
  const finding=recordAuditFinding("owner",{summary:"Private admin diagnostic"});
  assert.equal(auditFindings("other").length,0);
  assert.throws(()=>decideAuditRepair("other",finding.id,"approve"),error=>error.status===404);
});

test("CI build health rejects malformed states and job results",()=>{assert.throws(()=>recordCiBuildRun({runId:"bad-state",status:"banana",conclusion:"success"}),error=>error.status===400);assert.throws(()=>recordCiBuildRun({runId:"bad-job",status:"completed",conclusion:"failure",jobs:[{name:"tests",result:"maybe"}]}),error=>error.status===400);const run=recordCiBuildRun({runId:"good-run",status:"completed",conclusion:"success",jobs:[{name:"tests",result:"success"}]});assert.equal(run.conclusion,"success");});
