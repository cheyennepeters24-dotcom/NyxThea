import test from "node:test";
import assert from "node:assert/strict";
import { resetStateForTests, table } from "../state/store.js";
import { createProfile } from "../profiles/profiles.js";
import { addPersonToHousehold, householdSummary, profileIdentity, registerDevice, saveProfileIdentity, setRelationship } from "../profiles/household-identity.js";

test("a personal profile grows into a family household when Nyxthea meets a second person", () => {
  resetStateForTests();
  const first=createProfile({displayName:"First"});
  saveProfileIdentity(first,{preferredName:"First",birthday:"1990-06-15"});
  const before=householdSummary(first.id);
  assert.equal(before.mode,"personal");
  assert.equal(before.members.length,1);

  const second=createProfile({displayName:"Second"});
  saveProfileIdentity(second,{preferredName:"Second",pronunciation:"SEK-und",birthday:"2015-04-02"});
  const after=addPersonToHousehold(first,second,{relationshipToRequester:"daughter"});
  assert.equal(householdSummary(second.id).id,after.id);
  assert.equal(after.mode,"family");
  assert.equal(after.members.length,2);
  const relation=after.relationships.find(x=>x.fromProfileId===first.id&&x.toProfileId===second.id);
  assert.equal(relation.type,"daughter");
  const reverse=after.relationships.find(x=>x.fromProfileId===second.id&&x.toProfileId===first.id);
  assert.equal(reverse.type,"parent");
  assert.equal(profileIdentity(second.id).developmentalStage,"preteen");
});

test("device identity belongs to the person instead of becoming a new profile", () => {
  resetStateForTests();
  const person=createProfile({displayName:"Mobile"});
  saveProfileIdentity(person,{preferredName:"Mobile"});
  const phone=registerDevice(person.id,{deviceId:"phone-1",label:"Phone",platform:"iOS"});
  const samePhone=registerDevice(person.id,{deviceId:"phone-1",label:"Work phone",platform:"iOS"});
  assert.equal(phone.profileId,person.id);
  assert.equal(samePhone.profileId,person.id);
  assert.equal(samePhone.deviceId,"phone-1");
  assert.equal(householdSummary(person.id).members.length,1);
});


test("DOB-derived minor profile is marked child", () => {
  resetStateForTests();
  const child=createProfile({displayName:"Kid"});
  saveProfileIdentity(child,{preferredName:"Kid",birthday:"2018-08-01"});
  assert.equal(child.role,"child");
  assert.equal(profileIdentity(child.id).developmentalStage,"young_child");
});



test("partial birthdays and relationships reject invalid identity data",()=>{
  resetStateForTests();
  const adult=createProfile({displayName:"Adult",permissions:["household_admin"]});
  saveProfileIdentity(adult,{preferredName:"Adult",birthdayMonthDay:"02-29"});
  assert.throws(()=>saveProfileIdentity(adult,{birthdayMonthDay:"02-30"}),/valid date/);
  const outsider=createProfile({displayName:"Outsider"});
  assert.throws(()=>setRelationship(adult.id,outsider.id,"friend"),/same household/);
});


test("household move clears prior relationship records",()=>{
 resetStateForTests();
 const a=createProfile({displayName:"A",permissions:["household_admin"]}),b=createProfile({displayName:"B"}),c=createProfile({displayName:"C",permissions:["household_admin"]});
 saveProfileIdentity(a,{preferredName:"A"});saveProfileIdentity(b,{preferredName:"B"});saveProfileIdentity(c,{preferredName:"C"});
 addPersonToHousehold(a,b,{relationshipToRequester:"friend"});
 assert.equal([...table("profile_relationships").values()].filter(x=>x.fromProfileId===b.id||x.toProfileId===b.id).length,2);
 addPersonToHousehold(c,b,{relationshipToRequester:"friend"});
 const edges=[...table("profile_relationships").values()].filter(x=>x.fromProfileId===b.id||x.toProfileId===b.id);
 assert.equal(edges.length,2);assert.ok(edges.every(x=>x.fromProfileId===c.id||x.toProfileId===c.id));
});


test("household lookup repairs duplicate and orphan active memberships",()=>{
 resetStateForTests();
 const owner=createProfile({displayName:"Owner",permissions:["household_admin"]});saveProfileIdentity(owner,{preferredName:"Owner"});
 const valid=householdSummary(owner.id),memberships=table("household_memberships");
 memberships.set("corrupt-orphan",{householdId:"missing-household",profileId:owner.id,role:"member",active:true,joinedAt:new Date().toISOString()});
 memberships.set("duplicate-valid",{householdId:valid.id,profileId:owner.id,role:"member",active:true,joinedAt:new Date().toISOString()});
 const repaired=householdSummary(owner.id);
 assert.equal(repaired.id,valid.id);
 const active=[...memberships.values()].filter(x=>x.profileId===owner.id&&x.active!==false);
 assert.equal(active.length,1);assert.equal(active[0].householdId,valid.id);
});


test("household repair keeps the canonical membership when two valid households exist",()=>{
 resetStateForTests();
 const owner=createProfile({displayName:"Owner",permissions:["household_admin"]});saveProfileIdentity(owner,{preferredName:"Owner"});
 const canonical=householdSummary(owner.id),memberships=table("household_memberships"),households=table("households");
 const other={id:"household-other",name:"Other",mode:"family",createdBy:"someone-else",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 households.set(other.id,other);memberships.set("duplicate-other",{householdId:other.id,profileId:owner.id,role:"member",active:true,joinedAt:new Date().toISOString()});
 const repaired=householdSummary(owner.id);
 assert.equal(repaired.id,canonical.id);
 assert.equal([...memberships.values()].filter(x=>x.profileId===owner.id&&x.active!==false).length,1);
});

test("household repair removes relationships whose other endpoint is outside the surviving household",()=>{
 resetStateForTests();
 const owner=createProfile({displayName:"Owner",permissions:["household_admin"]}),member=createProfile({displayName:"Member"}),outsider=createProfile({displayName:"Outsider"});
 saveProfileIdentity(owner,{preferredName:"Owner"});saveProfileIdentity(member,{preferredName:"Member"});saveProfileIdentity(outsider,{preferredName:"Outsider"});
 addPersonToHousehold(owner,member,{relationshipToRequester:"friend"});
 const relationships=table("profile_relationships");
 relationships.set(`${owner.id}:${outsider.id}`,{id:`${owner.id}:${outsider.id}`,fromProfileId:owner.id,toProfileId:outsider.id,type:"friend",confirmed:true,updatedAt:new Date().toISOString()});
 householdSummary(owner.id);
 assert.equal([...relationships.values()].some(x=>x.fromProfileId===owner.id&&x.toProfileId===outsider.id),false);
 assert.equal([...relationships.values()].some(x=>x.fromProfileId===owner.id&&x.toProfileId===member.id),true);
});
