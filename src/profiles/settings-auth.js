import { now, table } from "../state/store.js";
const auths=()=>table("settings_authorizations");
const fail=(message,status=403)=>{throw Object.assign(new Error(message),{status});};
export function issueSettingsAuthorization(profileId,deviceId,ttlMs=5*60*1000){
  const device=String(deviceId||"").trim().slice(0,128);if(!device)fail("Device identifier is required.",400);
  const token=`${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g,"")}`;
  auths().set(token,{profileId,deviceId:device,createdAt:now(),expiresAt:Date.now()+ttlMs});
  return {token,expiresAt:Date.now()+ttlMs};
}
export function requireSettingsAuthorization(profileId,deviceId,token){
  const record=auths().get(String(token||""));
  if(!record||record.profileId!==profileId||record.deviceId!==String(deviceId||"")||record.expiresAt<=Date.now())fail("Fresh adult verification is required to change Settings.",403);
  return true;
}
export function revokeSettingsAuthorization(token){auths().delete(String(token||""));}
