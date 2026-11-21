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
const call = (path, { method = 'GET', data, cookie, headers = {} } = {}) => worker.fetch(new Request(`https://nyxthea.test${path}`, { method, headers: { ...(method !== 'GET' ? { origin: 'https://nyxthea.test', ...(data ? { 'content-type': 'application/json' } : {}) } : {}), ...(cookie ? { cookie } : {}), ...headers }, body: data ? JSON.stringify(data) : undefined }), env);
const body = async response => response.json();
const signup = data => call('/api/auth/register', { method: 'POST', data: { displayName: 'Someone', password: 'a-long-test-password-123', ...data } });

test('public sign-up closes after the household has its first account', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const owner = await signup({ username: 'first-owner' });
  assert.equal(owner.status, 201);
  const profiles = table('profiles').size;
  const stranger = await signup({ username: 'stranger' });
  assert.equal(stranger.status, 403);
  assert.match((await body(stranger)).error, /household invite/i);
  assert.equal(table('auth_accounts').has('stranger'), false);
  assert.equal(table('profiles').size, profiles);
  assert.equal(table('auth_accounts').size, 1);
});

test('closed sign-up stays closed after a cold restart', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  assert.equal((await signup({ username: 'restart-owner' })).status, 201);
  resetStateForTests(); object = new NyxtheaState({ storage }, env);
  assert.equal((await signup({ username: 'restart-stranger' })).status, 403);
  assert.equal(table('auth_accounts').has('restart-stranger'), false);
});

test('a household invite still creates a working sign-in for a new member', async () => {
  resetStateForTests(); storage.rows.clear(); object = new NyxtheaState({ storage }, env);
  const owner = await signup({ username: 'inviting-owner' });
  const ownerCookie = owner.headers.get('set-cookie').split(';')[0];
  const met = await call('/api/household/meet', { method: 'POST', cookie: ownerCookie, data: { displayName: 'Sister', birthday: '1994-05-06', relationshipToRequester: 'sister' } });
  assert.equal(met.status, 201);
  const metInfo = await body(met);
  assert.ok(metInfo.claimCode);

  const claimed = await call('/api/auth/claim', { method: 'POST', data: { inviteCode: metInfo.claimCode, username: 'invited-sister', password: 'invited-sister-password-123' } });
  assert.equal(claimed.status, 200);
  const claimedInfo = await body(claimed);
  assert.equal(claimedInfo.profile.id, metInfo.profile.id);
  const cookie = claimed.headers.get('set-cookie').split(';')[0];
  assert.equal((await body(await call('/api/auth/session', { cookie }))).profile.id, metInfo.profile.id);
  const login = await call('/api/auth/login', { method: 'POST', data: { username: 'invited-sister', password: 'invited-sister-password-123' } });
  assert.equal(login.status, 200);

  const reused = await call('/api/auth/claim', { method: 'POST', data: { inviteCode: metInfo.claimCode, username: 'second-sister', password: 'second-sister-password-123' } });
  assert.equal(reused.status, 401);
  assert.equal(table('auth_accounts').has('second-sister'), false);
});
