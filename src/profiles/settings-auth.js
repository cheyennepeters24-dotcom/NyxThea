import { now, table } from "../state/store.js";
const auths=()=>table("settings_authorizations");
const fail=(message,status=403)=>{throw Object.assign(new Error(message),{status});};
export function issueSettingsAuthorization(profileId,deviceId,ttlMs=5*60*1000){
  const device=String(deviceId||"").trim().slice(0,128);if(!device)fail("Device identifier is required.",400);
  const token=`${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g,"")}`;
  const expiresAt=Date.now()+ttlMs;
  for(const [key,record] of auths())if(record.expiresAt<=Date.now()||(record.profileId===profileId&&record.deviceId===device))auths().delete(key);
  auths().set(token,{profileId,deviceId:device,createdAt:now(),expiresAt});
  return {token,expiresAt};
}
export function requireSettingsAuthorization(profileId,deviceId,token){
  const key=String(token||""),record=auths().get(key);
  if(!record||record.profileId!==profileId||record.deviceId!==String(deviceId||"")||record.expiresAt<=Date.now()){if(record?.expiresAt<=Date.now())auths().delete(key);fail("Fresh adult verification is required to change Settings.",403);}
  auths().delete(key);
  return true;
}
export function revokeSettingsAuthorization(token){auths().delete(String(token||""));}
