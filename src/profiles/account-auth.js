import { id, now, table } from '../state/store.js';
import { createProfile, profileById, profileSummary } from './profiles.js';

const accounts = () => table('auth_accounts');
const sessions = () => table('auth_sessions');
const claims = () => table('profile_claim_invites');
const encoder = new TextEncoder();
const cookieName = 'nyxthea_session';
const day = 86400;
const duration = 30 * day;
const failure = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const hex = bytes => [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
async function digest(value) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
async function derive(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256));
}
const random = () => `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, '')}`;
function validUsername(value) { const name = String(value || '').trim().toLowerCase(); if (!/^[a-z][a-z0-9._-]{2,31}$/.test(name)) failure('Username must be 3–32 letters, numbers, dots, dashes, or underscores.'); return name; }
function validPassword(value) { if (typeof value !== 'string' || value.length < 12 || value.length > 128) failure('Password must be 12–128 characters.'); return value; }
function cookie(request) { const raw = request.headers.get('cookie') || ''; const pair = raw.split(';').map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`)); return pair?.slice(cookieName.length + 1) || ''; }
export const sessionCookie = token => `${cookieName}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${duration}`;
export const clearSessionCookie = `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0`;
async function makeSession(profileId) { const token = random(); sessions().set(await digest(token), { profileId, createdAt: now(), expiresAt: Date.now() + duration * 1000 }); return token; }
export async function registerAccount({ username, password, displayName }) {
  const name = validUsername(username); validPassword(password);
  const display = String(displayName || '').trim();
  if (!display || display.length > 80) failure('A display name of 1–80 characters is required.');
  if (accounts().has(name)) failure('That username is unavailable.', 409);
  const salt = random(); const passwordHash = await derive(password, salt);
  const profile = createProfile({ displayName: display });
  const recoveryCode = random();
  accounts().set(name, { username: name, profileId: profile.id, salt, passwordHash, recoveryHash: await digest(recoveryCode), createdAt: now() });
  return { profile: profileSummary(profile), token: await makeSession(profile.id), recoveryCode };
}
export async function createProfileClaimInvite(profileId, createdBy, ttlMs = 7 * 86400000) {
  if (!profileById(profileId)) failure('Profile is unavailable.', 404);
  if ([...accounts().values()].some(account => account.profileId === profileId)) failure('That profile already has a sign-in.', 409);
  const code = random();
  claims().set(await digest(code), { profileId, createdBy, createdAt: now(), expiresAt: Date.now() + ttlMs, usedAt: null });
  return code;
}
export async function claimProfileAccount({ inviteCode, username, password }) {
  const name = validUsername(username); validPassword(password);
  if (accounts().has(name)) failure('That username is unavailable.', 409);
  const key = await digest(String(inviteCode || ''));
  const invite = claims().get(key);
  if (!invite || invite.usedAt || invite.expiresAt <= Date.now()) failure('That household invite is invalid or expired.', 401);
  const profile = profileById(invite.profileId);
  if (!profile) failure('Profile is unavailable.', 404);
  if ([...accounts().values()].some(account => account.profileId === profile.id)) failure('That profile already has a sign-in.', 409);
  const salt = random(), passwordHash = await derive(password, salt), recoveryCode = random();
  accounts().set(name, { username: name, profileId: profile.id, salt, passwordHash, recoveryHash: await digest(recoveryCode), createdAt: now() });
  invite.usedAt = now(); claims().set(key, invite);
  return { profile: profileSummary(profile), token: await makeSession(profile.id), recoveryCode };
}
export async function loginAccount({ username, password }) {
  const name = String(username || '').trim().toLowerCase();
  const record = accounts().get(name);
  // Always run the derivation so missing usernames do not have a noticeably cheaper path.
  const salt = record?.salt || 'nyxthea-missing-account';
  const expected = record?.passwordHash || await digest('nyxthea-missing-password');
  const actual = await derive(String(password || ''), salt);
  if (!record || actual !== expected) failure('Username or password is incorrect.', 401);
  const profile = profileById(record.profileId);
  if (!profile) failure('Account profile is unavailable.', 503);
  return { profile: profileSummary(profile), token: await makeSession(profile.id) };
}
export async function cookieProfile(request) {
  const token = cookie(request); if (!token) return null;
  const key = await digest(token), session = sessions().get(key);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) { sessions().delete(key); return null; }
  return profileById(session.profileId);
}
export async function logoutAccount(request) { const token = cookie(request); if (token) sessions().delete(await digest(token)); }
export function authLimit(request, action, limit, windowMs) {
  const source = request.headers.get('cf-connecting-ip') || 'unknown';
  const key = `${action}:${source}`;
  const records = table('auth_rate_limits');
  const entry = records.get(key) || { start: Date.now(), count: 0 };
  if (Date.now() - entry.start >= windowMs) { entry.start = Date.now(); entry.count = 0; }
  entry.count++;
  records.set(key, entry);
  if (entry.count > limit) failure('Too many attempts. Please try again later.', 429);
}
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return origin === new URL(request.url).origin;
}

export async function recoverAccount({ username, recoveryCode, newPassword }) {
  const name = String(username || '').trim().toLowerCase();
  validPassword(newPassword);
  const record = accounts().get(name);
  const actual = await digest(String(recoveryCode || ''));
  if (!record || !record.recoveryHash || record.recoveryHash !== actual) failure('Recovery details are incorrect.', 401);
  const salt = random(), passwordHash = await derive(newPassword, salt), nextCode = random();
  record.salt = salt; record.passwordHash = passwordHash; record.recoveryHash = await digest(nextCode);
  for (const [key, session] of sessions()) if (session.profileId === record.profileId) sessions().delete(key);
  for (const [key, alexaToken] of table('alexa_oauth_tokens')) if (alexaToken.profileId === record.profileId) table('alexa_oauth_tokens').delete(key);
  const profile = profileById(record.profileId);
  return { profile: profileSummary(profile), token: await makeSession(profile.id), recoveryCode: nextCode };
}
