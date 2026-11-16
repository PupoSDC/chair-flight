type Comparable = {
  id: string;
  parentId: string | null;
  text: string;
  items: string[];
  courses: string[];
};

const joinText = (item: Comparable) =>
  [item.text, ...item.items]
    .join(" ")
    .replace(/[;,.:]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const compareLearningObjectiveTrees = <T extends Comparable>(
  before: T[],
  after: T[],
) => {
  const beforeById = new Map(before.map((item) => [item.id, item]));
  const afterIds = new Set(after.map((item) => item.id));
  const removedCandidates = before.filter((item) => !afterIds.has(item.id));
  const removedByText = new Map(
    removedCandidates.map((item) => [joinText(item), item]),
  );
  const afterRows = after.map((item) => {
    const same = beforeById.get(item.id);
    if (!same) {
      const renumberedFrom = removedByText.get(joinText(item));
      return {
        ...item,
        change: renumberedFrom ? "renumbered" : "added",
        previous: renumberedFrom ?? null,
      };
    }
    const reworded = joinText(same) !== joinText(item);
    const coursesChanged = same.courses.join(" ") !== item.courses.join(" ");
    return {
      ...item,
      change: reworded ? "reworded" : coursesChanged ? "courses" : null,
      previous: reworded || coursesChanged ? same : null,
    };
  });
  const renumberedPreviousIds = new Set(
    afterRows.flatMap((row) =>
      row.change === "renumbered" && row.previous ? [row.previous.id] : [],
    ),
  );
  const removedRows = removedCandidates
    .filter((item) => !renumberedPreviousIds.has(item.id))
    .map((item) => ({ ...item, change: "removed", previous: null }));
  const rows = [...afterRows, ...removedRows].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
  );
  return {
    rows,
    counts: rows.reduce(
      (result, row) => {
        if (row.change) result[row.change] = (result[row.change] ?? 0) + 1;
        return result;
      },
      {} as Record<string, number>,
    ),
  };
};
