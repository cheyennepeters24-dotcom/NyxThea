import { routeDecision } from "./decision.js";
import { buildContext } from "./context.js";
import { converse } from "./conversation.js";
import { makePlan } from "./problem-solving.js";
import { researchWikipedia } from "./research.js";
import { verifyResearch } from "./research-verification.js";
import { synthesizeResearch } from "./research-synthesis.js";
import { createReasoningRecord } from "./reasoning-pipeline.js";
import { detectContext, protectIntent } from "../intelligence/context-engine.js";
const withinBudget = (work, budgetMs) => Promise.race([work, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("Processing budget exceeded."), { status: 504 })), budgetMs))]);
export async function orchestrate({ ai, message, memories, conversation, authorization, mode = "normal" }) {
  const startedAt = Date.now(); const decision = routeDecision(message); const context = detectContext(message); const intentProtection = protectIntent(message, context);
  const timing = () => ({ elapsedMs: Date.now() - startedAt, budgetMs: decision.complexity.budgetMs, enforced: true });
  if (mode === "quiet") return { type: "quiet", answer: "", context, intentProtection, reasoning: createReasoningRecord({ message, route: decision.route, authorization }), processing: decision.processing, timing: timing() };
  if (decision.route === "research") { const candidates = await withinBudget(researchWikipedia(message), decision.complexity.budgetMs); const results = verifyResearch(candidates); return { type: "research", answer: "Here is what I found through Wikipedia. Review the linked sources for details.", context, intentProtection, research: synthesizeResearch(results), plan: makePlan(message), reasoning: createReasoningRecord({ message, route: decision.route, research: candidates, authorization }), processing: decision.processing, timing: timing() }; }
  const response = await withinBudget(converse(ai, message, buildContext({ memories, conversation })), decision.complexity.budgetMs);
  return { type: "conversation", answer: response.text, modelUsed: response.modelUsed, context, intentProtection, plan: makePlan(message), reasoning: createReasoningRecord({ message, route: decision.route, authorization }), processing: decision.processing, timing: timing() };
}
