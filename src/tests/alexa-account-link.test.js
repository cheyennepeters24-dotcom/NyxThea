import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { NyxtheaState } from '../../_worker.js';
import { resetStateForTests, table } from '../state/store.js';

class Storage {
  rows = new Map();
  async list({ prefix }) { return new Map([...this.rows].filter(([key]) => key.startsWith(prefix))); }
  async put(key, value) { this.rows.set(key, structuredClone(value)); }
  async delete(key) { this.rows.delete(key); }
  async transaction(fn) { return fn(this); }
}

test('Alexa linking requires consent, registered redirect, client secret and one-use codes', async () => {
  resetStateForTests();
  const storage = new Storage();
  const env = { ASSETS: { fetch: () => new Response('asset') }, ALEXA_OAUTH_CLIENT_ID: 'nyx-alexa', ALEXA_OAUTH_CLIENT_SECRET: 'test-secret', ALEXA_REDIRECT_URIS: 'https://pitangui.amazon.com/api/skill/link/example' };
  let object = new NyxtheaState({ storage }, env);
  env.NYXTHEA_STATE = { idFromName: () => 'primary', get: () => object };
  const call = (path, options = {}) => worker.fetch(new Request(`https://nyxthea.test${path}`, { method: options.method || 'GET', headers: options.headers, body: options.body }), env);
  const signup = await call('/api/auth/register', { method: 'POST', headers: { origin: 'https://nyxthea.test', 'content-type': 'application/json' }, body: JSON.stringify({ username: 'alexa-tester', password: 'a-very-long-password-123', displayName: 'Cheyenne' }) });
  const { recoveryCode } = await signup.clone().json();
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  const redirect = 'https://pitangui.amazon.com/api/skill/link/example';
  const fields = { client_id: 'nyx-alexa', redirect_uri: redirect, response_type: 'code', state: 'state123', approve: 'yes' };
  const params = new URLSearchParams(fields);
  assert.equal((await call(`/api/alexa/authorize?${params}`)).status, 200);
  assert.equal((await call(`/api/alexa/authorize?${new URLSearchParams({ ...fields, redirect_uri: 'https://evil.test/' })}`)).status, 400);
  assert.equal((await call('/api/alexa/authorize', { method: 'POST', headers: { origin: 'https://evil.test', cookie }, body: params })).status, 403);
  const approval = await call('/api/alexa/authorize', { method: 'POST', headers: { origin: 'https://nyxthea.test', cookie }, body: params });
  assert.equal(approval.status, 302);
  const destination = new URL(approval.headers.get('location'));
  assert.equal(destination.origin, 'https://pitangui.amazon.com');
  assert.equal(destination.searchParams.get('state'), 'state123');
  const code = destination.searchParams.get('code');
  assert.ok(code.length > 32);
  const tokenRequest = { grant_type: 'authorization_code', code, redirect_uri: redirect };
  const tokenCall = (data, password = 'test-secret') => call('/api/alexa/token', { method: 'POST', headers: { authorization: `Basic ${btoa(`nyx-alexa:${password}`)}`, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data) });
  assert.equal((await tokenCall(tokenRequest, 'wrong')).status, 401);
  assert.equal((await tokenCall(tokenRequest, 'test%2Dsecret')).status, 401, 'Basic credentials must not be URI-decoded');
  const linked = await tokenCall(tokenRequest);
  assert.equal(linked.status, 200);
  const { access_token, refresh_token } = await linked.json();
  assert.equal((await tokenCall(tokenRequest)).status, 400);
  resetStateForTests(); object = new NyxtheaState({ storage }, env);
  assert.equal((await call('/api/alexa/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Hi' }) })).status, 401);
  const answer = await call('/api/alexa/chat', { method: 'POST', headers: { authorization: `Bearer ${access_token}`, 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Hello' }) });
  assert.equal(answer.status, 200);
  assert.ok((await answer.json()).answer);
  assert.equal(table('conversation_turns').size, 0, 'shared Echo must not write to the linked person’s private conversation');
  const refresh = await tokenCall({ grant_type: 'refresh_token', refresh_token });
  assert.equal(refresh.status, 200);
  assert.equal((await tokenCall({ grant_type: 'refresh_token', refresh_token })).status, 400);
  const recovery = await call('/api/auth/recover', { method: 'POST', headers: { origin: 'https://nyxthea.test', 'content-type': 'application/json' }, body: JSON.stringify({ username: 'alexa-tester', recoveryCode, newPassword: 'replacement-very-long-password' }) });
  assert.equal(recovery.status, 200);
  assert.equal((await call('/api/alexa/chat', { method: 'POST', headers: { authorization: `Bearer ${access_token}`, 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Hello again' }) })).status, 401);
});
