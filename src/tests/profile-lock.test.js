import test from "node:test";
import assert from "node:assert/strict";
import { resetStateForTests } from "../state/store.js";
import { createProfile } from "../profiles/profiles.js";
import { PIN_PBKDF2_ITERATIONS, deviceLockState, markDeviceUnlocked, setProfilePin, verifyProfilePin } from "../profiles/profile-lock.js";

test.beforeEach(()=>resetStateForTests());

// Cloudflare Workers rejects PBKDF2 above 100,000 iterations in production with
// NotSupportedError ("Pbkdf2 failed: iteration counts above 100000 are not
// supported"). Local workerd does not enforce the cap, so a PIN hash that is too
// expensive passes every local run and only fails on the deployed Worker. Pin the
// value here so it cannot drift back over the limit.
test("PIN hashing stays within Cloudflare's PBKDF2 iteration cap",()=>{
  assert.ok(Number.isInteger(PIN_PBKDF2_ITERATIONS),"PIN iteration count must be a whole number");
  assert.ok(PIN_PBKDF2_ITERATIONS<=100000,`PIN hashing must not exceed Cloudflare's 100,000-iteration limit (got ${PIN_PBKDF2_ITERATIONS})`);
  assert.ok(PIN_PBKDF2_ITERATIONS>=10000,"PIN hashing must stay expensive enough to be worth hashing");
});

test("a stored PIN rejects a wrong PIN and unlocks only the matching device",async()=>{
  const adult=createProfile({displayName:"Adult",permissions:["household_admin"]});
  await setProfilePin(adult,{pin:"481920"});
  assert.equal(deviceLockState(adult,{deviceId:"phone"}).locked,true);
  await assert.rejects(()=>verifyProfilePin(adult,{pin:"000000"}),error=>error.status===401);
  assert.deepEqual(await verifyProfilePin(adult,{pin:"481920"}),{ok:true});
  markDeviceUnlocked(adult,{deviceId:"phone"});
  assert.equal(deviceLockState(adult,{deviceId:"phone"}).locked,false);
  assert.equal(deviceLockState(adult,{deviceId:"tablet"}).locked,true);
});
