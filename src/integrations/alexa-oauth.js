import { table } from '../state/store.js';
import { authLimit, cookieProfile, loginAccount } from '../profiles/account-auth.js';
import { profileById } from '../profiles/profiles.js';

const enc = new TextEncoder();
const codes = () => table('alexa_oauth_codes');
const tokens = () => table('alexa_oauth_tokens');
const expiry = { code: 5 * 60 * 1000, access: 60 * 60 * 1000, refresh: 30 * 24 * 60 * 60 * 1000 };
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const random = () => `${crypto.randomUUID()}${crypto.randomUUID().replaceAll('-', '')}`;
const hex = bytes => [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
const hash = async value => hex(await crypto.subtle.digest('SHA-256', enc.encode(value)));
const formReply = (html, status = 200, nonce = '') => new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`, 'referrer-policy': 'no-referrer' } });
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const redirectUris = env => String(env.ALEXA_REDIRECT_URIS || '').split(',').map(value => value.trim()).filter(Boolean);

function authorizeParams(input, env) {
  const clientId = input.get('client_id'), uri = input.get('redirect_uri');
  const missing = [!env.ALEXA_OAUTH_CLIENT_ID && 'client ID', !env.ALEXA_OAUTH_CLIENT_SECRET && 'Cloudflare secret', !redirectUris(env).length && 'redirect URLs'].filter(Boolean);
  if (missing.length) fail(`Alexa account linking is not configured: missing ${missing.join(', ')} in the running Worker.`, 503);
  if (clientId !== env.ALEXA_OAUTH_CLIENT_ID || !redirectUris(env).includes(uri)) fail('Unrecognized Alexa client or redirect.', 400);
  if (input.get('response_type') !== 'code' || !input.get('state')) fail('Invalid authorization request.');
  const challenge = input.get('code_challenge') || '';
  if (challenge && (input.get('code_challenge_method') !== 'S256' || !/^[a-zA-Z0-9_-]{43,128}$/.test(challenge))) fail('Unsupported PKCE challenge.');
  return { clientId, uri, state: input.get('state'), challenge };
}

function linkingPage(params, profile, error = '') {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const fields = [['client_id', params.clientId], ['redirect_uri', params.uri], ['response_type', 'code'], ['state', params.state], ['code_challenge', params.challenge || ''], ['code_challenge_method', params.challenge ? 'S256' : '']]
    .map(([name, value]) => `<input type="hidden" name="${name}" value="${escape(value)}">`).join('');
  return formReply(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Connect NyxThea to Alexa</title><style>body{font:18px system-ui;background:#081328;color:#eef5ff;max-width:440px;margin:12vh auto;padding:20px}h1{font:36px Georgia,serif}input,button{box-sizing:border-box;width:100%;padding:14px;margin:8px 0;border-radius:10px;font-size:17px}button{background:#3688f5;color:white;border:0}p{line-height:1.5}.error{color:#ffb7a9}</style><h1>Connect NyxThea to Alexa</h1><p>Allow your Echo to speak with your NyxThea profile${profile ? `, ${escape(profile.displayName)}` : ''}. You can unlink it later in the Alexa app.</p>${error ? `<p class="error">${escape(error)}</p>` : ''}<form method="post" action="/api/alexa/authorize">${fields}${profile ? '' : '<label>NyxThea username<input name="username" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label>'}<button type="submit" name="approve" value="yes">Connect my profile</button></form><p id="submit-status" role="status" aria-live="polite"></p><script nonce="${nonce}">const form=document.querySelector('form'),status=document.getElementById('submit-status');form.querySelector('button').addEventListener('click',()=>{if(!form.checkValidity())status.textContent='Please enter your NyxThea username and password.'});form.addEventListener('submit',()=>{status.textContent='Connecting your profile…'});</script></html>`, 200, nonce);
}

export async function alexaAuthorize(request, env) {
  if (request.method === 'GET') {
    const params = authorizeParams(new URL(request.url).searchParams, env);
    return linkingPage(params, await cookieProfile(request));
  }
  if (request.method !== 'POST') fail('Method not allowed.', 405);
  const origin = request.headers.get('origin');
  if (origin && origin !== 'null' && origin !== new URL(request.url).origin) fail('Same-origin request required.', 403);
  const form = await request.formData(), params = authorizeParams(form, env);
  if (form.get('approve') !== 'yes') fail('Explicit consent is required.', 403);
  let profile = await cookieProfile(request);
  if (!profile) {
    authLimit(request, 'alexa-login', 10, 15 * 60 * 1000);
    try { profile = (await loginAccount({ username: form.get('username'), password: form.get('password') })).profile; }
    catch { return linkingPage(params, null, 'Those sign-in details did not work. Please try again.'); }
  }
  const code = random();
  codes().set(await hash(code), { profileId: profile.id, clientId: params.clientId, uri: params.uri, challenge: params.challenge, expiresAt: Date.now() + expiry.code });
  const dest = new URL(params.uri);
  dest.searchParams.set('code', code);
  dest.searchParams.set('state', params.state);
  return new Response(null, { status: 302, headers: { location: dest.href, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
}

function clientCredentials(request, form, env) {
  const basic = request.headers.get('authorization') || '';
  let clientId = form.get('client_id'), secret = form.get('client_secret');
  if (basic.startsWith('Basic ')) {
    let decoded;
    try { decoded = atob(basic.slice(6)); } catch { fail('Invalid client credentials.', 401); }
    const split = decoded.indexOf(':');
    if (split < 0) fail('Invalid client credentials.', 401);
    try {
      clientId = decodeURIComponent(decoded.slice(0, split));
      secret = decodeURIComponent(decoded.slice(split + 1));
    } catch {
      fail('Invalid client credentials.', 401);
    }
  }
  if (!env.ALEXA_OAUTH_CLIENT_ID || !env.ALEXA_OAUTH_CLIENT_SECRET || clientId !== env.ALEXA_OAUTH_CLIENT_ID || secret !== env.ALEXA_OAUTH_CLIENT_SECRET) fail('Invalid client credentials.', 401);
  return clientId;
}

async function issueTokens(profileId, clientId) {
  const accessToken = random(), refreshToken = random();
  tokens().set(await hash(accessToken), { kind: 'access', profileId, clientId, expiresAt: Date.now() + expiry.access });
  tokens().set(await hash(refreshToken), { kind: 'refresh', profileId, clientId, expiresAt: Date.now() + expiry.refresh });
  return { access_token: accessToken, token_type: 'Bearer', expires_in: expiry.access / 1000, refresh_token: refreshToken };
}

export async function alexaToken(request, env) {
  if (request.method !== 'POST') fail('Method not allowed.', 405);
  const form = new URLSearchParams(await request.text()), clientId = clientCredentials(request, form, env);
  if (form.get('grant_type') === 'authorization_code') {
    const raw = form.get('code') || '', key = await hash(raw), record = codes().get(key);
    if (!record || record.expiresAt <= Date.now() || record.clientId !== clientId || record.uri !== form.get('redirect_uri')) fail('Authorization code is invalid.', 400);
    if (record.challenge) {
      const verifier = form.get('code_verifier') || '';
      const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(verifier)));
      const computed = btoa(String.fromCharCode(...digest)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
      if (computed !== record.challenge) fail('PKCE verification failed.', 400);
    }
    codes().delete(key);
    return issueTokens(record.profileId, clientId);
  }
  if (form.get('grant_type') === 'refresh_token') {
    const key = await hash(form.get('refresh_token') || ''), record = tokens().get(key);
    if (!record || record.kind !== 'refresh' || record.expiresAt <= Date.now() || record.clientId !== clientId || !profileById(record.profileId)) fail('Refresh token is invalid.', 400);
    tokens().delete(key);
    return issueTokens(record.profileId, clientId);
  }
  fail('Unsupported grant type.');
}

export async function alexaProfile(request) {
  const raw = request.headers.get('authorization') || '';
  if (!raw.startsWith('Bearer ')) fail('Alexa account linking is required.', 401);
  const record = tokens().get(await hash(raw.slice(7)));
  if (!record || record.kind !== 'access' || record.expiresAt <= Date.now()) fail('Alexa session expired. Please relink your account.', 401);
  const profile = profileById(record.profileId);
  if (!profile) fail('Profile unavailable.', 401);
  return profile;
}
