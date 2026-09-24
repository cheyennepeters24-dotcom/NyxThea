import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { NyxtheaState } from '../../_worker.js';
import { resetStateForTests, table } from '../state/store.js';

class FakeStorage {
  rows = new Map();
  async list({ prefix }) { return new Map([...this.rows].filter(([key]) => key.startsWith(prefix))); }
  async get(key) { const value=this.rows.get(key); return value===undefined?undefined:structuredClone(value); }
  async put(key, value) { this.rows.set(key, structuredClone(value)); }
  async delete(key) { this.rows.delete(key); }
  async transaction(callback) { return callback(this); }
}
const storage = new FakeStorage();
const env = { ASSETS: { fetch: () => new Response('asset') } };
let object = new NyxtheaState({ storage }, env);
env.NYXTHEA_STATE = { idFromName: () => 'primary', get: () => object };
const call = (path, { method = 'GET', data, cookie, origin = 'https://nyxthea.test', headers = {} } = {}) => worker.fetch(new Request(`https://nyxthea.test${path}`, { method, headers: { ...(method !== 'GET' ? { origin, ...(data ? { 'content-type': 'application/json' } : {}) } : {}), ...(cookie ? { cookie } : {}), ...headers }, body: data ? JSON.stringify(data) : undefined }), env);
const body = async response => response.json();

test('registration creates a persistent private session without an owner claim', async () => {
  resetStateForTests(); storage.rows.clear();
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'cheyenne', displayName: 'Cheyenne', password: 'a-long-test-password-123' } });
  assert.equal(signup.status, 201);
  const info = await body(signup);
  assert.equal(info.profile.displayName, 'Cheyenne');
  assert.deepEqual(info.profile.permissions, []);
  assert.equal(info.profile.token, undefined);
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  assert.match(signup.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax/);
  assert.equal((await body(await call('/api/auth/session', { cookie }))).profile.id, info.profile.id);
  assert.equal((await call('/api/status', { headers: { 'x-nyxthea-profile': info.profile.id, 'x-nyxthea-profile-token': 'forged' } })).status, 401);
  assert.equal((await call('/api/memories', { method: 'POST', cookie, origin: 'https://evil.test', data: { text: 'cross-site' } })).status, 403);
  assert.equal((await call('/api/experience', { method: 'POST', cookie, data: { preferredName: 'Cheyenne', pronunciation: 'shy-ANN', onboarded: true } })).status, 200);
  resetStateForTests(); object = new NyxtheaState({ storage }, env);
  assert.equal((await body(await call('/api/auth/session', { cookie }))).profile.id, info.profile.id);
  assert.equal((await body(await call('/api/experience', { cookie }))).settings.pronunciation, 'shy-ANN');
  assert.equal((await call('/api/experience', { method: 'POST', cookie, data: { handsFreeEnabled: true } })).status, 200);
  resetStateForTests(); object = new NyxtheaState({ storage }, env);
  assert.equal((await body(await call('/api/experience', { cookie }))).settings.handsFreeEnabled, true);
  const wrong = await call('/api/auth/login', { method: 'POST', data: { username: 'cheyenne', password: 'wrong-password' } });
  assert.equal(wrong.status, 401);
  const login = await call('/api/auth/login', { method: 'POST', data: { username: 'cheyenne', password: 'a-long-test-password-123' } });
  assert.equal(login.status, 200);
  assert.equal((await call('/api/auth/logout', { method: 'POST', cookie, data: {} })).status, 200);
  assert.equal((await body(await call('/api/auth/session', { cookie }))).profile, null);
});

test('recovery rotates the one-time code, password, and sessions', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'alice', displayName: 'Alice', password: 'original-long-password' } });
  const { recoveryCode } = await body(signup);
  const oldCookie = signup.headers.get('set-cookie').split(';')[0];
  const recovered = await call('/api/auth/recover', { method: 'POST', data: { username: 'alice', recoveryCode, newPassword: 'replacement-long-password' } });
  assert.equal(recovered.status, 200);
  const rotated = await body(recovered);
  assert.notEqual(rotated.recoveryCode, recoveryCode);
  assert.equal((await body(await call('/api/auth/session', { cookie: oldCookie }))).profile, null);
  assert.equal((await call('/api/auth/recover', { method: 'POST', data: { username: 'alice', recoveryCode, newPassword: 'another-long-password' } })).status, 401);
  assert.equal((await call('/api/auth/login', { method: 'POST', data: { username: 'alice', password: 'original-long-password' } })).status, 401);
  assert.equal((await call('/api/auth/login', { method: 'POST', data: { username: 'alice', password: 'replacement-long-password' } })).status, 200);
});

test('voice transcription needs a signed-in session and bounds the uploaded clip', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'voice-tester', displayName: 'Voice', password: 'voice-test-password-123' } });
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  const audio = 'A'.repeat(400);
  const clip = { audio, type: 'audio/mp4' };
  let calls = 0;
  env.AI = { run: async (model, input) => { calls++; assert.equal(model, '@cf/openai/whisper-large-v3-turbo'); assert.equal(input.audio, audio); return { text: 'Hello Nyxthea' }; } };
  try {
    assert.equal((await call('/api/voice/transcribe', { method: 'POST', data: clip })).status, 401);
    assert.equal((await call('/api/voice/transcribe', { method: 'POST', cookie, origin: 'https://evil.test', data: clip })).status, 403);
    assert.equal((await call('/api/voice/transcribe', { method: 'POST', cookie, data: { ...clip, type: 'text/plain' } })).status, 400);
    assert.deepEqual(await body(await call('/api/voice/transcribe', { method: 'POST', cookie, data: clip })), { text: 'Hello Nyxthea' });
    assert.equal(calls, 1);
    assert.ok(![...storage.rows.keys()].some(key => key.includes(audio)));
  } finally { delete env.AI; }
});

test('voice activation checks a registered name without trusting a caller-supplied nickname', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'wake-tester', displayName: 'Wake', password: 'wake-test-password-123' } });
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  const phrase = { transcript: 'House Rose, can you help?', confidence: .92, authorizedNicknames: ['house rose'] };
  assert.equal((await call('/api/voice/interpret', { method: 'POST', data: phrase })).status, 401);
  assert.equal((await body(await call('/api/voice/interpret', { method: 'POST', cookie, data: phrase }))).safeToRespond, false);
  await call('/api/voice/nicknames', { method: 'POST', cookie, data: { nicknames: ['house rose'] } });
  const result = await body(await call('/api/voice/interpret', { method: 'POST', cookie, data: phrase }));
  assert.equal(result.safeToRespond, true);
  assert.equal(result.request, 'can you help');
});


test('a household invite claims the existing profile instead of creating a duplicate', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const ownerSignup = await call('/api/auth/register', { method: 'POST', data: { username: 'family-owner', displayName: 'Owner', password: 'family-owner-password-123' } });
  const ownerCookie = ownerSignup.headers.get('set-cookie').split(';')[0];
  await call('/api/household/identity', { method: 'POST', cookie: ownerCookie, data: { preferredName: 'Owner', birthday: '1990-01-01' } });
  const met = await call('/api/household/meet', { method: 'POST', cookie: ownerCookie, data: { displayName: 'Kid', birthday: '2018-08-01', relationshipToRequester: 'daughter' } });
  assert.equal(met.status, 201);
  const metInfo = await body(met);
  assert.equal(metInfo.identity.developmentalStage, 'young_child');
  const childProfileId = metInfo.profile.id;

  const claimed = await call('/api/auth/claim', { method: 'POST', data: { inviteCode: metInfo.claimCode, username: 'kid-profile', password: 'kid-profile-password-123' } });
  assert.equal(claimed.status, 200);
  const claimInfo = await body(claimed);
  assert.equal(claimInfo.profile.id, childProfileId);
  const childCookie = claimed.headers.get('set-cookie').split(';')[0];
  assert.equal((await body(await call('/api/auth/session', { cookie: childCookie }))).profile.id, childProfileId);

  const reused = await call('/api/auth/claim', { method: 'POST', data: { inviteCode: metInfo.claimCode, username: 'kid-profile-2', password: 'kid-profile-password-456' } });
  assert.equal(reused.status, 401);
});


test('adult Settings require fresh verification and child profiles are denied', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const adultSignup = await call('/api/auth/register', { method: 'POST', data: { username: 'settings-adult', displayName: 'Adult', password: 'settings-adult-password-123' } });
  const adultCookie = adultSignup.headers.get('set-cookie').split(';')[0];
  const device = 'adult-phone';
  const wrong = await call('/api/settings/verify-password', { method: 'POST', cookie: adultCookie, headers: { 'x-nyxthea-device': device }, data: { password: 'wrong', deviceId: device } });
  assert.equal(wrong.status, 401);
  const verified = await body(await call('/api/settings/verify-password', { method: 'POST', cookie: adultCookie, headers: { 'x-nyxthea-device': device }, data: { password: 'settings-adult-password-123', deviceId: device } }));
  assert.ok(verified.authorization.token);
  const pinSet = await call('/api/profile-lock/pin', { method: 'POST', cookie: adultCookie, headers: { 'x-nyxthea-device': device, 'x-nyxthea-settings-auth': verified.authorization.token }, data: { pin: '2468', deviceId: device } });
  assert.equal(pinSet.status, 200);
  const pinVerified = await body(await call('/api/settings/verify-pin', { method: 'POST', cookie: adultCookie, headers: { 'x-nyxthea-device': device }, data: { pin: '2468', deviceId: device } }));
  assert.ok(pinVerified.authorization.token);
  assert.equal((await call('/api/profile-lock/biometric',{method:'DELETE',cookie:adultCookie,headers:{'x-nyxthea-device':device},data:{deviceId:device}})).status,403);
  assert.equal((await call('/api/profile-lock/biometric',{method:'DELETE',cookie:adultCookie,headers:{'x-nyxthea-device':device,'x-nyxthea-settings-auth':verified.authorization.token},data:{deviceId:device}})).status,200);

  const met = await body(await call('/api/household/meet', { method: 'POST', cookie: adultCookie, headers: { 'x-nyxthea-device': device }, data: { displayName: 'Child', birthday: '2018-08-01', relationshipToRequester: 'daughter' } }));
  const claimed = await call('/api/auth/claim', { method: 'POST', data: { inviteCode: met.claimCode, username: 'settings-child', password: 'settings-child-password-123' } });
  const childCookie = claimed.headers.get('set-cookie').split(';')[0];
  const childSettings = await call('/api/settings/verify-password', { method: 'POST', cookie: childCookie, headers: { 'x-nyxthea-device': 'child-phone' }, data: { password: 'settings-child-password-123', deviceId: 'child-phone' } });
  assert.equal(childSettings.status, 403);
});


test('same-device household voice can hand off to a child profile without exposing adult context', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method:'POST', data:{ username:'family-voice-owner', displayName:'Parent', password:'family-voice-password-123' } });
  const cookie=signup.headers.get('set-cookie').split(';')[0],device='family-voice-phone';
  const met=await body(await call('/api/household/meet', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{displayName:'Kid',birthday:'2018-08-01',relationshipToRequester:'daughter'}
  }));
  const response=await body(await call('/api/voice/chat', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{message:'Do my homework assignment and give me the answer',speakerProfileId:met.profile.id}
  }));
  assert.equal(response.type,'education_guardrail');
  assert.match(response.answer,/can't do the assignment/i);
  assert.equal(response.speakerProfileId,met.profile.id);
});


test('household owner can manage integrations and save interface modules without a phantom admin flag', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'owner-ui', displayName: 'Owner', password: 'owner-ui-password-123' } });
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  const device='owner-ui-phone';

  const integration = await call('/api/integrations', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{ kind:'amazon_alexa_echo', permissions:[] }
  });
  assert.equal(integration.status, 201);
  const permission = await body(await call('/api/permissions/check', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{action:'integration_management'}
  }));
  assert.equal(permission.allowed, true);
  assert.equal(permission.required, 'owner_admin_only');

  const saved = await body(await call('/api/experience', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{ visibleModules:['world','security','amazon_alexa_echo'] }
  }));
  assert.deepEqual(saved.settings.visibleModules,['world','security','amazon_alexa_echo']);
  const loaded = await body(await call('/api/experience', { cookie, headers:{'x-nyxthea-device':device} }));
  assert.deepEqual(loaded.settings.visibleModules,['world','security','amazon_alexa_echo']);

  const tvSaved = await body(await call('/api/experience', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{ visibleModules:['world','tv'] }
  }));
  assert.deepEqual(tvSaved.settings.visibleModules,['world','tv']);

  const action = await body(await call('/api/actions', {
    method:'POST', cookie, headers:{'x-nyxthea-device':device},
    data:{type:'purchase',description:'Buy household supplies'}
  }));
  const authorized = await call(`/api/actions/authorize/${action.action.id}`, {
    method:'POST', cookie, headers:{'x-nyxthea-device':device}, data:{confirm:true}
  });
  assert.equal(authorized.status,200);
  assert.equal((await body(authorized)).action.status,'authorized_not_executed');
});


test('real household owner can revoke a member grant without a legacy admin flag', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method:'POST', data:{ username:'grant-owner', displayName:'Owner', password:'grant-owner-password-123' } });
  const info=await body(signup),cookie=signup.headers.get('set-cookie').split(';')[0],device='grant-owner-phone';
  assert.deepEqual(info.profile.permissions,[]);
  const met=await body(await call('/api/household/meet',{method:'POST',cookie,headers:{'x-nyxthea-device':device},data:{displayName:'Member',birthday:'2000-01-01',relationshipToRequester:'child'}}));
  table('profile_grants').set('grant_household_member',{
    id:'grant_household_member',from:met.profile.id,to:'external-recipient',domain:'preferences',permissions:['read'],active:true,createdAt:new Date().toISOString(),revokedAt:null,revokedBy:null
  });
  const revoked=await call('/api/profiles/grants/grant_household_member',{method:'DELETE',cookie,headers:{'x-nyxthea-device':device}});
  assert.equal(revoked.status,200);
  assert.equal((await body(revoked)).revoked,true);
  assert.equal(table('profile_grants').get('grant_household_member').revokedBy,info.profile.id);
});

test('device trust changes require fresh Settings verification', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup=await call('/api/auth/register',{method:'POST',data:{username:'device-trust-owner',displayName:'Owner',password:'device-trust-password-123'}});
  const cookie=signup.headers.get('set-cookie').split(';')[0],device='owner-phone',target='tablet-1';
  await call('/api/devices/register',{method:'POST',cookie,headers:{'x-nyxthea-device':device},data:{deviceId:target,label:'Tablet'}});
  const denied=await call(`/api/devices/${target}/trust`,{method:'POST',cookie,headers:{'x-nyxthea-device':device},data:{trusted:true}});
  assert.equal(denied.status,403);
  const verified=await body(await call('/api/settings/verify-password',{method:'POST',cookie,headers:{'x-nyxthea-device':device},data:{password:'device-trust-password-123',deviceId:device}}));
  const allowed=await call(`/api/devices/${target}/trust`,{method:'POST',cookie,headers:{'x-nyxthea-device':device,'x-nyxthea-settings-auth':verified.authorization.token},data:{trusted:true}});
  assert.equal(allowed.status,200);
  assert.equal((await body(allowed)).device.trusted,true);
});


test('changing the account password rotates sessions but keeps the current device signed in', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method:'POST', data:{ username:'rotate-password', displayName:'Rotate', password:'old-password-12345' } });
  const oldCookie=signup.headers.get('set-cookie').split(';')[0],device='rotate-phone';
  const verified=await body(await call('/api/settings/verify-password', {
    method:'POST', cookie:oldCookie, headers:{'x-nyxthea-device':device},
    data:{password:'old-password-12345',deviceId:device}
  }));
  const changed=await call('/api/settings/change-password', {
    method:'POST', cookie:oldCookie,
    headers:{'x-nyxthea-device':device,'x-nyxthea-settings-auth':verified.authorization.token},
    data:{currentPassword:'old-password-12345',newPassword:'new-password-67890',deviceId:device}
  });
  assert.equal(changed.status,200);
  const newCookie=changed.headers.get('set-cookie').split(';')[0];
  assert.notEqual(newCookie,oldCookie);
  assert.equal((await body(await call('/api/auth/session',{cookie:oldCookie}))).profile,null);
  assert.equal((await body(await call('/api/auth/session',{cookie:newCookie}))).profile.displayName,'Rotate');
  assert.equal((await call('/api/auth/login',{method:'POST',data:{username:'rotate-password',password:'old-password-12345'}})).status,401);
  assert.equal((await call('/api/auth/login',{method:'POST',data:{username:'rotate-password',password:'new-password-67890'}})).status,200);
});


test('adult profile cannot be unlocked through a direct bypass endpoint', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const signup = await call('/api/auth/register', { method: 'POST', data: { username: 'lock-bypass', displayName: 'Adult', password: 'lock-bypass-password-123' } });
  const cookie = signup.headers.get('set-cookie').split(';')[0], device='lock-phone';
  const verified = await body(await call('/api/settings/verify-password', { method: 'POST', cookie, headers: { 'x-nyxthea-device': device }, data: { password: 'lock-bypass-password-123', deviceId: device } }));
  await call('/api/profile-lock/pin', { method: 'POST', cookie, headers: { 'x-nyxthea-device': device, 'x-nyxthea-settings-auth': verified.authorization.token }, data: { pin: '1357', deviceId: device } });
  await call('/api/profile-lock/lock-device', { method: 'POST', cookie, headers: { 'x-nyxthea-device': device }, data: { deviceId: device } });
  const bypass = await call('/api/profile-lock/unlock-device', { method: 'POST', cookie, headers: { 'x-nyxthea-device': device }, data: { deviceId: device } });
  assert.equal(bypass.status, 404);
  const pin = await call('/api/profile-lock/pin/verify', { method: 'POST', cookie, headers: { 'x-nyxthea-device': device }, data: { pin: '1357', deviceId: device } });
  assert.equal(pin.status, 200);
});
