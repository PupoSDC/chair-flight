export const getSearchSnippet = (content: string, words: string[]) => {
  const flat = content.replace(/\s+/g, " ");
  const lower = flat.toLowerCase();
  const at = Math.max(0, lower.indexOf(words[0] ?? ""));
  const start = Math.max(0, at - 40);
  return `${start > 0 ? "…" : ""}${flat.slice(start, start + 140)}`;
};
