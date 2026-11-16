export const bubbleLearningObjectiveCourses = <
  T extends { id: string; parentId: string | null; courses: string[] },
>(
  entries: T[],
) => {
  const childrenByParentId = new Map<string, T[]>();
  for (const entry of entries) {
    if (entry.parentId) {
      childrenByParentId.set(entry.parentId, [
        ...(childrenByParentId.get(entry.parentId) ?? []),
        entry,
      ]);
    }
  }
  const coursesById = new Map<string, string[]>();
  const resolveCourses = (entry: T): string[] => {
    const known = coursesById.get(entry.id);
    if (known) return known;
    const courses = [
      ...new Set([
        ...entry.courses,
        ...(childrenByParentId.get(entry.id) ?? []).flatMap(resolveCourses),
      ]),
    ].sort();
    coursesById.set(entry.id, courses);
    return courses;
  };
  return entries.map((entry) => ({ ...entry, courses: resolveCourses(entry) }));
};
