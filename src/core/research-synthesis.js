export function synthesizeResearch(items) {
  if (!items.length) return "I could not find a verified Wikipedia result for that search.";
  return items.map((item) => ({ title: item.title, summary: item.extract, source: item.url }));
}
