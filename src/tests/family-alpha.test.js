import test from "node:test";
import assert from "node:assert/strict";
import { resetStateForTests } from "../state/store.js";
import { createProfile } from "../profiles/profiles.js";
import { addPersonToHousehold, householdSummary, profileIdentity, registerDevice, saveProfileIdentity } from "../profiles/household-identity.js";

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

