export const getHighlightRegExp = (words: string[]) =>
  words.length === 0
    ? null
    : new RegExp(
        `(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        "gi",
      );
