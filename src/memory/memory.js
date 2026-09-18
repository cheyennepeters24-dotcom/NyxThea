/** Isolate-local memory with explicit logical layers and retention metadata; it is not durable storage. */
export const memoryLayers = ["short_term", "personal", "long_term", "patterns", "archive"];
const retentionHours = { short_term: 24, personal: 24 * 30, long_term: 24 * 180, patterns: 24 * 90, archive: null };
const stores = new Map(); const bucket = (scope) => { if (!stores.has(scope)) stores.set(scope, new Map()); return stores.get(scope); };
function expiry(layer, createdAt) { const hours = retentionHours[layer]; return hours === null ? null : new Date(new Date(createdAt).getTime() + hours * 3600000).toISOString(); }
function purge(scope) { const entries = bucket(scope); const time = Date.now(); for (const [key, memory] of entries) if (memory.expiresAt && new Date(memory.expiresAt).getTime() <= time) entries.delete(key); }
export function remember(scope, text, layer = "personal") { if (!text?.trim()) throw new Error("Memory text is required."); if (!memoryLayers.includes(layer)) throw new Error("A supported memory layer is required."); const createdAt = new Date().toISOString(); const id = crypto.randomUUID(); const [ownerUserId, ownerProfileId] = scope.split(":"); const memory = { id, text: text.trim(), layer, ownerUserId, ownerProfileId, createdAt, expiresAt: expiry(layer, createdAt), retention: retentionHours[layer] === null ? "until explicitly forgotten" : `${retentionHours[layer]} hours` }; bucket(scope).set(id, memory); return memory; }
export function inspect(scope, layer) { purge(scope); return [...bucket(scope).values()].filter((memory) => !layer || memory.layer === layer).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function retrieve(scope, query = "", layer) { const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean); return inspect(scope, layer).filter((memory) => terms.length === 0 || terms.every((term) => memory.text.toLowerCase().includes(term))); }
export function forget(scope, id) { return bucket(scope).delete(id); }
export function clear(scope, layer) { purge(scope); if (!layer) { const count = bucket(scope).size; stores.delete(scope); return count; } const memories = bucket(scope); const matches = inspect(scope, layer); matches.forEach(({ id }) => memories.delete(id)); return matches.length; }
export function memoryRetention() { return { ...retentionHours }; }
