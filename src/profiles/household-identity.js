import { id, list, now, table } from "../state/store.js";

const households=()=>table("households");
const memberships=()=>table("household_memberships");
const identities=()=>table("profile_identity");
const relationships=()=>table("profile_relationships");
const devices=()=>table("profile_devices");

const inverseRelationship=Object.freeze({
  spouse:"spouse", partner:"partner",
  mother:"child", father:"child", parent:"child", child:"parent",
  daughter:"parent", son:"parent",
  sister:"sibling", brother:"sibling", sibling:"sibling",
  grandmother:"grandchild", grandfather:"grandchild", grandparent:"grandchild",
  granddaughter:"grandparent", grandson:"grandparent", grandchild:"grandparent",
  aunt:"niece_or_nephew", uncle:"niece_or_nephew",
  niece:"aunt_or_uncle", nephew:"aunt_or_uncle",
  cousin:"cousin", friend:"friend", neighbor:"neighbor", caregiver:"person_in_care"
});

const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const clean=(value,max=120)=>String(value??"").trim().slice(0,max);
function parseBirthday(value){
  if(value===undefined||value===null||value==="")return null;
  const raw=clean(value,32);
  const match=raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!match)fail("Birthday must use YYYY-MM-DD.");
  const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)fail("Birthday is not a valid date.");
  if(date.getTime()>Date.now())fail("Birthday cannot be in the future.");
  if(year<1900)fail("Birthday year is outside the supported range.");
  return raw;
}
function ageFromBirthday(birthday,at=new Date()){
  if(!birthday)return null;
  const [year,month,day]=birthday.split("-").map(Number);
  let age=at.getUTCFullYear()-year;
  const before=at.getUTCMonth()+1<month||(at.getUTCMonth()+1===month&&at.getUTCDate()<day);
  if(before)age--;
  return Math.max(0,age);
}
export function developmentalStage(birthday){
  const age=ageFromBirthday(birthday);
  if(age===null)return "unspecified";
  if(age<10)return "young_child";
  if(age<13)return "preteen";
  if(age<16)return "teen";
  if(age<18)return "older_teen";
  return "adult";
}
export function ensureHousehold(profileId,{name}={}){
  let membership=list("household_memberships",x=>x.profileId===profileId&&x.active!==false)[0];
  if(membership)return households().get(membership.householdId)||null;
  const household={id:id("household"),name:clean(name,80)||"My household",mode:"personal",createdBy:profileId,createdAt:now(),updatedAt:now()};
  households().set(household.id,household);
  memberships().set(`${household.id}:${profileId}`,{householdId:household.id,profileId,role:"owner",active:true,joinedAt:now()});
  return household;
}
export function householdForProfile(profileId){
  const membership=list("household_memberships",x=>x.profileId===profileId&&x.active!==false)[0];
  if(!membership)return null;
  return households().get(membership.householdId)||null;
}
export function profileIdentity(profileId){
  const value=identities().get(profileId)||null;
  if(!value)return null;
  return {...value,age:ageFromBirthday(value.birthday),developmentalStage:developmentalStage(value.birthday)};
}
export function saveProfileIdentity(profile,{preferredName,pronunciation,birthday,birthdayMonthDay}={}){
  const previous=identities().get(profile.id)||{};
  const parsedBirthday=birthday!==undefined?parseBirthday(birthday):previous.birthday||null;
  let celebration=birthdayMonthDay!==undefined?clean(birthdayMonthDay,5):previous.birthdayMonthDay||null;
  if(parsedBirthday)celebration=parsedBirthday.slice(5);
  if(celebration&&!/^\d{2}-\d{2}$/.test(celebration))fail("Birthday month/day must use MM-DD.");
  const record={
    profileId:profile.id,
    preferredName:preferredName!==undefined?clean(preferredName,80):(previous.preferredName||profile.displayName),
    pronunciation:pronunciation!==undefined?(clean(pronunciation,120)||null):(previous.pronunciation||null),
    birthday:parsedBirthday,
    birthdayMonthDay:celebration,
    createdAt:previous.createdAt||now(),
    updatedAt:now()
  };
  identities().set(profile.id,record);
  if(parsedBirthday){profile.role=developmentalStage(parsedBirthday)==="adult"?"adult":"child";}
  ensureHousehold(profile.id);
  return profileIdentity(profile.id);
}
export function addPersonToHousehold(requester,profile,{relationshipToRequester=null,relationshipLabel=null}={}){
  const household=ensureHousehold(requester.id);
  if(!requester?.permissions?.includes("household_admin")&&requester.id!=="owner"&&household.createdBy!==requester.id)fail("Household administrator permission is required.",403);
  memberships().set(`${household.id}:${profile.id}`,{householdId:household.id,profileId:profile.id,role:"member",active:true,joinedAt:now()});
  household.mode="family";household.updatedAt=now();households().set(household.id,household);
  if(relationshipToRequester)setRelationship(requester.id,profile.id,relationshipToRequester,{label:relationshipLabel});
  return householdSummary(requester.id);
}
export function setRelationship(fromProfileId,toProfileId,type,{label=null}={}){
  if(!fromProfileId||!toProfileId||fromProfileId===toProfileId)fail("Two different profiles are required.");
  const normalized=clean(type,48).toLowerCase().replace(/\s+/g,"_");
  if(!normalized)fail("Relationship type is required.");
  const createdAt=now();
  const forward={id:`${fromProfileId}:${toProfileId}`,fromProfileId,toProfileId,type:normalized,label:clean(label,80)||null,confirmed:true,updatedAt:createdAt};
  relationships().set(forward.id,forward);
  const inverse=inverseRelationship[normalized]||"relative";
  const reverse={id:`${toProfileId}:${fromProfileId}`,fromProfileId:toProfileId,toProfileId:fromProfileId,type:inverse,label:null,confirmed:true,updatedAt:createdAt};
  relationships().set(reverse.id,reverse);
  return {forward,reverse};
}
export function householdSummary(profileId){
  const household=householdForProfile(profileId)||ensureHousehold(profileId);
  const memberRows=list("household_memberships",x=>x.householdId===household.id&&x.active!==false);
  return {
    ...household,
    members:memberRows.map(member=>({profileId:member.profileId,role:member.role,identity:profileIdentity(member.profileId)})),
    relationships:list("profile_relationships",x=>memberRows.some(member=>member.profileId===x.fromProfileId)&&memberRows.some(member=>member.profileId===x.toProfileId))
  };
}
export function registerDevice(profileId,{deviceId,label,platform,userAgent}={}){
  const stable=clean(deviceId,128);
  if(!stable)fail("A device identifier is required.");
  const key=`${profileId}:${stable}`,previous=devices().get(key);
  const record={id:key,profileId,deviceId:stable,label:clean(label,80)||previous?.label||null,platform:clean(platform,80)||previous?.platform||null,userAgent:clean(userAgent,240)||previous?.userAgent||null,trusted:previous?.trusted??false,firstSeenAt:previous?.firstSeenAt||now(),lastSeenAt:now()};
  devices().set(key,record);return record;
}
export function trustedDevice(profileId,deviceId,trusted=true){
  const key=`${profileId}:${clean(deviceId,128)}`,record=devices().get(key);
  if(!record)fail("Device not found.",404);
  record.trusted=Boolean(trusted);record.updatedAt=now();return record;
}
export function devicesFor(profileId){return list("profile_devices",x=>x.profileId===profileId);}
