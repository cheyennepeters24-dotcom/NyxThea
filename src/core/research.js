const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
export async function researchWikipedia(query) {
  const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: query, gsrlimit: "3", prop: "extracts|info", exintro: "1", explaintext: "1", inprop: "url", format: "json", origin: "*" });
  const response = await fetch(`${WIKIPEDIA_API}?${params}`);
  if (!response.ok) throw new Error("Wikipedia could not be reached.");
  const data = await response.json();
  return Object.values(data.query?.pages || {}).map(({ title, extract, fullurl }) => ({ title, extract: extract || "No introductory summary was returned.", url: fullurl })).filter((item) => item.url);
}
