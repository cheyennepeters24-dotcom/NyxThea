import { now, table } from "../state/store.js";
import { profileIdentity } from "./household-identity.js";

const locks=()=>table("profile_locks");
const challenges=()=>table("profile_lock_challenges");
const encoder=new TextEncoder();
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const hex=bytes=>[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,"0")).join("");
async function derive(pin,salt){
  const key=await crypto.subtle.importKey("raw",encoder.encode(pin),"PBKDF2",false,["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({name:"PBKDF2",salt:encoder.encode(salt),iterations:120000,hash:"SHA-256"},key,256));
}
const random=()=>`${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g,"")}`;
const b64url=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const fromB64url=value=>Uint8Array.from(atob(String(value).replace(/-/g,"+").replace(/_/g,"/")+"===".slice((String(value).length+3)%4)),c=>c.charCodeAt(0));
async function sha256(bytes){return new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));}
function bytesEqual(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;}
function constantTimeEqual(a,b){const left=String(a||""),right=String(b||"");if(left.length!==right.length)return false;let diff=0;for(let i=0;i<left.length;i++)diff|=left.charCodeAt(i)^right.charCodeAt(i);return diff===0;}
function derEcdsaToRaw(signature,size=32){
  const bytes=signature instanceof Uint8Array?signature:new Uint8Array(signature);
  if(bytes.length===size*2)return bytes;
  if(bytes[0]!==0x30)fail("Biometric signature encoding is invalid.",401);
  let i=2;if(bytes[1]&0x80)i=2+(bytes[1]&0x7f);
  if(bytes[i++]!==0x02)fail("Biometric signature encoding is invalid.",401);
  const rLen=bytes[i++],r=bytes.slice(i,i+rLen);i+=rLen;
  if(bytes[i++]!==0x02)fail("Biometric signature encoding is invalid.",401);
  const sLen=bytes[i++],ss=bytes.slice(i,i+sLen);
  const trim=v=>v.length>size?v.slice(v.length-size):v;
  const rr=trim(r),sv=trim(ss),out=new Uint8Array(size*2);
  out.set(rr,size-rr.length);out.set(sv,size+(size-sv.length));return out;
}
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
  if(!constantTimeEqual(candidate,current.pinHash))fail("Incorrect PIN.",401);
  return {ok:true};
}
export function beginBiometric(profile,{deviceId,purpose="unlock",origin,rpId}={}){
  assertAdult(profile);
  const d=String(deviceId||"").trim().slice(0,128);if(!d)fail("Device identifier is required.");
  if(!["register","unlock","settings"].includes(purpose))fail("Unsupported biometric purpose.");
  const bytes=crypto.getRandomValues(new Uint8Array(32)),challenge=b64url(bytes),key=`${profile.id}:${d}:${purpose}`;
  challenges().set(key,{profileId:profile.id,deviceId:d,purpose,challenge,origin:String(origin||"").slice(0,240),rpId:String(rpId||"").slice(0,240),expiresAt:Date.now()+5*60*1000});
  return {challenge,purpose};
}
function readChallenge(profile,deviceId,purpose){
  const key=`${profile.id}:${deviceId}:${purpose}`,record=challenges().get(key);
  if(!record||record.expiresAt<=Date.now())fail("Biometric challenge is invalid or expired.",401);
  challenges().delete(key);return record;
}
function parseClientData(value,record,expectedType){
  let parsed;try{parsed=JSON.parse(new TextDecoder().decode(fromB64url(value)));}catch{fail("Biometric response is invalid.",401);}
  if(parsed.type!==expectedType||parsed.challenge!==record.challenge||parsed.origin!==record.origin)fail("Biometric response could not be verified.",401);
  return parsed;
}
export function addBiometricCredential(profile,{deviceId,credentialId,publicKey,algorithm=-7,label,clientDataJSON}={}){
  assertAdult(profile);
  const d=String(deviceId||"").trim().slice(0,128),c=String(credentialId||"").trim().slice(0,1024),p=String(publicKey||"").trim();
  if(!d||!c||!p||!clientDataJSON)fail("Device biometric credential is incomplete.");
  const challenge=readChallenge(profile,d,"register");parseClientData(clientDataJSON,challenge,"webauthn.create");
  const current=locks().get(profile.id)||{profileId:profile.id,biometricDevices:[]};
  const devices=Array.isArray(current.biometricDevices)?current.biometricDevices:[];
  current.biometricDevices=[...devices.filter(x=>x.deviceId!==d),{deviceId:d,credentialId:c,publicKey:p,algorithm:Number(algorithm),rpId:challenge.rpId,label:String(label||"").trim().slice(0,80)||null,addedAt:now()}];
  current.biometricEnabled=true;current.enabled=true;current.updatedAt=now();
  locks().set(profile.id,current);return profileLock(profile);
}
export async function verifyBiometricCredential(profile,{deviceId,purpose="unlock",credentialId,clientDataJSON,authenticatorData,signature}={}){
  assertAdult(profile);
  const d=String(deviceId||"").trim().slice(0,128),current=locks().get(profile.id),credential=(current?.biometricDevices||[]).find(x=>x.deviceId===d&&x.credentialId===credentialId);
  if(!credential)fail("Device biometric unlock is not registered.",404);
  const challenge=readChallenge(profile,d,purpose);parseClientData(clientDataJSON,challenge,"webauthn.get");
  const auth=fromB64url(authenticatorData);if(auth.length<37)fail("Biometric response is invalid.",401);
  const expectedRp=await sha256(encoder.encode(challenge.rpId));if(!bytesEqual(auth.slice(0,32),expectedRp))fail("Biometric response is for a different site.",401);
  if((auth[32]&0x04)===0)fail("Device user verification was not completed.",401);
  const clientBytes=fromB64url(clientDataJSON),clientHash=await sha256(clientBytes),signed=new Uint8Array(auth.length+clientHash.length);signed.set(auth);signed.set(clientHash,auth.length);
  let key,algorithm;
  if(Number(credential.algorithm)===-7){key=await crypto.subtle.importKey("spki",fromB64url(credential.publicKey),{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);algorithm={name:"ECDSA",hash:"SHA-256"};}
  else if(Number(credential.algorithm)===-257){key=await crypto.subtle.importKey("spki",fromB64url(credential.publicKey),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);algorithm={name:"RSASSA-PKCS1-v1_5"};}
  else fail("Unsupported biometric credential algorithm.",400);
  const provided=Number(credential.algorithm)===-7?derEcdsaToRaw(fromB64url(signature)):fromB64url(signature);const ok=await crypto.subtle.verify(algorithm,key,provided,signed);if(!ok)fail("Biometric verification failed.",401);
  return {ok:true,purpose};
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
  if(!stable)fail("Device identifier is required.");
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
