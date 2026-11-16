import { cleanLearningObjectiveSource } from "./clean-learning-objective-source.ts";
import { cleanLearningObjectiveText } from "./clean-learning-objective-text.ts";
import { findLearningObjectiveReferences } from "./find-learning-objective-references.ts";

const MAX_LEVEL_OF_HEADINGS = 4;

export const parseLearningObjectiveSheet = (
  rows: string[][],
  columns: {
    subject: string;
    reference: string | RegExp;
    text: string | RegExp;
    linkedReferences: string | RegExp;
    source?: RegExp;
    courses?: Record<string, string>;
    coursesAfter?: { header: string | RegExp; courseIds: string[] };
  },
) => {
  const headerIndex = rows.findIndex((row) => row[0]?.trim() === "Index");
  if (headerIndex < 0) throw new Error(`No header row in ${columns.subject}.`);
  const headers = rows[headerIndex].map((header) => header.trim());
  const findColumn = (matcher: string | RegExp) => {
    const index = headers.findIndex((header) =>
      typeof matcher === "string" ? header === matcher : matcher.test(header),
    );
    if (index < 0) throw new Error(`Missing column ${matcher} in sheet.`);
    return index;
  };
  const referenceColumn = findColumn(columns.reference);
  const textColumn = findColumn(columns.text);
  const linkedColumn = findColumn(columns.linkedReferences);
  const sourceColumn = columns.source ? findColumn(columns.source) : -1;
  const courseColumns = columns.coursesAfter
    ? columns.coursesAfter.courseIds.map((courseId, offset) => ({
        courseId,
        index: findColumn(columns.coursesAfter?.header ?? "") + 1 + offset,
      }))
    : Object.entries(columns.courses ?? {}).map(([header, courseId]) => ({
        courseId,
        index: findColumn(header),
      }));
  const skipped = { withoutReference: 0, withoutText: 0 };
  const entries = rows.slice(headerIndex + 1).flatMap((row) => {
    const [id] = findLearningObjectiveReferences(row[referenceColumn] ?? "");
    const originalText = row[textColumn] ?? "";
    if (!id) {
      if (originalText.trim()) skipped.withoutReference++;
      return [];
    }
    if (!originalText.trim()) {
      skipped.withoutText++;
      return [];
    }
    const level = id.split(".").length;
    const { text, inlineSource } = cleanLearningObjectiveText(originalText, {
      heading: level <= MAX_LEVEL_OF_HEADINGS,
    });
    const source = cleanLearningObjectiveSource(
      sourceColumn >= 0 ? (row[sourceColumn] ?? "") : inlineSource,
    );
    return [
      {
        id,
        subject: columns.subject,
        level,
        text,
        originalText,
        source,
        courses: courseColumns
          .filter(({ index }) => row[index]?.trim())
          .map(({ courseId }) => courseId),
        linkedReferences: findLearningObjectiveReferences(
          row[linkedColumn] ?? "",
        ),
      },
    ];
  });
  return { entries, skipped };
};
