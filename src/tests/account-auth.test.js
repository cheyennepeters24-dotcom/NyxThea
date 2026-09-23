import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { NyxtheaState } from '../../_worker.js';
import { resetStateForTests } from '../state/store.js';

class FakeStorage {
  rows = new Map();
  async list({ prefix }) { return new Map([...this.rows].filter(([key]) => key.startsWith(prefix))); }
  async put(key, value) { this.rows.set(key, structuredClone(value)); }
  async delete(key) { this.rows.delete(key); }
  async transaction(callback) { return callback(this); }
}
const storage = new FakeStorage();
const env = { ASSETS: { fetch: () => new Response('asset') } };
let object = new NyxtheaState({ storage }, env);
env.NYXTHEA_STATE = { idFromName: () => 'primary', get: () => object };
const call = (path, { method = 'GET', data, cookie, origin = 'https://nyxthea.test', headers = {} } = {}) => worker.fetch(new Request(`https://nyxthea.test${path}`, { method, headers: { ...(method === 'POST' ? { origin, 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}), ...headers }, body: data ? JSON.stringify(data) : undefined }), env);
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
