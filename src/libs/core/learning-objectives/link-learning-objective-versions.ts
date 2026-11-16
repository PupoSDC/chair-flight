import { classifyLearningObjectiveChange } from "./classify-learning-objective-change.ts";

type ParsedEntry = {
  id: string;
  subject: string;
  level: number;
  text: string;
  originalText: string;
  source: string;
  courses: string[];
  linkedReferences: string[];
};

const mergeDuplicateEntries = (entries: ParsedEntry[]) =>
  Array.from(
    entries
      .reduce((byId, entry) => {
        const existing = byId.get(entry.id);
        byId.set(
          entry.id,
          existing
            ? {
                ...existing,
                courses: [...new Set([...existing.courses, ...entry.courses])],
                linkedReferences: [
                  ...new Set([
                    ...existing.linkedReferences,
                    ...entry.linkedReferences,
                  ]),
                ],
              }
            : entry,
        );
        return byId;
      }, new Map<string, ParsedEntry>())
      .values(),
  ).sort((a, b) => a.id.localeCompare(b.id));

const findParentId = (id: string, subject: string, ids: Set<string>) => {
  const segments = id.split(".");
  for (let length = segments.length - 1; length >= 1; length--) {
    const candidate = segments
      .slice(0, length)
      .join(".")
      .replace(/(\.00)+$/, "");
    if (candidate !== id && ids.has(candidate)) return candidate;
  }
  return id !== subject && ids.has(subject) ? subject : null;
};

export const linkLearningObjectiveVersions = (input: {
  matching: "bridge" | "direct";
  previous: { version: string; entries: ParsedEntry[] };
  current: { version: string; entries: ParsedEntry[] };
}) => {
  const previousEntries = mergeDuplicateEntries(input.previous.entries);
  const currentEntries = mergeDuplicateEntries(input.current.entries);
  const previousIds = new Set(previousEntries.map((entry) => entry.id));
  const currentIds = new Set(currentEntries.map((entry) => entry.id));
  const previousIdsByBridge = previousEntries.reduce((result, entry) => {
    for (const bridge of entry.linkedReferences) {
      result.set(bridge, [...(result.get(bridge) ?? []), entry.id]);
    }
    return result;
  }, new Map<string, string[]>());
  const previousIdsByCurrentId = new Map(
    currentEntries.map((entry) => [
      entry.id,
      input.matching === "direct"
        ? [
            ...new Set(
              entry.linkedReferences.filter((id) => previousIds.has(id)),
            ),
          ].sort()
        : [
            ...new Set(
              entry.linkedReferences.flatMap(
                (bridge) => previousIdsByBridge.get(bridge) ?? [],
              ),
            ),
          ].sort(),
    ]),
  );
  const nextIdsByPreviousId = new Map<string, string[]>();
  for (const [currentId, ids] of previousIdsByCurrentId) {
    for (const id of ids) {
      nextIdsByPreviousId.set(id, [
        ...(nextIdsByPreviousId.get(id) ?? []),
        currentId,
      ]);
    }
  }
  const previousEntriesById = new Map(
    previousEntries.map((entry) => [entry.id, [entry]]),
  );
  const toRow = (
    version: string,
    ids: Set<string>,
    entry: ParsedEntry,
    links: { previousIds: string[]; nextIds: string[] },
    change: "new" | "unchanged" | "renumbered" | "reworded" | null,
  ) => ({
    version,
    id: entry.id,
    parentId: findParentId(entry.id, entry.subject, ids),
    subject: entry.subject,
    level: entry.level,
    text: entry.text,
    originalText: entry.originalText,
    source: entry.source,
    courses: entry.courses,
    previousIds: links.previousIds,
    nextIds: links.nextIds,
    change,
  });
  const getChange = (entry: ParsedEntry, ids: string[]) => {
    const change = classifyLearningObjectiveChange(
      entry,
      ids.flatMap((id) => previousEntriesById.get(id) ?? []),
    );
    return change === "unlinked" ? ("new" as const) : change;
  };
  return {
    previous: previousEntries.map((entry) =>
      toRow(
        input.previous.version,
        previousIds,
        entry,
        { previousIds: [], nextIds: nextIdsByPreviousId.get(entry.id) ?? [] },
        null,
      ),
    ),
    current: currentEntries.map((entry) => {
      const ids = previousIdsByCurrentId.get(entry.id) ?? [];
      return toRow(
        input.current.version,
        currentIds,
        entry,
        { previousIds: ids, nextIds: [] },
        getChange(entry, ids),
      );
    }),
  };
};
