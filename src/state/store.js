/** Isolate-local state. It is intentionally not advertised as durable storage. */
const tables = new Map();
export function table(name) { if (!tables.has(name)) tables.set(name, new Map()); return tables.get(name); }
export function id(prefix) { return `${prefix}_${crypto.randomUUID()}`; }
export function now() { return new Date().toISOString(); }
export function list(name, predicate = () => true) { return [...table(name).values()].filter(predicate); }
export function resetStateForTests() { tables.clear(); }
