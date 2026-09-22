import test from "node:test";
import assert from "node:assert/strict";
import worker from "../../_worker.js";
import { analyzeLiveGuide, LIVE_GUIDE_MODEL, startLiveGuide, stopLiveGuide } from "../architecture/live-guide.js";
import { resetStateForTests, table } from "../state/store.js";

test.beforeEach(() => resetStateForTests());

test("Live Guide requires explicit, scoped session permission", async () => {
  assert.throws(() => startLiveGuide("owner", { objective: "Fix my printer", sources: ["camera"] }), /Explicit permission/);
  const session = startLiveGuide("owner", { objective: "Fix my printer", sources: ["microphone", "unknown"], confirm: true }, { visionAvailable: true });
  assert.deepEqual(session.sources, ["microphone"]);
  await assert.rejects(() => analyzeLiveGuide("owner", session.id, { image: "data:image/jpeg;base64,YQ==" }, { ai: { run: async () => ({ response: "unused" }) } }), /Camera or screen permission/);
  assert.throws(() => stopLiveGuide("different-profile", session.id), /another profile/);
});

test("Live Guide blocks high-risk visual coaching before AI runs", async () => {
  let calls = 0;
  const session = startLiveGuide("owner", { objective: "Open the live electrical panel and touch the wire", sources: ["camera"], confirm: true }, { visionAvailable: true });
  const result = await analyzeLiveGuide("owner", session.id, { image: "data:image/jpeg;base64,YQ==" }, { ai: { run: async () => { calls += 1; } } });
  assert.equal(session.status, "safety_hold");
  assert.equal(result.guidance.risk, "stop");
  assert.equal(calls, 0);
});

test("child profiles can verify chores while homework stays guided", async () => {
  const chore = startLiveGuide("child", { objective: "Check whether I finished putting away my toys", sources: ["camera"], confirm: true }, { visionAvailable: true, profileRole: "child" });
  assert.equal(chore.status, "active");
  assert.equal(chore.audience, "child");
  assert.equal(chore.guidanceMode, "child_safe");

  const homework = startLiveGuide("child", { objective: "Check my homework answers", sources: ["camera"], confirm: true }, { visionAvailable: true, profileRole: "child" });
  const ai = { run: async () => ({ response: JSON.stringify({ mode: "guided_learning", observation: "Question 3 needs another look.", nextStep: "The correct answer is 42.", verification: "Try the item again.", caution: "", confidence: "high", risk: "normal" }) }) };
  const result = await analyzeLiveGuide("child", homework.id, { image: "data:image/jpeg;base64,YQ==" }, { ai });
  assert.equal(result.session.guidanceMode, "guided_learning");
  assert.match(result.guidance.observation, /Question 3/);
  assert.doesNotMatch(result.guidance.nextStep, /42|correct answer/i);
  assert.match(result.guidance.caution, /will not provide or correct/);
});

test("Live Guide returns one bounded visual step without retaining raw media", async () => {
  const session = startLiveGuide("owner", { objective: "Reconnect the printer paper tray", sources: ["camera", "microphone"], confirm: true }, { visionAvailable: true });
  let request;
  const ai = { run: async (model, input) => { request = { model, input }; return { response: JSON.stringify({ observation: "The tray is slightly misaligned.", nextStep: "Pull the tray straight out until it stops.", verification: "Show the empty tray slot.", caution: "Do not force it.", confidence: "high", risk: "normal" }) }; } };
  const result = await analyzeLiveGuide("owner", session.id, { image: "data:image/jpeg;base64,YQ==", transcript: "It feels stuck" }, { ai });
  assert.equal(request.model, LIVE_GUIDE_MODEL);
  assert.equal(request.input.store, false);
  assert.equal(request.input.messages[0].content[1].type, "image_url");
  assert.equal(result.guidance.nextStep, "Pull the tray straight out until it stops.");
  assert.equal(result.session.observationCount, 1);
  const stored = JSON.stringify(table("live_guide_sessions").get(session.id));
  assert.doesNotMatch(stored, /data:image|It feels stuck/);
  stopLiveGuide("owner", session.id);
  await assert.rejects(() => analyzeLiveGuide("owner", session.id, { note: "continue" }, { ai }), /session is ended/);
});

test("Live Guide API accepts a temporary image and reports no media retention", async () => {
  const env = { NYXTHEA_DEV_BOOTSTRAP_TOKEN: "guide-test", ASSETS: { fetch: () => new Response("asset") }, AI: { run: async () => ({ response: JSON.stringify({ observation: "A cable is loose.", nextStep: "Press the cable in gently.", verification: "Check that it sits flush.", caution: "Stop if the connector is damaged.", confidence: "medium", risk: "normal" }) }) } };
  const bootstrap = await worker.fetch(new Request("https://nyxthea.test/api/auth/bootstrap", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: "guide-test" }) }), env);
  const credential = (await bootstrap.json()).credential;
  const headers = { "content-type": "application/json", "x-nyxthea-profile": credential.profileId, "x-nyxthea-profile-token": credential.token };
  const created = await worker.fetch(new Request("https://nyxthea.test/api/live-guide", { method: "POST", headers, body: JSON.stringify({ objective: "Check a loose computer cable", sources: ["camera"], confirm: true }) }), env);
  assert.equal(created.status, 201);
  const session = (await created.json()).session;
  const analyzed = await worker.fetch(new Request(`https://nyxthea.test/api/live-guide/${session.id}/analyze`, { method: "POST", headers, body: JSON.stringify({ image: "data:image/jpeg;base64,YQ==" }) }), env);
  assert.equal(analyzed.status, 200);
  const body = await analyzed.json();
  assert.match(body.mediaRetention, /not written/);
  assert.equal(body.guidance.confidence, "medium");
});
