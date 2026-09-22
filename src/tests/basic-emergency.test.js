import test from "node:test";
import assert from "node:assert/strict";
import worker from "../../_worker.js";
import { resetStateForTests } from "../state/store.js";

const env = { NYXTHEA_DEV_BOOTSTRAP_TOKEN: "emergency-test", ASSETS: { fetch: () => new Response("asset") } };

async function bootstrap() {
  const response = await worker.fetch(new Request("https://nyxthea.test/api/auth/bootstrap", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: "emergency-test" }),
  }), env);
  const body = await response.json();
  return { "content-type": "application/json", "x-nyxthea-profile": body.credential.profileId, "x-nyxthea-profile-token": body.credential.token };
}

async function call(path, headers, { method = "GET", data } = {}) {
  const response = await worker.fetch(new Request(`https://nyxthea.test${path}`, {
    method, headers, body: data ? JSON.stringify(data) : undefined,
  }), env);
  return { response, body: await response.json() };
}

test.beforeEach(() => resetStateForTests());

test("basic emergency requires deliberate confirmation and reports disconnected actions", async () => {
  const headers = await bootstrap();
  assert.equal((await call("/api/emergency/incidents", headers, { method: "POST", data: { type: "intruder" } })).response.status, 400);
  const started = await call("/api/emergency/incidents", headers, { method: "POST", data: { type: "intruder", confirm: true } });
  assert.equal(started.response.status, 202);
  assert.equal(started.body.incident.status, "active");
  assert.equal(started.body.incident.capabilities.emergencyDispatch, "not_connected");
  assert.equal(started.body.incident.capabilities.trustedContactMessaging, "not_connected");
  assert.equal(started.body.incident.capabilities.backgroundLocation, "not_connected");
  assert.match(started.body.incident.timeline[0].detail, /has not contacted/);
});

test("one-time location requires permission, validates coordinates, and is not continuous", async () => {
  const headers = await bootstrap();
  const started = await call("/api/emergency/incidents", headers, { method: "POST", data: { type: "medical", confirm: true } });
  const id = started.body.incident.id;
  assert.equal((await call(`/api/emergency/incidents/${id}/location`, headers, { method: "POST", data: { latitude: 40, longitude: -75, accuracy: 8 } })).response.status, 400);
  const saved = await call(`/api/emergency/incidents/${id}/location`, headers, { method: "POST", data: { share: true, latitude: 40, longitude: -75, accuracy: 8 } });
  assert.equal(saved.body.incident.location.kind, "one_time_browser_snapshot");
  assert.match(saved.body.incident.timeline.at(-1).detail, /not background or continuous/);
});

test("practice and real incidents remain profile-scoped", async () => {
  const ownerHeaders = await bootstrap();
  const created = await call("/api/profiles", ownerHeaders, { method: "POST", data: { displayName: "Other" } });
  const otherHeaders = { "content-type": "application/json", "x-nyxthea-profile": created.body.credential.profileId, "x-nyxthea-profile-token": created.body.credential.token };
  const practice = await call("/api/emergency/incidents", ownerHeaders, { method: "POST", data: { type: "i_need_help", confirm: true, practice: true } });
  assert.equal(practice.body.incident.status, "practice_active");
  assert.equal((await call("/api/emergency/incidents", otherHeaders)).body.incidents.length, 0);
  assert.equal((await call(`/api/emergency/incidents/${practice.body.incident.id}/mark-safe`, otherHeaders, { method: "POST", data: { confirm: true } })).response.status, 404);
});
