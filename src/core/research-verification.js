export function verifyResearch(items) {
  return items.filter((item) => item?.title && item?.url && /^https:\/\/en\.wikipedia\.org\//.test(item.url));
}
