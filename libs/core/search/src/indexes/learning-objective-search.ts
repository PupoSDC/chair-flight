import { default as MiniSearch } from "minisearch";
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
import type { SearchOptions } from "minisearch";

type SearchDocument = {
  id: LearningObjectiveId;
  text: string;
};

type SearchResult = {
  id: LearningObjectiveId;
  href: string;
  parentId: LearningObjectiveId | CourseId;
  courses: Array<{ id: CourseId; text: string }>;
  text: string;
  source: string;
  questionBank: QuestionBankName;
  subject: SubjectId;
  numberOfQuestions: number;
};

type SearchField = keyof SearchDocument;

let INITIALIZATION_WORK: Promise<void> | undefined;

const SEARCH_RESULTS = new Map<string, SearchResult>();

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: ["id", "text"] as SearchField[],
  storeFields: ["id"] as SearchField[],
});

export const searchLearningObjectivesParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  course: z.string(),
  searchField: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getLearningObjectivesSearchFilters = async (
  bank: QuestionBank,
) => {
  const rawSubjects = await bank.getAll("subjects");
  const subjects = rawSubjects.map((s) => ({
    id: s.id,
    text: `${s.id} - ${s.shortName}`,
  }));
  subjects.unshift({ id: "all", text: "All Subjects" });

  const rawCourses = await bank.getAll("courses");
  const courses = rawCourses.map((c) => ({
    id: c.id,
    text: c.text,
  }));
  courses.unshift({ id: "all", text: "All Courses" });

  const searchFields: Array<{
    id: SearchField | "all";
    text: string;
  }> = [
    { id: "all", text: "All Fields" },
    { id: "id", text: "Learning Objective ID" },
    { id: "text", text: "text" },
  ];

  return { subjects, courses, searchFields };
};

export const populateLearningObjectivesSearchIndex = async (
  bank: QuestionBank,
): Promise<void> => {
  if (INITIALIZATION_WORK) await INITIALIZATION_WORK;

  INITIALIZATION_WORK = (async () => {
    const allCourses = await bank.getAll("courses");
    const allLos = await bank.getAll("learningObjectives");
    const hasLos = await bank.has("learningObjectives");
    const firstId = allLos.at(0)?.id;

    if (!hasLos) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const coursesMap = makeMap(allCourses, (c) => c.id);

    const searchItems: SearchDocument[] = allLos.map((lo) => ({
      id: lo.id,
      text: lo.text,
    }));

    const resultItems: SearchResult[] = allLos.flatMap((lo) => ({
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

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => SEARCH_RESULTS.set(r.id, r));
  })();

  await INITIALIZATION_WORK;
};

export const searchLearningObjectives = async (
  ps: z.infer<typeof searchLearningObjectivesParams>,
) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
  };

  const idSearchFields = ["id"];
  const results =
    ps.q && idSearchFields.includes(ps.searchField)
      ? SEARCH_INDEX.search(ps.q, opts).map(({ id }) => SEARCH_RESULTS.get(id))
      : Array.from(SEARCH_RESULTS.values());

  const processedResults = results.filter((r): r is SearchResult => {
    return !(
      !r ||
      r.questionBank !== ps.questionBank ||
      (ps.subject !== "all" && !r.subject.includes(ps.subject)) ||
      (ps.course !== "all" && !r.courses.find((c) => c.id === ps.course)) ||
      (ps.searchField === "id" && !r.id.startsWith(ps.q))
    );
  });

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};
