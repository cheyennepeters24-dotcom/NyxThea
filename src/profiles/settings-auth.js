import { now, table } from "../state/store.js";
const auths=()=>table("settings_authorizations");
const fail=(message,status=403)=>{throw Object.assign(new Error(message),{status});};
export function issueSettingsAuthorization(profileId,deviceId,ttlMs=5*60*1000){
  const device=String(deviceId||"").trim();if(!device||device.length>128)fail("Device identifier is required and must be at most 128 characters.",400);
  const token=`${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g,"")}`;
  const ttl=Number(ttlMs);if(!Number.isFinite(ttl)||ttl<=0||ttl>15*60*1000)fail("Settings authorization lifetime is invalid.",400);
  const expiresAt=Date.now()+ttl;
  for(const [key,record] of auths())if(record.expiresAt<=Date.now()||(record.profileId===profileId&&record.deviceId===device))auths().delete(key);
  auths().set(token,{profileId,deviceId:device,createdAt:now(),expiresAt});
  return {token,expiresAt};
}
export function requireSettingsAuthorization(profileId,deviceId,token){
  const key=String(token||""),record=auths().get(key);
  const expiry=Number(record?.expiresAt),device=String(deviceId||"").trim();
  if(!record||record.profileId!==profileId||record.deviceId!==device||!Number.isFinite(expiry)||expiry<=Date.now()){if(record&&(!Number.isFinite(expiry)||expiry<=Date.now()))auths().delete(key);fail("Fresh adult verification is required to change Settings.",403);}
  auths().delete(key);
  return true;
}
export function revokeSettingsAuthorization(token){auths().delete(String(token||""));}
