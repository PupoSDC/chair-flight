const DOCUMENT_SUFFIX_MATCH =
  /,?\s+(Articles?|Art\.|Part|Chapter|Section|Appendix|Preamble)\b.*$/s;

const findSourceDocument = (source: string) =>
  source.includes("\n") ? source : source.replace(DOCUMENT_SUFFIX_MATCH, "");

export const liftLearningObjectiveSources = <
  T extends { id: string; parentId: string | null; source: string },
>(
  rows: T[],
) => {
  const childrenByParentId = new Map<string, T[]>();
  for (const row of rows) {
    if (row.parentId) {
      childrenByParentId.set(row.parentId, [
        ...(childrenByParentId.get(row.parentId) ?? []),
        row,
      ]);
    }
  }
  const effectiveSources = new Map<string, string>();
  const resolveEffectiveSource = (row: T): string => {
    const known = effectiveSources.get(row.id);
    if (known !== undefined) return known;
    const childSources = new Set(
      (childrenByParentId.get(row.id) ?? []).map((child) =>
        findSourceDocument(resolveEffectiveSource(child)),
      ),
    );
    const [onlyChildSource] = childSources;
    const lifted =
      childSources.size === 1 && onlyChildSource ? onlyChildSource : "";
    const effective = row.source || lifted;
    effectiveSources.set(row.id, effective);
    return effective;
  };
  return rows.map((row) => {
    const effective = resolveEffectiveSource(row);
    const parentEffective = row.parentId
      ? (effectiveSources.get(row.parentId) ?? "")
      : "";
    return {
      ...row,
      source: effective,
      sourceRepeatsParent: effective !== "" && effective === parentEffective,
    };
  });
};
