import { now, table } from "../state/store.js";
import { profileIdentity } from "./household-identity.js";

const locks=()=>table("profile_locks");
const encoder=new TextEncoder();
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const hex=bytes=>[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,"0")).join("");
async function derive(pin,salt){
  const key=await crypto.subtle.importKey("raw",encoder.encode(pin),"PBKDF2",false,["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({name:"PBKDF2",salt:encoder.encode(salt),iterations:120000,hash:"SHA-256"},key,256));
}
const random=()=>`${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g,"")}`;
function assertAdult(profile){
  const identity=profileIdentity(profile.id);
  const adult=identity?.developmentalStage==="adult"||profile.role==="adult"||profile.role==="owner"||profile.permissions?.includes("household_admin");
  if(!adult)fail("Adult profile lock settings are only available to adult profiles.",403);
}
export function profileLock(profile){
  const current=locks().get(profile.id);
  return current?{
    profileId:profile.id,
    enabled:Boolean(current.enabled),
    pinEnabled:Boolean(current.pinHash),
    biometricEnabled:Boolean(current.biometricEnabled),
    biometricDevices:Array.isArray(current.biometricDevices)?current.biometricDevices.map(x=>({deviceId:x.deviceId,credentialId:x.credentialId,label:x.label||null,addedAt:x.addedAt})):[],
    stayUnlockedOnDevice:current.stayUnlockedOnDevice!==false,
    updatedAt:current.updatedAt
  }:{profileId:profile.id,enabled:false,pinEnabled:false,biometricEnabled:false,biometricDevices:[],stayUnlockedOnDevice:true};
}
export async function setProfilePin(profile,{pin,stayUnlockedOnDevice=true}={}){
  assertAdult(profile);
  const value=String(pin||"");
  if(!/^\d{4,8}$/.test(value))fail("PIN must be 4–8 digits.");
  const current=locks().get(profile.id)||{profileId:profile.id,biometricEnabled:false,biometricDevices:[]};
  const salt=random();
  current.pinSalt=salt;current.pinHash=await derive(value,salt);current.enabled=true;current.stayUnlockedOnDevice=stayUnlockedOnDevice!==false;current.updatedAt=now();
  locks().set(profile.id,current);return profileLock(profile);
}
export async function verifyProfilePin(profile,{pin}={}){
  assertAdult(profile);
  const current=locks().get(profile.id);
  if(!current?.enabled||!current.pinHash)fail("PIN unlock is not enabled.",409);
  const candidate=await derive(String(pin||""),current.pinSalt);
  if(candidate!==current.pinHash)fail("Incorrect PIN.",401);
  return {ok:true};
}
export function addBiometricCredential(profile,{deviceId,credentialId,label}={}){
  assertAdult(profile);
  const d=String(deviceId||"").trim().slice(0,128),c=String(credentialId||"").trim().slice(0,1024);
  if(!d||!c)fail("Device and biometric credential are required.");
  const current=locks().get(profile.id)||{profileId:profile.id,biometricDevices:[]};
  const devices=Array.isArray(current.biometricDevices)?current.biometricDevices:[];
  current.biometricDevices=[...devices.filter(x=>x.deviceId!==d),{deviceId:d,credentialId:c,label:String(label||"").trim().slice(0,80)||null,addedAt:now()}];
  current.biometricEnabled=true;current.enabled=true;current.updatedAt=now();
  locks().set(profile.id,current);return profileLock(profile);
}
export function removeBiometricCredential(profile,{deviceId}={}){
  assertAdult(profile);
  const current=locks().get(profile.id);
  if(!current)return profileLock(profile);
  current.biometricDevices=(current.biometricDevices||[]).filter(x=>x.deviceId!==String(deviceId||""));
  current.biometricEnabled=current.biometricDevices.length>0;
  current.updatedAt=now();locks().set(profile.id,current);return profileLock(profile);
}
export function disableProfileLock(profile){
  assertAdult(profile);locks().delete(profile.id);return profileLock(profile);
}

export function markDeviceUnlocked(profile,{deviceId}={}){
  assertAdult(profile);
  const current=locks().get(profile.id);
  if(!current?.enabled)return {ok:true,locked:false};
  const stable=String(deviceId||"").trim().slice(0,128);
  if(!stable)fail("Device identifier is required.");
  current.unlockedDevices=Array.isArray(current.unlockedDevices)?current.unlockedDevices:[];
  if(!current.unlockedDevices.includes(stable))current.unlockedDevices.push(stable);
  current.updatedAt=now();locks().set(profile.id,current);
  return {ok:true,locked:false,deviceId:stable};
}
export function markDeviceLocked(profile,{deviceId}={}){
  assertAdult(profile);
  const current=locks().get(profile.id);
  if(!current)return {ok:true,locked:false};
  const stable=String(deviceId||"").trim().slice(0,128);
  current.unlockedDevices=(current.unlockedDevices||[]).filter(x=>x!==stable);
  current.updatedAt=now();locks().set(profile.id,current);
  return {ok:true,locked:true,deviceId:stable};
}
export function deviceLockState(profile,{deviceId}={}){
  assertAdult(profile);
  const current=locks().get(profile.id);
  if(!current?.enabled)return {enabled:false,locked:false};
  const stable=String(deviceId||"").trim().slice(0,128);
  const unlocked=stable&&(current.unlockedDevices||[]).includes(stable);
  return {enabled:true,locked:!unlocked,deviceId:stable,stayUnlockedOnDevice:current.stayUnlockedOnDevice!==false};
}
