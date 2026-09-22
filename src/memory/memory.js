import { table } from "../state/store.js";

/** Explicit, profile-scoped memory with logical layers and retention metadata. */
export const memoryLayers = ["short_term", "personal", "long_term", "patterns", "archive"];
const retentionHours = { short_term: 24, personal: 24 * 30, long_term: 24 * 180, patterns: 24 * 90, archive: null };
const stores = () => table("memories");
function expiry(layer, createdAt) { const hours = retentionHours[layer]; return hours === null ? null : new Date(new Date(createdAt).getTime() + hours * 3600000).toISOString(); }
function scoped(scope) { return [...stores().values()].filter((memory) => memory.scope === scope); }
function purge(scope) { const time = Date.now(); for (const memory of scoped(scope)) if (memory.expiresAt && new Date(memory.expiresAt).getTime() <= time) stores().delete(memory.id); }
export function remember(scope, text, layer = "personal") { if (!text?.trim()) throw new Error("Memory text is required."); if (!memoryLayers.includes(layer)) throw new Error("A supported memory layer is required."); const createdAt = new Date().toISOString(); const id = crypto.randomUUID(); const [ownerUserId, ownerProfileId] = scope.split(":"); const memory = { id, scope, text: text.trim(), layer, ownerUserId, ownerProfileId, createdAt, expiresAt: expiry(layer, createdAt), retention: retentionHours[layer] === null ? "until explicitly forgotten" : `${retentionHours[layer]} hours` }; stores().set(id, memory); return memory; }
export function inspect(scope, layer) { purge(scope); return scoped(scope).filter((memory) => !layer || memory.layer === layer).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function retrieve(scope, query = "", layer) { const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean); return inspect(scope, layer).filter((memory) => terms.length === 0 || terms.every((term) => memory.text.toLowerCase().includes(term))); }
export function forget(scope, id) { const memory = stores().get(id); return memory?.scope === scope ? stores().delete(id) : false; }
export function clear(scope, layer) { purge(scope); const matches = inspect(scope, layer); matches.forEach(({ id }) => stores().delete(id)); return matches.length; }
export function memoryRetention() { return { ...retentionHours }; }
