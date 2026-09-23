import test from "node:test";
import assert from "node:assert/strict";
import { converse } from "../core/conversation.js";
import { orchestrate } from "../core/orchestration.js";
import { classifyComplexity } from "../core/complexity.js";

test("a spoken greeting receives a real reply without waiting on the model", async () => {
  const answer = await converse({ run: () => { throw Error("AI should not run for this greeting"); } }, "Hey Nyx. How are you?", {});
  assert.match(answer.text, /ready to talk/);
  assert.equal(answer.modelUsed, false);
});

test("a failed model gives a candid answer and conversation has time to finish", async () => {
  assert.ok(classifyComplexity("Please help me plan dinner").budgetMs >= 10000);
  const response = await orchestrate({ ai: { run: async () => { throw Error("provider unavailable"); } }, message: "Please help me plan dinner", memories: [], conversation: [], authorization: {} });
  assert.equal(response.type, "conversation_unavailable");
  assert.match(response.answer, /I heard you/);
  assert.equal(response.modelUsed, false);
});


test("empty first model response is retried before degrading", async () => {
  let calls=0;
  const response = await converse({ run: async () => { calls++; return calls===1 ? { response:"" } : { response:"Second try worked." }; } }, "Tell me something useful.", {});
  assert.equal(response.text, "Second try worked.");
  assert.equal(calls, 2);
});

test("Nyxthea can describe herself without model dependency", async () => {
  const response = await converse({ run: async () => { throw Error("model should not run"); } }, "Can you tell me a little bit about you and what all you can do?", {});
  assert.match(response.text, /voice-first personal and household assistant/i);
  assert.equal(response.modelUsed, false);
});
