import { getCapabilities } from "./src/capabilities/capabilities.js";
import { describeDistributedSystem } from "./src/architecture/distributed.js";
import { registerEndpoint, removeEndpoint, trustedEndpointSignal, topology } from "./src/architecture/endpoints.js";
import { recordPresenceSignal, currentPresence } from "./src/architecture/presence.js";
import { basicEmergencyIncidents, evaluateSavedEmergency, markBasicEmergencySafe, recordBasicEmergencyLocation, recordEmergencyEvidence, saveEmergencyPolicy, startBasicEmergency } from "./src/architecture/emergency.js";
import { assessWakeContext, assessWakeTranscript, transitionVoice, voiceState, voicePlan } from "./src/architecture/voice.js";
import { recordObservation, proposeLearningChange, testProposal, learningStatus } from "./src/architecture/learning.js";
import { bootstrapOwner, createProfile, authenticate, grantAccess, revokeGrant, profileSummary, recordAccess, setWakeNicknames, profileById, accessAudit, systemAccessAudit } from "./src/profiles/profiles.js";
import { addPersonToHousehold, devicesFor, ensureHousehold, householdSummary, profileIdentity, registerDevice, saveProfileIdentity, setRelationship, trustedDevice } from "./src/profiles/household-identity.js";
import { addBiometricCredential, beginBiometric, deviceLockState, disableProfileLock, markDeviceLocked, markDeviceUnlocked, profileLock, removeBiometricCredential, setProfilePin, verifyBiometricCredential, verifyProfilePin } from "./src/profiles/profile-lock.js";
import { requireProfileAccess } from "./src/privacy/authorization.js";
import { requestConnection, authorizeConnection, revokeConnection, integrationStatus, integrationAudit } from "./src/integrations/integrations.js";
import { createRecord, listRecords, grantConsent, revokeConsent, vehicleExplanation } from "./src/domains/records.js";
import { orchestrate } from "./src/core/orchestration.js"; import { converseFast } from "./src/core/conversation.js"; import { buildContext } from "./src/core/context.js"; import { evaluateOpportunity } from "./src/core/opportunity.js"; import { conversationState, recordTurn, recentTurns, setConversationState } from "./src/core/conversation-state.js";
import { memoryService } from "./src/memory/memory-integration.js"; import { privacySummary } from "./src/privacy/privacy.js"; import { enforceRateLimit, MAX_MEDIA_JSON_BYTES, readJson, securityHeaders } from "./src/security.js";
import { captureWorldFact, worldFacts, worldSummary, changedSince } from "./src/models/world-model.js";
import { configurePerson, personModel, publicPerson, updatePreference } from "./src/models/person-model.js";
import { detectContext, protectIntent } from "./src/intelligence/context-engine.js";
import { assessImportance, compareTradeoffs } from "./src/intelligence/importance.js";
import { prepareAction, authorizeAction, actionStatus, verifyAction } from "./src/intelligence/action-engine.js";
import { addHouseholdItem, householdCommandCenter, predictRunout, catchUp } from "./src/intelligence/household.js";
import { educationGuidance } from "./src/intelligence/education.js";
import { createGoal, updateGoal, startExperiment, measureExperiment, rememberDecision, lifeDesignStatus } from "./src/intelligence/life-design.js";
import { prepareMusicCommand } from "./src/intelligence/music.js";
import { permissionDecision } from "./src/intelligence/permissions.js";
import { assessCrash, vehicleMode } from "./src/intelligence/vehicle.js";
import { selfMonitor, explainFailure, recordCiBuildRun, ciBuildRuns } from "./src/intelligence/monitoring.js";
import { hydrateDurableState, persistDurableState } from "./src/state/durable-store.js";
import { table } from "./src/state/store.js";
import { registerAccount, loginAccount, cookieProfile, logoutAccount, sessionCookie, clearSessionCookie, sameOrigin, authLimit, recoverAccount, createProfileClaimInvite, claimProfileAccount, verifyAccountPassword, accountRecoveryStatus, startRecoveryEmailVerification, confirmRecoveryEmail, startEmailPasswordRecovery, completeEmailPasswordRecovery, changeAccountPassword, cancelRecoveryEmailVerification, cancelEmailPasswordRecovery } from "./src/profiles/account-auth.js";
import { analyzeLiveGuide, liveGuideSessions, startLiveGuide, stopLiveGuide } from "./src/architecture/live-guide.js";
import { NYXTHEA_PRINCIPLES, experienceSettings, updateExperience, rosePresentation, queueLater, laterItems, resolveLater } from "./src/experience/design-system.js";
import { interpretTurn, recoveryLanguage } from "./src/experience/conversation.js";
import { classifyAction, createJob, stopJob, jobsFor } from "./src/intelligence/agency.js";
import { attentionDecision } from "./src/intelligence/attention.js";
import { identityPolicy, spokenPrivacy } from "./src/privacy/identity-policy.js";
import { alexaAuthorize, alexaToken, alexaProfile } from "./src/integrations/alexa-oauth.js";
import { mailConfigured, sendRecoveryMail } from "./src/integrations/recovery-mail.js";
import { issueSettingsAuthorization, requireSettingsAuthorization } from "./src/profiles/settings-auth.js";
import { ensureInitialSystemAdmin, isSystemAdmin, requireSystemAdmin, recordSystemAdminAction, systemAdminAudit } from "./src/security/system-admin.js";
const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: securityHeaders({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra }) });
async function secureTokenEqual(a,b){const supplied=String(a||""),expected=String(b||"");if(!expected)return false;const encoder=new TextEncoder(),[leftHash,rightHash]=await Promise.all([crypto.subtle.digest("SHA-256",encoder.encode(supplied)),crypto.subtle.digest("SHA-256",encoder.encode(expected))]),left=new Uint8Array(leftHash),right=new Uint8Array(rightHash);let diff=0;for(let i=0;i<left.length;i++)diff|=left[i]^right[i];return diff===0&&supplied.length>0}
async function identity(request, env) { const profile = await cookieProfile(request); if (profile) return profile; if (env.NYXTHEA_STATE) throw Object.assign(new Error("Authentication is required."), { status: 401 }); return authenticate({ profileId: request.headers.get("x-nyxthea-profile"), token: request.headers.get("x-nyxthea-profile-token") }); }
async function own(request, env, action) {
  const profile = await identity(request, env);
  ensureInitialSystemAdmin(profile, env.NYXTHEA_INITIAL_SYSTEM_ADMIN_PROFILE_ID);
  if (request.method !== "GET" && request.headers.get("cookie")?.includes("nyxthea_session=") && !sameOrigin(request)) throw Object.assign(new Error("Same-origin request required."), { status: 403 });
  const path=new URL(request.url).pathname;
  const lockExempt=path.startsWith("/api/profile-lock")||path==="/api/devices/register";
  if(!lockExempt){
    try{
      const deviceId=request.headers.get("x-nyxthea-device")||"";
      const state=deviceLockState(profile,{deviceId});
      if(state.enabled&&state.locked)throw Object.assign(new Error("This adult profile is locked on this device."),{status:423});
    }catch(error){if(error?.status!==403)throw error;}
  }
  enforceRateLimit(`${profile.id}:${path}`);
  recordAccess({ profileId: profile.id, action });
  return profile;
}
function isHouseholdAdmin(profile) { const household=householdSummary(profile.id); return Boolean(profile.permissions.includes("household_admin")||household?.createdBy===profile.id||household?.members?.some(member=>member.profileId===profile.id&&member.role==="owner")); }
function requireAdmin(profile) { if (!isHouseholdAdmin(profile)) throw Object.assign(new Error("Household administrator permission is required."), { status: 403 }); }
function requireAdultProfile(profile) {
  const identityRecord=profileIdentity(profile.id);
  const adult=identityRecord?.developmentalStage==="adult"||profile.role==="adult"||profile.role==="owner"||profile.permissions.includes("household_admin");
  if(!adult)throw Object.assign(new Error("Adult verification is required for Settings."),{status:403});
}
function domainForPath(path) { return path.slice(5).replace("pets", "pet").replace("vehicles", "vehicle").replace("health", "wellness"); }
async function api(request, env, url) {
  if(request.method==="POST"&&url.pathname==="/api/internal/ci-report"){
    if(!env.NYXTHEA_CI_INGEST_TOKEN)return json({error:"CI ingestion is not configured."},503);
    const authorization=request.headers.get("authorization")||"",token=authorization.startsWith("Bearer ")?authorization.slice(7):"";
    if(!await secureTokenEqual(token,env.NYXTHEA_CI_INGEST_TOKEN))return json({error:"Unauthorized."},401);
    const input=await readJson(request);
    return json({build:recordCiBuildRun(input)},201);
  }
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: securityHeaders({ allow: "GET, POST, DELETE, OPTIONS" }) });
  if (url.pathname === "/api/alexa/authorize") return alexaAuthorize(request, env);
  if (url.pathname === "/api/alexa/token") return json(await alexaToken(request, env));
  if (url.pathname === "/api/alexa/chat") {
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
    const profile = await alexaProfile(request);
    enforceRateLimit(`${profile.id}:alexa-chat`, { limit: 20, windowMs: 60000 });
    const { message } = await readJson(request);
    if (typeof message !== "string" || !message.trim() || message.length > 500) return json({ error: "Please ask a short question." }, 400);
    // The Echo can be heard by anyone nearby. Account linking identifies the
    // Amazon account, not the speaker. Do not expose private context or save a
    // turn as the linked person until per-speaker authorization is implemented.
    const prompt = message.trim();
    const education = educationGuidance(profile, prompt);
    if (!education.allowed) return json({ answer: education.response });
    const result = await orchestrate({ ai: env.AI, message: prompt, memories: [], conversation: [], authorization: { action: false }, mode: "normal" });
    return json({ answer: result.answer || "I'm having trouble answering right now. Please try again." });
  }
  if (request.method === "POST" && ["/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/auth/recover", "/api/auth/claim", "/api/auth/recover-email/start", "/api/auth/recover-email/complete"].includes(url.pathname) && !sameOrigin(request)) return json({ error: "Same-origin request required." }, 403);
  if (request.method === "POST" && url.pathname === "/api/auth/register") { authLimit(request, "register", 20, 3600000); const result = await registerAccount(await readJson(request)); return json({ profile: result.profile, recoveryCode: result.recoveryCode }, 201, { "set-cookie": sessionCookie(result.token) }); }
  if (request.method === "POST" && url.pathname === "/api/auth/login") { authLimit(request, "login", 10, 900000); const result = await loginAccount(await readJson(request)); return json({ profile: result.profile }, 200, { "set-cookie": sessionCookie(result.token) }); }
  if (request.method === "POST" && url.pathname === "/api/auth/claim") { authLimit(request, "claim", 10, 900000); const result = await claimProfileAccount(await readJson(request)); return json({ profile: result.profile, recoveryCode: result.recoveryCode }, 200, { "set-cookie": sessionCookie(result.token) }); }
  if (request.method === "POST" && url.pathname === "/api/auth/recover") { authLimit(request, "recover", 5, 900000); const result = await recoverAccount(await readJson(request)); return json({ profile: result.profile, recoveryCode: result.recoveryCode }, 200, { "set-cookie": sessionCookie(result.token) }); }
  if (request.method === "POST" && url.pathname === "/api/auth/recover-email/start") {
    authLimit(request, "recover-email", 5, 900000);
    if(!mailConfigured(env))return json({sent:false,error:"Recovery email delivery is not configured yet."},503);
    const input=await readJson(request), result=await startEmailPasswordRecovery(input.username);
    if(result.sent){try{await sendRecoveryMail(env,{to:result.email,kind:"recover",code:result.code})}catch(error){cancelEmailPasswordRecovery(input.username);throw error}}
    return json({sent:true});
  }
  if (request.method === "POST" && url.pathname === "/api/auth/recover-email/complete") {
    authLimit(request, "recover-email-complete", 10, 900000);
    const result=await completeEmailPasswordRecovery(await readJson(request));
    return json({profile:result.profile,recoveryCode:result.recoveryCode},200,{"set-cookie":sessionCookie(result.token)});
  }
  if (request.method === "POST" && url.pathname === "/api/auth/logout") { await logoutAccount(request); return json({ ok: true }, 200, { "set-cookie": clearSessionCookie }); }
  if (request.method === "GET" && url.pathname === "/api/auth/session") { const current = await cookieProfile(request); return json({ profile: current ? profileSummary(current) : null }); }
  if (!env.NYXTHEA_STATE && request.method === "POST" && url.pathname === "/api/auth/bootstrap") { enforceRateLimit("bootstrap", { limit: 10, windowMs: 60000 }); const input = await readJson(request); if (!env.NYXTHEA_DEV_BOOTSTRAP_TOKEN || input.token !== env.NYXTHEA_DEV_BOOTSTRAP_TOKEN) return json({ error: "Invalid development bootstrap token." }, 403); const owner = bootstrapOwner(env.NYXTHEA_DEV_BOOTSTRAP_TOKEN); return json({ profile: profileSummary(owner), credential: { profileId: owner.id, token: env.NYXTHEA_DEV_BOOTSTRAP_TOKEN }, notice: "Temporary local-development credential; not production authentication." }); }
  const profile = await own(request, env, `${request.method} ${url.pathname}`); const memory = memoryService("local-user", profile.id, { durable: Boolean(env.NYXTHEA_STATE) });
  if (request.method === "GET" && url.pathname === "/api/experience") return json({ settings: experienceSettings(profile.id), principles: NYXTHEA_PRINCIPLES, rose: rosePresentation("idle") });
  if (request.method === "POST" && url.pathname === "/api/experience") { const patch = await readJson(request); if (profile.role === "child" && patch.communicationStyle === "unfiltered") patch.communicationStyle = "natural"; return json({ settings: updateExperience(profile.id, patch) }); }
  if (request.method === "POST" && url.pathname === "/api/experience/rose") return json({ rose: rosePresentation((await readJson(request)).state) });
  if (request.method === "POST" && url.pathname === "/api/conversation/interpret") return json(interpretTurn(await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/recovery") return json(recoveryLanguage(await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/attention") return json(attentionDecision({ ...(await readJson(request)), ...experienceSettings(profile.id) }));
  if (request.method === "GET" && url.pathname === "/api/later") return json({ items: laterItems(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/later") return json({ item: queueLater(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && /^\/api\/later\/[^/]+\/resolve$/.test(url.pathname)) return json({ item: resolveLater(profile.id, url.pathname.split("/")[3], (await readJson(request)).status) });
  if (request.method === "POST" && url.pathname === "/api/agency/classify") return json(classifyAction(await readJson(request)));
  if (request.method === "GET" && url.pathname === "/api/agency/jobs") return json({ jobs: jobsFor(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/agency/jobs") return json({ job: createJob(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && /^\/api\/agency\/jobs\/[^/]+\/stop$/.test(url.pathname)) return json({ job: stopJob(profile.id, url.pathname.split("/")[4]) });
  if (request.method === "POST" && url.pathname === "/api/privacy/identity-policy") return json(identityPolicy({ ...(await readJson(request)), role: profile.role || (isHouseholdAdmin(profile) ? "owner" : "user") }));
  if (request.method === "POST" && url.pathname === "/api/privacy/spoken") return json(spokenPrivacy(await readJson(request)));
  if (request.method === "GET" && url.pathname === "/api/admin/access") return json({ householdAdmin: isHouseholdAdmin(profile), systemAdmin: isSystemAdmin(profile) });
  if (request.method === "GET" && url.pathname === "/api/admin/household") { requireAdmin(profile); return json({ household: householdSummary(profile.id), devices: devicesFor(profile.id), integrations: integrationStatus(profile.id) }); }
  if (request.method === "GET" && url.pathname === "/api/admin/system") { requireSystemAdmin(profile); recordSystemAdminAction(profile, "system.admin.opened"); return json({ monitoring: selfMonitor(profile.id, { aiConnected: Boolean(env.AI), systemWide: true }), systemAudit: systemAdminAudit(profile), accessAudit: systemAccessAudit(profile), integrationAudit: integrationAudit(), buildHealth: ciBuildRuns() }); }
  if (request.method === "GET" && url.pathname === "/api/audit") return json({ audit: accessAudit(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/settings/verify-password") {
    authLimit(request,`settings-password:${profile.id}`,10,900000); requireAdultProfile(profile); const input=await readJson(request); await verifyAccountPassword(profile.id,input.password);
    return json({authorization:issueSettingsAuthorization(profile.id,input.deviceId)});
  }
  if (request.method === "POST" && url.pathname === "/api/settings/change-password") {
    requireAdultProfile(profile); const input=await readJson(request);
    requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth"));
    const changed=await changeAccountPassword(profile.id,{currentPassword:input.currentPassword,newPassword:input.newPassword});
    return json({ok:true},200,{"set-cookie":sessionCookie(changed.token)});
  }
  if (request.method === "POST" && url.pathname === "/api/settings/verify-pin") {
    authLimit(request,`settings-pin:${profile.id}`,10,900000); requireAdultProfile(profile); const input=await readJson(request); await verifyProfilePin(profile,{pin:input.pin});
    return json({authorization:issueSettingsAuthorization(profile.id,input.deviceId)});
  }
  if (request.method === "GET" && url.pathname === "/api/recovery/status") return json({recovery:accountRecoveryStatus(profile.id),emailDeliveryConfigured:mailConfigured(env)});
  if (request.method === "POST" && url.pathname === "/api/recovery/email/start") {
    const input=await readJson(request); requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth"));
    if(!mailConfigured(env))return json({sent:false,error:"Recovery email delivery is not configured yet."},503);
    const result=await startRecoveryEmailVerification(profile.id,input.email);
    try{await sendRecoveryMail(env,{to:result.email,kind:"verify",code:result.code})}catch(error){cancelRecoveryEmailVerification(profile.id);throw error}
    return json({sent:true,email:result.email});
  }
  if (request.method === "POST" && url.pathname === "/api/recovery/email/confirm") {
    const input=await readJson(request); requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth"));
    return json(await confirmRecoveryEmail(profile.id,input.code));
  }
  if (request.method === "GET" && url.pathname === "/api/household/identity") return json({ identity: profileIdentity(profile.id), household: householdSummary(profile.id), devices: devicesFor(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/household/identity") {
    const input = await readJson(request), existingIdentity=profileIdentity(profile.id);
    if(existingIdentity?.developmentalStage!=="adult"&&existingIdentity?.birthday&&input.birthday!==undefined&&input.birthday!==existingIdentity.birthday)return json({error:"A child profile's birthday can only be changed by a household adult."},403);
    const identityRecord = saveProfileIdentity(profile, input);
    const experiencePatch = {};
    if (input.preferredName !== undefined) experiencePatch.preferredName = input.preferredName;
    if (input.pronunciation !== undefined) experiencePatch.pronunciation = input.pronunciation;
    const settings = Object.keys(experiencePatch).length ? updateExperience(profile.id, experiencePatch) : experienceSettings(profile.id);
    return json({ identity: identityRecord, household: householdSummary(profile.id), settings });
  }
  if (request.method === "POST" && url.pathname === "/api/household/meet") {
    requireAdmin(profile);
    const input = await readJson(request);
    if (!input.displayName?.trim()) return json({ error: "Tell me the new person's name first." }, 400);
    const created = createProfile({ displayName: input.displayName });
    saveProfileIdentity(created, { preferredName: input.displayName, pronunciation: input.pronunciation, birthday: input.birthday, birthdayMonthDay: input.birthdayMonthDay });
    const household = addPersonToHousehold(profile, created, { relationshipToRequester: input.relationshipToRequester, relationshipLabel: input.relationshipLabel });
    const claimCode = await createProfileClaimInvite(created.id, profile.id);
    return json({ profile: profileSummary(created), identity: profileIdentity(created.id), household, claimCode }, 201);
  }
  if (request.method === "POST" && url.pathname === "/api/household/member-identity") {
    requireAdmin(profile); const input=await readJson(request);
    requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth"));
    const household=householdSummary(profile.id);
    if(!household.members.some(member=>member.profileId===input.profileId))return json({error:"That person is not in this household."},404);
    const target=profileById(input.profileId);if(!target)return json({error:"That household profile is unavailable."},404);
    const identityRecord=saveProfileIdentity(target,{preferredName:input.preferredName,pronunciation:input.pronunciation,birthday:input.birthday,birthdayMonthDay:input.birthdayMonthDay});
    return json({identity:identityRecord,household:householdSummary(profile.id)});
  }
  if (request.method === "POST" && url.pathname === "/api/household/relationship") {
    requireAdmin(profile);
    const input = await readJson(request);
    const household = householdSummary(profile.id);
    if (!household.members.some(member => member.profileId === input.toProfileId)) return json({ error: "That person is not in this household." }, 404);
    return json({ relationship: setRelationship(profile.id, input.toProfileId, input.type, { label: input.label }), household: householdSummary(profile.id) });
  }
  if (request.method === "POST" && url.pathname === "/api/devices/register") {
    const input = await readJson(request);
    return json({ device: registerDevice(profile.id, { ...input, userAgent: request.headers.get("user-agent") || input.userAgent }) }, 201);
  }
  if (request.method === "GET" && url.pathname === "/api/devices") return json({ devices: devicesFor(profile.id) });
  if (request.method === "GET" && url.pathname === "/api/profile-lock") {
    const deviceId=url.searchParams.get("deviceId")||"";
    let state=null; try { state=deviceLockState(profile,{deviceId}); } catch(error) { if(error?.status===403)state={enabled:false,locked:false}; else throw error; }
    return json({ lock: profileLock(profile), state });
  }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/pin") { const input=await readJson(request); requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth")); const lock=await setProfilePin(profile,input); return json({ lock, unlock:markDeviceUnlocked(profile,{deviceId:input.deviceId}) }); }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/pin/verify") {
    authLimit(request,`profile-pin:${profile.id}`,10,900000); const input=await readJson(request); await verifyProfilePin(profile,input); return json({ unlock: markDeviceUnlocked(profile,{deviceId:input.deviceId}), lock:profileLock(profile) });
  }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/password/verify") {
    authLimit(request,`profile-password:${profile.id}`,10,900000); requireAdultProfile(profile); const input=await readJson(request); await verifyAccountPassword(profile.id,input.password);
    return json({unlock:markDeviceUnlocked(profile,{deviceId:input.deviceId}),lock:profileLock(profile)});
  }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/biometric/begin") {
    const input=await readJson(request); const origin=new URL(request.url).origin, rpId=new URL(request.url).hostname;
    return json(beginBiometric(profile,{...input,origin,rpId}));
  }
    if (request.method === "POST" && url.pathname === "/api/profile-lock/biometric") {
    const input=await readJson(request); requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth")); const lock=await addBiometricCredential(profile,input); return json({ lock, unlock:markDeviceUnlocked(profile,{deviceId:input.deviceId}) });
  }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/biometric/verify") {
    const input=await readJson(request); const result=await verifyBiometricCredential(profile,input);
    const payload={verified:true,unlock:markDeviceUnlocked(profile,{deviceId:input.deviceId})};
    if(input.purpose==="settings") payload.authorization=issueSettingsAuthorization(profile.id,input.deviceId);
    return json(payload);
  }
  if (request.method === "DELETE" && url.pathname === "/api/profile-lock/biometric") {
    const input=await readJson(request); requireSettingsAuthorization(profile.id,input.deviceId,request.headers.get("x-nyxthea-settings-auth")); return json({ lock:removeBiometricCredential(profile,input) });
  }
  if (request.method === "POST" && url.pathname === "/api/profile-lock/lock-device") {
    const input=await readJson(request); return json({ lock:markDeviceLocked(profile,input) });
  }
  if (request.method === "DELETE" && url.pathname === "/api/profile-lock") { requireSettingsAuthorization(profile.id,request.headers.get("x-nyxthea-device")||"",request.headers.get("x-nyxthea-settings-auth")); return json({ lock:disableProfileLock(profile) }); }
  if (request.method === "POST" && /^\/api\/devices\/[^/]+\/trust$/.test(url.pathname)) {
    const input = await readJson(request); requireSettingsAuthorization(profile.id,request.headers.get("x-nyxthea-device")||"",request.headers.get("x-nyxthea-settings-auth"));
    return json({ device: trustedDevice(profile.id, decodeURIComponent(url.pathname.split("/")[3]), input.trusted !== false) });
  }
  if (request.method === "POST" && url.pathname === "/api/profiles") { requireAdmin(profile); const created = createProfile(await readJson(request)); return json({ profile: profileSummary(created), credential: { profileId: created.id, token: created.token }, notice: "Credential is shown once. Persistent deployments store the profile in durable state." }, 201); }
  if (request.method === "GET" && url.pathname === "/api/status") { const integrations = integrationStatus(profile.id); return json({ name: "Nyxthea", memoryNotice: memory.storageNotice, privacy: privacySummary(), distributed: describeDistributedSystem(), topology: topology(profile.id), voice: voiceState(profile.id), actionPolicy: "No external action is available without an active authorized integration.", profile: profileSummary(profile), authentication: env.NYXTHEA_STATE ? "password account and server session" : "temporary local-development credential" }); }
  if (request.method === "GET" && url.pathname === "/api/capabilities") return json({ capabilities: getCapabilities({ aiConnected: Boolean(env.AI), integrations: integrationStatus(profile.id) }) });
  if (request.method === "POST" && url.pathname === "/api/world/facts") return json({ fact: captureWorldFact(profile.id, await readJson(request)) }, 201);
  if (request.method === "GET" && url.pathname === "/api/world/facts") return json({ facts: worldFacts(profile.id, { entityType: url.searchParams.get("type") || undefined, includeStale: url.searchParams.get("stale") === "true" }), summary: worldSummary(profile.id) });
  if (request.method === "GET" && url.pathname === "/api/world/changes") return json({ changes: changedSince(profile.id, url.searchParams.get("since")) });
  if (request.method === "POST" && url.pathname === "/api/person") return json({ person: configurePerson(profile, await readJson(request)) });
  if (request.method === "POST" && url.pathname.startsWith("/api/profiles/") && url.pathname.endsWith("/person")) { requireAdmin(profile); const target = profileById(url.pathname.split("/")[3]); if (!target) return json({ error: "Profile not found." }, 404); return json({ person: configurePerson(target, await readJson(request), { allowRole: true }) }); }
  if (request.method === "GET" && url.pathname === "/api/person") return json({ person: publicPerson(personModel(profile.id)) });
  if (request.method === "POST" && url.pathname === "/api/person/preferences") return json(updatePreference(profile.id, await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/intelligence/context") { const input = await readJson(request); const context = detectContext(input.message || "", input.context); return json({ context, intent: protectIntent(input.message || "", context) }); }
  if (request.method === "POST" && url.pathname === "/api/intelligence/importance") return json(assessImportance(await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/intelligence/tradeoffs") return json({ options: compareTradeoffs((await readJson(request)).options) });
  if (request.method === "POST" && url.pathname === "/api/permissions/check") { const input = await readJson(request),household=householdSummary(profile.id),householdAdmin=household?.createdBy===profile.id||household?.members?.some(member=>member.profileId===profile.id&&member.role==="owner"); return json(permissionDecision(profile, input.action, {...input,householdAdmin})); }
  if (request.method === "GET" && url.pathname.startsWith("/api/profiles/") && url.pathname.endsWith("/records")) { const targetProfileId = url.pathname.split("/")[3]; const domain = url.searchParams.get("domain"); const protectedDomain = { pet: "pet_care", vehicle: "vehicle_information", wellness: "health_wellness" }[domain]; if(!protectedDomain)return json({error:"Protected record domain must be pet, vehicle, or wellness."},400); requireProfileAccess({ requester: profile, targetProfileId, domain: protectedDomain }); return json({ records: listRecords(targetProfileId, domain) }); }
  if (request.method === "POST" && url.pathname === "/api/profiles/grants") { const input = await readJson(request); if (input.from !== profile.id) return json({ error: "A profile may grant only its own protected data." }, 403); return json({ grant: grantAccess(input) }, 201); }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/profiles/grants/")) { const household=householdSummary(profile.id); return json({ revoked: revokeGrant(profile, url.pathname.split("/").at(-1), { householdAdmin:isHouseholdAdmin(profile), householdProfileIds:(household.members||[]).map(member=>member.profileId) }) }); }
  if (request.method === "GET" && url.pathname === "/api/endpoints") return json({ topology: topology(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/endpoints") { requireAdmin(profile); return json({ endpoint: registerEndpoint({ ...(await readJson(request)), ownerProfileId: profile.id }) }, 201); }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/endpoints/")) return json({ deleted: removeEndpoint(profile.id, url.pathname.split("/").at(-1)) });
  if (request.method === "POST" && url.pathname === "/api/presence/signals") { const input = await readJson(request); const signal = trustedEndpointSignal(profile.id, input); return json({ signal: recordPresenceSignal(profile.id, { ...signal, state: input.state }), assessment: currentPresence(profile.id) }, 201); }
  if (request.method === "GET" && url.pathname === "/api/presence") return json(currentPresence(profile.id));
  if (request.method === "POST" && url.pathname === "/api/emergency/policies") { requireAdmin(profile); return json({ policy: saveEmergencyPolicy(profile.id, await readJson(request)) }, 201); }
  if (request.method === "POST" && url.pathname === "/api/emergency/evidence") return json({ evidence: recordEmergencyEvidence(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && url.pathname.startsWith("/api/emergency/evaluate/")) return json(evaluateSavedEmergency(profile.id, url.pathname.split("/").at(-1)));
  if (request.method === "GET" && url.pathname === "/api/emergency/incidents") return json({ incidents: basicEmergencyIncidents(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/emergency/incidents") return json({ incident: startBasicEmergency(profile.id, await readJson(request)), action: "proposal_only", audio: "remain_quiet" }, 202);
  if (request.method === "POST" && /^\/api\/emergency\/incidents\/[^/]+\/location$/.test(url.pathname)) return json({ incident: recordBasicEmergencyLocation(profile.id, url.pathname.split("/")[4], await readJson(request)) });
  if (request.method === "POST" && /^\/api\/emergency\/incidents\/[^/]+\/mark-safe$/.test(url.pathname)) return json({ incident: markBasicEmergencySafe(profile.id, url.pathname.split("/")[4], await readJson(request)) });
  if (request.method === "GET" && url.pathname === "/api/integrations") return json({ integrations: integrationStatus(profile.id), notice: "No external provider is connected." });
  if (request.method === "POST" && url.pathname === "/api/integrations") { requireAdmin(profile); const { kind, permissions } = await readJson(request); return json({ integration: requestConnection(profile.id, kind, permissions) }, 201); }
  if (request.method === "POST" && url.pathname.startsWith("/api/integrations/authorize/")) return json({ integration: authorizeConnection(profile.id, url.pathname.split("/").at(-1), (await readJson(request)).permissions) });
  if (request.method === "DELETE" && url.pathname.startsWith("/api/integrations/")) return json({ revoked: revokeConnection(profile.id, url.pathname.split("/").at(-1)) });
  if (request.method === "GET" && url.pathname === "/api/integrations/audit") { requireSystemAdmin(profile); recordSystemAdminAction(profile, "integration.audit.viewed"); return json({ audit: integrationAudit() }); }
  if (request.method === "POST" && url.pathname === "/api/consents") return json({ consent: grantConsent(profile.id, await readJson(request)) }, 201);
  if (request.method === "DELETE" && url.pathname.startsWith("/api/consents/")) return json({ revoked: revokeConsent(profile.id, url.pathname.split("/").at(-1)) });
  if (request.method === "POST" && /^\/api\/(pets|vehicles|wellness|health)$/.test(url.pathname)) { const domain = domainForPath(url.pathname); const input = await readJson(request); if (domain === "wellness") requireProfileAccess({ requester: profile, targetProfileId: profile.id, domain: "health_wellness", consentId: input.consentId, consentDomain: "wellness" }); return json({ record: createRecord(profile.id, domain, input.type, input.data) }, 201); }
  if (request.method === "GET" && /^\/api\/(pets|vehicles|wellness|health)$/.test(url.pathname)) { const domain = domainForPath(url.pathname); const records = listRecords(profile.id, domain); return json({ records, explanations: domain === "vehicle" ? records.map(vehicleExplanation) : [] }); }
  if (request.method === "POST" && url.pathname === "/api/learning/observations") return json({ observation: recordObservation(profile.id, (await readJson(request)).observation) }, 201);
  if (request.method === "POST" && url.pathname === "/api/learning/proposals") { const input = await readJson(request); return json({ proposal: proposeLearningChange({ profileId: profile.id, observationId: input.observationId, proposedChange: input.proposedChange, authorized: isHouseholdAdmin(profile) }) }, 201); }
  if (request.method === "POST" && url.pathname.startsWith("/api/learning/test/")) return json({ proposal: testProposal(profile.id, url.pathname.split("/").at(-1), await readJson(request)) });
  if (request.method === "GET" && url.pathname === "/api/learning") return json(learningStatus(profile.id));
  if (request.method === "POST" && url.pathname === "/api/opportunities/evaluate") return json(await evaluateOpportunity(await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/actions") return json({ action: prepareAction(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && url.pathname.startsWith("/api/actions/authorize/")) { const input=await readJson(request); return json({ action: authorizeAction(profile, url.pathname.split("/").at(-1), {...input,householdAdmin:isHouseholdAdmin(profile)}) }); }
  if (request.method === "POST" && url.pathname.startsWith("/api/actions/verify/")) return json({ action: verifyAction(profile.id, url.pathname.split("/").at(-1), await readJson(request)) });
  if (request.method === "GET" && url.pathname === "/api/actions") return json({ actions: actionStatus(profile.id) });
  if (request.method === "POST" && url.pathname === "/api/household") return json({ item: addHouseholdItem(profile.id, await readJson(request)) }, 201);
  if (request.method === "GET" && url.pathname === "/api/household/command-center") return json(householdCommandCenter(profile.id));
  if (request.method === "POST" && url.pathname.startsWith("/api/household/runout/")) return json(predictRunout(profile.id, url.pathname.split("/").at(-1), await readJson(request)));
  if (request.method === "GET" && url.pathname === "/api/household/catch-up") return json({ changes: catchUp(profile.id, url.searchParams.get("since")) });
  if (request.method === "POST" && url.pathname === "/api/education/help") return json(educationGuidance(profile, (await readJson(request)).message || ""));
  if (request.method === "POST" && url.pathname === "/api/goals") return json({ goal: createGoal(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && url.pathname.startsWith("/api/goals/")) return json({ goal: updateGoal(profile.id, url.pathname.split("/").at(-1), (await readJson(request)).completedSteps) });
  if (request.method === "POST" && url.pathname === "/api/experiments") return json({ experiment: startExperiment(profile.id, await readJson(request)) }, 201);
  if (request.method === "POST" && url.pathname.startsWith("/api/experiments/")) return json({ experiment: measureExperiment(profile.id, url.pathname.split("/").at(-1), (await readJson(request)).value) });
  if (request.method === "POST" && url.pathname === "/api/decisions") return json({ decision: rememberDecision(profile.id, await readJson(request)) }, 201);
  if (request.method === "GET" && url.pathname === "/api/life-design") return json(lifeDesignStatus(profile.id));
  if (request.method === "POST" && url.pathname === "/api/music/command") return json(prepareMusicCommand(profile.id, await readJson(request)));
  if (request.method === "POST" && url.pathname === "/api/vehicle/crash-assessment") return json(assessCrash((await readJson(request)).signals));
  if (request.method === "POST" && url.pathname === "/api/vehicle/mode") return json(vehicleMode(await readJson(request)));
  if (request.method === "GET" && url.pathname === "/api/live-guide") return json({ sessions: liveGuideSessions(profile.id), visionAvailable: Boolean(env.AI), mediaRetention: "Raw camera, screen, and microphone data is not stored by Nyxthea." });
  if (request.method === "POST" && url.pathname === "/api/live-guide") return json({ session: startLiveGuide(profile.id, await readJson(request), { visionAvailable: Boolean(env.AI), profileRole: profile.role || (isHouseholdAdmin(profile) ? "adult" : "unspecified") }) }, 201);
  if (request.method === "POST" && /^\/api\/live-guide\/[^/]+\/analyze$/.test(url.pathname)) { enforceRateLimit(`${profile.id}:live-guide-analysis`, { limit: 12, windowMs: 60000 }); const sessionId = url.pathname.split("/")[3]; return json(await analyzeLiveGuide(profile.id, sessionId, await readJson(request, MAX_MEDIA_JSON_BYTES), { ai: env.AI })); }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/live-guide/")) return json({ session: stopLiveGuide(profile.id, url.pathname.split("/")[3]) });
  if (request.method === "POST" && url.pathname === "/api/emergency/silent") { const incident = startBasicEmergency(profile.id, await readJson(request)); return json({ ...incident, incident, action: "proposal_only", audio: "remain_quiet", next: "use_native_emergency_call_or_one_time_location_if_needed" }, 202); }
  if (request.method === "GET" && url.pathname === "/api/monitoring") { requireSystemAdmin(profile); recordSystemAdminAction(profile, "system.monitoring.viewed"); return json(selfMonitor(profile.id, { aiConnected: Boolean(env.AI) })); }
  if (request.method === "POST" && url.pathname === "/api/recovery/explain") return json(explainFailure(await readJson(request)));
  if (request.method === "GET" && url.pathname === "/api/voice/plan") return json(voicePlan());
  if (request.method === "POST" && url.pathname === "/api/voice/chat") {
    const { message } = await readJson(request);
    if (typeof message !== "string" || !message.trim() || message.length > 1200) return json({ error: "Message must be 1–1200 characters." }, 400);
    const prompt=message.trim();
    recordTurn(profile.id,"user",prompt);
    const education=educationGuidance(profile,prompt);
    if(!education.allowed){recordTurn(profile.id,"assistant",education.response);return json({answer:education.response,type:"education_guardrail"});}
    try{
      const context=buildContext({conversation:recentTurns(profile.id).slice(-4)});
      const response=await Promise.race([
        converseFast(env.AI,prompt,context),
        new Promise((_,reject)=>setTimeout(()=>reject(Object.assign(new Error("Voice response timed out."),{status:504})),8000))
      ]);
      if(response.text)recordTurn(profile.id,"assistant",response.text);
      return json({answer:response.text,modelUsed:response.modelUsed,fast:true});
    }catch{
      return json({answer:"I hit a snag. Ask me that again.",degraded:true,fast:true});
    }
  }
  if (request.method === "POST" && url.pathname === "/api/voice/speak") {
    if (!env.AI) return json({ error: "Natural voice is unavailable right now." }, 503);
    const { text, speaker } = await readJson(request);
    const spoken=String(text||"").trim();
    if(!spoken||spoken.length>1800) return json({ error:"Speech text must be 1–1800 characters." },400);
    enforceRateLimit(`${profile.id}:voice-speak`, { limit: 60, windowMs: 60000 });
    try{
      const allowed=new Set(["luna","athena","asteria","hera","stella","aurora","cora","delia","electra","helena","iris","juno","ophelia","phoebe","thalia","theia","vesta"]);
      const selected=allowed.has(String(speaker||"").toLowerCase())?String(speaker).toLowerCase():"luna";
      const audio=await Promise.race([env.AI.run("@cf/deepgram/aura-2-en",{text:spoken,speaker:selected,encoding:"mp3"},{returnRawResponse:true}),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Natural voice timed out.")),6000))]);
      if(!audio?.ok||!audio.body)throw new Error("Natural voice provider returned an invalid response.");
      const providerType=String(audio.headers?.get("content-type")||"").toLowerCase();
      if(providerType&&!providerType.startsWith("audio/"))throw new Error("Natural voice provider returned non-audio content.");
      const headers=new Headers(audio.headers);headers.set("cache-control","no-store");headers.set("content-type",providerType||"audio/mpeg");
      return new Response(audio.body,{status:200,headers});
    }catch{return json({ error:"Natural voice could not finish. Falling back to the device voice." },503);}
  }
  if (request.method === "POST" && url.pathname === "/api/voice/transcribe") {
    if (!env.AI) return json({ error: "Voice transcription is unavailable right now." }, 503);
    const { audio, type } = await readJson(request, MAX_MEDIA_JSON_BYTES);
    if (typeof audio !== "string" || audio.length < 100 || audio.length > 1400000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio) || !["audio/mp4", "audio/webm", "audio/wav", "audio/ogg", "audio/mpeg", "audio/x-m4a"].includes(type)) return json({ error: "Please record a short audio clip and try again." }, 400);
    // Family Alpha rule: ordinary conversation never hits a daily "come back later" quota.
    // Keep only burst protection so a runaway client cannot hammer transcription infrastructure.
    enforceRateLimit(`${profile.id}:voice-transcribe`, { limit: 90, windowMs: 60000 });
    try {
      const result = await Promise.race([env.AI.run("@cf/openai/whisper-large-v3-turbo", { audio, task: "transcribe", language: "en" }),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Voice transcription timed out.")),6000))]);
      const text = String(result?.text || "").trim().slice(0, 4000);
      return json({ text });
    } catch { return json({ error: "Voice transcription could not finish. Please try again or type your message." }, 503); }
  }
  if (request.method === "POST" && url.pathname === "/api/voice/nicknames") return json({ profile: profileSummary(setWakeNicknames(profile, (await readJson(request)).nicknames)) });
  if (request.method === "POST" && url.pathname === "/api/voice/wake") { const result = assessWakeContext({ ...(await readJson(request)), authorizedNicknames: profile.wakeNicknames || [] }); if (result.safeToRespond) transitionVoice(profile.id, "wake"); return json({ ...result, session: voiceState(profile.id) }); }
  if (request.method === "POST" && url.pathname === "/api/voice/interpret") { const { transcript, confidence } = await readJson(request); if(typeof transcript!=="string"||transcript.length>500) return json({ error:"Short speech transcript required." },400); const result=assessWakeTranscript({ transcript, confidence, authorizedNicknames:profile.wakeNicknames||[] }); if(result.safeToRespond) transitionVoice(profile.id,"wake"); return json(result); }
  if (request.method === "POST" && url.pathname === "/api/voice/state") return json({ session: transitionVoice(profile.id, (await readJson(request)).event) });
  if (request.method === "GET" && url.pathname === "/api/memories") return json({ memories: memory.inspect(url.searchParams.get("layer") || undefined), layers: memory.layers, retention: memory.retention, notice: memory.storageNotice });
  if (request.method === "POST" && url.pathname === "/api/memories") { const { text, layer } = await readJson(request); if (typeof text !== "string" || !text.trim() || text.length > 4000) return json({ error: "Memory text must be 1–4000 characters." }, 400); return json({ memory: memory.remember(text, layer), notice: memory.storageNotice }, 201); }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/memories/")) return json({ deleted: memory.forget(url.pathname.split("/").at(-1)) });
  if (request.method === "DELETE" && url.pathname === "/api/memories") return json({ deleted: memory.clear(url.searchParams.get("layer") || undefined) });
  if (request.method === "POST" && url.pathname === "/api/conversation/state") return json({ state: setConversationState(profile.id, (await readJson(request)).mode) });
  if (request.method === "POST" && url.pathname === "/api/chat") { const { message } = await readJson(request); if (typeof message !== "string" || !message.trim() || message.length > 4000) return json({ error: "Message must be 1–4000 characters." }, 400); recordTurn(profile.id, "user", message.trim()); const education = educationGuidance(profile, message); if (!education.allowed) { recordTurn(profile.id, "assistant", education.response); return json({ type: "education_guardrail", answer: education.response, education, memoryNotice: memory.storageNotice, conversation: recentTurns(profile.id) }); } const result = await orchestrate({ ai: env.AI, message: message.trim(), memories: memory.retrieve(message), conversation: recentTurns(profile.id), authorization: { action: false }, mode: conversationState(profile.id).mode }); if (result.answer) recordTurn(profile.id, "assistant", result.answer); return json({ ...result, memoryNotice: memory.storageNotice, conversation: recentTurns(profile.id) }); }
  return json({ error: "Not found." }, 404);
}

const durableKey=(collection,key)=>`nyxthea-state:${collection}:${encodeURIComponent(key)}`;
const digestHex=async value=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(value))))].map(n=>n.toString(16).padStart(2,"0")).join("");
function sessionCookieValue(request){
  const raw=request.headers.get("cookie")||"";
  const pair=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith("nyxthea_session="));
  return pair?.slice("nyxthea_session=".length)||"";
}
async function directVoiceProfile(storage,request){
  if(request.method!=="GET"&&request.headers.get("cookie")?.includes("nyxthea_session=")&&!sameOrigin(request))throw Object.assign(new Error("Same-origin request required."),{status:403});
  const token=sessionCookieValue(request);if(!token)throw Object.assign(new Error("Authentication is required."),{status:401});
  const hash=await digestHex(token);
  const session=await storage.get(durableKey("auth_sessions",hash));
  if(!session||!Number.isFinite(Number(session.expiresAt))||Number(session.expiresAt)<=Date.now())throw Object.assign(new Error("Authentication is required."),{status:401});
  const profile=await storage.get(durableKey("profiles",session.profileId));
  if(!profile)throw Object.assign(new Error("Authentication is required."),{status:401});
  const lock=await storage.get(durableKey("profile_locks",profile.id));
  if(lock?.enabled){
    const deviceId=request.headers.get("x-nyxthea-device")||"";
    if(!deviceId||!(lock.unlockedDevices||[]).includes(deviceId))throw Object.assign(new Error("This adult profile is locked on this device."),{status:423});
  }
  return profile;
}
async function directHouseholdSpeaker(storage,requester,speakerProfileId){
  const targetId=String(speakerProfileId||"").trim();if(!targetId||targetId===requester.id)return requester;
  if(requester.role==="child")throw Object.assign(new Error("A child session cannot switch to another household speaker."),{status:403});
  const rows=await storage.list({prefix:"nyxthea-state:household_memberships:"});
  const memberships=[...rows.values()].filter(x=>x?.active!==false);
  const own=memberships.find(x=>x.profileId===requester.id),target=memberships.find(x=>x.profileId===targetId);
  if(!own||!target||own.householdId!==target.householdId)throw Object.assign(new Error("That speaker is not in this household."),{status:403});
  const profile=await storage.get(durableKey("profiles",targetId));if(!profile)throw Object.assign(new Error("That household profile is unavailable."),{status:404});
  if(profile.role!=="child")throw Object.assign(new Error("An adult speaker must sign in to their own profile."),{status:403});
  return profile;
}
export class NyxtheaState {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; this.queue = Promise.resolve(); this.mediaLimits = new Map(); this.hydrated=false; this.hydrating=null; this.persistedState=null; }
  async ensureHydrated(){
    if(this.hydrated)return;
    if(!this.hydrating)this.hydrating=hydrateDurableState(this.ctx.storage).then(before=>{this.persistedState=before;this.hydrated=true}).finally(()=>{this.hydrating=null});
    await this.hydrating;
  }
  mediaAllowed(profileId,path,limit){
    const key=`${profileId}:${path}`,now=Date.now(),entry=this.mediaLimits.get(key)||{start:now,count:0};
    if(now-entry.start>=60000){entry.start=now;entry.count=0}
    entry.count++;this.mediaLimits.set(key,entry);return entry.count<=limit;
  }
  async fastMedia(request,url){
    try{
      const profile=await directVoiceProfile(this.ctx.storage,request);
      if(url.pathname==="/api/voice/transcribe"){
        if(!this.env.AI)return json({error:"Voice transcription is unavailable right now."},503);
        if(!this.mediaAllowed(profile.id,url.pathname,75))return json({error:"Voice listener is cooling down for a moment."},429);
        const {audio,type}=await readJson(request,MAX_MEDIA_JSON_BYTES);
        if(typeof audio!=="string"||audio.length<100||audio.length>1400000||!/^[A-Za-z0-9+/]+={0,2}$/.test(audio)||!["audio/mp4","audio/webm","audio/wav","audio/ogg","audio/mpeg","audio/x-m4a"].includes(type))return json({error:"Please record a short audio clip and try again."},400);
        try{
          const result=await Promise.race([this.env.AI.run("@cf/openai/whisper-large-v3-turbo",{audio,task:"transcribe",language:"en"}),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Voice transcription timed out.")),6000))]);
          return json({text:String(result?.text||"").trim().slice(0,4000)});
        }catch{return json({error:"Voice transcription could not finish."},503)}
      }
      if(url.pathname==="/api/voice/chat"){
        if(!this.mediaAllowed(profile.id,url.pathname,60))return json({answer:"Give me a second and ask that again.",degraded:true,fast:true},429);
        const {message,speakerProfileId}=await readJson(request),prompt=String(message||"").trim();
        if(!prompt||prompt.length>1200)return json({error:"Message must be 1–1200 characters."},400);
        const speaker=await directHouseholdSpeaker(this.ctx.storage,profile,speakerProfileId);
        const education=educationGuidance(speaker,prompt); if(!education.allowed)return json({answer:education.response,type:"education_guardrail",fast:true,speakerProfileId:speaker.id});
        if(!this.env.AI)return json({answer:"I'm having trouble reaching my conversation model right now.",degraded:true,fast:true,speakerProfileId:speaker.id},503);
        try{
          const response=await Promise.race([converseFast(this.env.AI,prompt,{conversation:[]}),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Voice response timed out.")),8000))]);
          return json({answer:response.text,modelUsed:response.modelUsed,fast:true,speakerProfileId:speaker.id});
        }catch{return json({answer:"I hit a snag. Ask me that again.",degraded:true,fast:true})}
      }
      if(url.pathname==="/api/voice/speak"){
        if(!this.env.AI)return json({error:"Natural voice is unavailable right now."},503);
        if(!this.mediaAllowed(profile.id,url.pathname,60))return json({error:"Voice output is cooling down for a moment."},429);
        const {text,speaker}=await readJson(request),spoken=String(text||"").trim();
        if(!spoken||spoken.length>1800)return json({error:"Speech text must be 1–1800 characters."},400);
        try{
          const allowed=new Set(["luna","athena","asteria","hera","stella","aurora","cora","delia","electra","helena","iris","juno","ophelia","phoebe","thalia","theia","vesta"]);
          const selected=allowed.has(String(speaker||"").toLowerCase())?String(speaker).toLowerCase():"luna";
          const audio=await Promise.race([this.env.AI.run("@cf/deepgram/aura-2-en",{text:spoken,speaker:selected,encoding:"mp3"},{returnRawResponse:true}),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Natural voice timed out.")),6000))]);
          if(!audio?.ok||!audio.body)return json({error:"Natural voice provider did not return audio."},503);
          const headers=new Headers(audio.headers),contentType=String(headers.get("content-type")||"").toLowerCase();
          if(!contentType.startsWith("audio/"))return json({error:"Natural voice provider returned an invalid response."},503);
          headers.set("cache-control","no-store");
          return new Response(audio.body,{status:200,headers});
        }catch{return json({error:"Natural voice could not finish."},503)}
      }
      return json({error:"Not found."},404);
    }catch(error){return json({error:error instanceof Error?error.message:"Something went wrong."},Number.isInteger(error?.status)?error.status:500)}
  }
  fetch(request) {
    const url=new URL(request.url);
    if(request.method==="POST"&&(url.pathname==="/api/voice/transcribe"||url.pathname==="/api/voice/speak"||url.pathname==="/api/voice/chat"))return this.fastMedia(request,url);
    const run = this.queue.then(async () => {
      await this.ensureHydrated();
      try {
        const response=await api(request, this.env, url);
        this.persistedState=await persistDurableState(this.ctx.storage, this.persistedState);
        return response;
      } catch(error) {
        this.persistedState=await hydrateDurableState(this.ctx.storage);
        throw error;
      }
    });
    this.queue = run.catch(() => undefined);
    return run;
  }
}

export default { async fetch(request, env) { const url = new URL(request.url); try { if (url.pathname.startsWith("/api/")) { if (env.NYXTHEA_STATE) { const id = env.NYXTHEA_STATE.idFromName("primary"); return await env.NYXTHEA_STATE.get(id).fetch(request); } return await api(request, env, url); } const asset = await env.ASSETS.fetch(request); const headers = new Headers(asset.headers); for (const [key, value] of Object.entries(securityHeaders())) headers.set(key, value); return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers }); } catch (error) { return json({ error: error instanceof Error ? error.message : "Something went wrong." }, Number.isInteger(error?.status) ? error.status : 500); } } };
