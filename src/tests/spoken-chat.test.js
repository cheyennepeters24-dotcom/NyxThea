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
  assert.ok(classifyComplexity("Please help me plan dinner").budgetMs >= 20000);
  const response = await orchestrate({ ai: { run: async () => { throw Error("provider unavailable"); } }, message: "Please help me plan dinner", memories: [], conversation: [], authorization: {} });
  assert.equal(response.type, "conversation_unavailable");
  assert.match(response.answer, /I heard you/);
  assert.equal(response.modelUsed, false);
});
