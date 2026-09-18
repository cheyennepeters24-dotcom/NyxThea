import { understand } from "./understanding.js";
import { classifyComplexity } from "./complexity.js";
export function routeDecision(message) { const understanding = understand(message); const route = understanding.intent === "research" ? "research" : understanding.intent === "remember" ? "memory" : "conversation"; const complexity = classifyComplexity(message); return { ...understanding, route, processing: route === "research" ? "deliberate" : complexity.level, complexity }; }
