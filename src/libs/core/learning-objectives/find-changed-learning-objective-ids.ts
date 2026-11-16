export const findChangedLearningObjectiveIds = (
  rows: { id: string; parentId: string | null; change: string | null }[],
) => {
  const parentIdsById = new Map(rows.map((row) => [row.id, row.parentId]));
  return rows.reduce((result, row) => {
    if (!row.change) return result;
    let id: string | null = row.id;
    while (id && !result.has(id)) {
      result.add(id);
      id = parentIdsById.get(id) ?? null;
    }
    return result;
  }, new Set<string>());
};
