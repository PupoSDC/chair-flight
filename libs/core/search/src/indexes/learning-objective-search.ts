import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import {
  questionBankNameSchema,
  type LearningObjectiveId,
  type QuestionBank,
  type QuestionBankName,
  type SubjectId,
} from "@chair-flight/core/question-bank";
import type { CourseId } from "@chair-flight/core/question-bank";
import type { default as MiniSearch, SearchOptions } from "minisearch";

export type LearningObjectiveSearchField = "id" | "text";

export type learningObjectiveSearchDocument = Record<
  LearningObjectiveSearchField,
  string
>;

export type LearningObjectiveSearchResult = {
  id: LearningObjectiveId;
  href: string;
  parentId: LearningObjectiveId | CourseId;
  courses: Array<{ id: CourseId; text: string }>;
  text: string;
  source: string;
  subject: SubjectId;
  questionBank: QuestionBankName;
  numberOfQuestions: number;
};

let initializationWork: Promise<void> | undefined;

export const searchLearningObjectivesParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  course: z.string(),
  searchField: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getLearningObjectivesSearchFilters = async (qb: QuestionBank) => {
  const rawSubjects = await qb.getAll("subjects");
  const subjects = rawSubjects.map((s) => ({
    id: s.id,
    text: `${s.id} - ${s.shortName}`,
  }));
  subjects.unshift({ id: "all", text: "All Subjects" });

  const rawCourses = await qb.getAll("courses");
  const courses = rawCourses.map((c) => ({
    id: c.id,
    text: c.text,
  }));
  courses.unshift({ id: "all", text: "All Courses" });

  const searchFields: Array<{
    id: LearningObjectiveSearchField | "all";
    text: string;
  }> = [
    { id: "all", text: "All Fields" },
    { id: "id", text: "Learning Objective ID" },
    { id: "text", text: "text" },
  ];

  return { subjects, courses, searchFields };
};

export const populateLearningObjectivesSearchIndex = async ({
  bank,
  searchIndex,
  searchResults,
}: {
  bank: QuestionBank;
  searchIndex: MiniSearch<learningObjectiveSearchDocument>;
  searchResults: Map<string, LearningObjectiveSearchResult>;
}): Promise<void> => {
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const allCourses = await bank.getAll("courses");
    const los = await bank.getAll("learningObjectives");
    const hasLos = await bank.has("learningObjectives");
    const firstId = los.at(0)?.id;

    if (!hasLos) return;
    if (searchIndex.has(firstId)) return;

    const coursesMap = makeMap(allCourses, (c) => c.id);

    const searchItems: learningObjectiveSearchDocument[] = los.map((lo) => ({
      id: lo.id,
      text: lo.text,
    }));

    const resultItems: LearningObjectiveSearchResult[] = los.flatMap((lo) => ({
      id: lo.id,
      href: `/modules/${bank.getName()}/learning-objectives/${lo.id}`,
      parentId: lo.parentId,
      courses: lo.courses.map((c) => coursesMap[c]),
      text: lo.text,
      source: lo.source,
      questionBank: bank.getName(),
      subject: lo.id.split(".")[0],
      numberOfQuestions: lo.nestedQuestions.length,
    }));

    await searchIndex.addAllAsync(searchItems);
    resultItems.forEach((r) => searchResults.set(r.id, r));
  })();

  await initializationWork;
};

export const searchLearningObjectives = async ({
  params: ps,
  searchIndex,
  searchResults,
}: {
  params: z.infer<typeof searchLearningObjectivesParams>;
  searchIndex: MiniSearch<learningObjectiveSearchDocument>;
  searchResults: Map<string, LearningObjectiveSearchResult>;
}) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
  };

  const results =
    ps.q && ps.searchField !== "id"
      ? searchIndex.search(ps.q, opts).map(({ id }) => searchResults.get(id))
      : Array.from(searchResults.values());

  const processedResults = results.filter(
    (r): r is LearningObjectiveSearchResult => {
      return !(
        !r ||
        r.questionBank !== ps.questionBank ||
        (ps.subject !== "all" && !r.subject.includes(ps.subject)) ||
        (ps.course !== "all" && !r.courses.find((c) => c.id === ps.course)) ||
        (ps.searchField === "id" && !r.id.startsWith(ps.q))
      );
    },
  );

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};
