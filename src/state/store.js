/** In-isolate working state. Selected tables are hydrated from and flushed to Durable Object storage per API request. */
const tables = new Map();
export function table(name) { if (!tables.has(name)) tables.set(name, new Map()); return tables.get(name); }
export function id(prefix) { return `${prefix}_${crypto.randomUUID()}`; }
export function now() { return new Date().toISOString(); }
export function list(name, predicate = () => true) { return [...table(name).values()].filter(predicate); }
export function replaceTable(name, entries = []) { tables.set(name, new Map(entries)); return table(name); }
export function snapshotTable(name) { return [...table(name).entries()]; }
export function resetStateForTests() { tables.clear(); }
