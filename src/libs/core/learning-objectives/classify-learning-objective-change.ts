export const classifyLearningObjectiveChange = (
  entry: { id: string; text: string },
  linked: { id: string; text: string }[],
) => {
  if (linked.length === 0) return "unlinked" as const;
  const [only] = linked;
  const sameText =
    linked.length === 1 &&
    getComparableText(only.text) === getComparableText(entry.text);
  if (!sameText) return "reworded" as const;
  return only.id === entry.id
    ? ("unchanged" as const)
    : ("renumbered" as const);
};

const getComparableText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
