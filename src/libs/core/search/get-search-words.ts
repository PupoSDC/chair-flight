export const getSearchWords = (query: string) =>
  query.split(/\s+/).filter(Boolean).slice(0, 8);
