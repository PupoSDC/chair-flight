export const pushDownLearningObjectiveSources = <
  T extends { id: string; parentId: string | null; source: string },
>(
  entries: T[],
) => {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const parentIds = new Set(entries.map((entry) => entry.parentId));
  const inheritedSourcesById = new Map<string, string>();
  const resolveSource = (entry: T): string => {
    const known = inheritedSourcesById.get(entry.id);
    if (known !== undefined) return known;
    const parent = entry.parentId ? entriesById.get(entry.parentId) : undefined;
    const source = entry.source || (parent ? resolveSource(parent) : "");
    inheritedSourcesById.set(entry.id, source);
    return source;
  };
  return entries.map((entry) => ({
    ...entry,
    source: parentIds.has(entry.id) ? "" : resolveSource(entry),
  }));
};
