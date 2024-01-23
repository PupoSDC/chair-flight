import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  CourseId,
  LearningObjectiveId,
  QuestionBankName,
  SubjectId,
} from "@chair-flight/base/types";

type SearchField = "id" | "text";

type SearchDocument = Record<SearchField, string>;

type SearchResult = {
  id: LearningObjectiveId;
  href: string;
  parentId: LearningObjectiveId | CourseId;
  courses: CourseId[];
  text: string;
  source: string;
  subject: SubjectId;
  questionBank: QuestionBankName;
  numberOfQuestions: number;
};

let initializationWork: Promise<void> | undefined;

const RESULTS = new Map<string, SearchResult>();
const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: ["id", "text"] satisfies SearchField[],
  storeFields: ["id", "text"] satisfies SearchField[],
});

const populateSearchIndex = async (bank: QuestionBankName): Promise<void> => {
  const qb = questionBanks[bank];
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const los = await qb.getAll("learningObjectives");
    const hasLos = await qb.has("learningObjectives");
    const firstId = los.at(0)?.id;

    if (!hasLos) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = los.map((lo) => ({
      id: lo.id,
      text: lo.text,
    }));

    const resultItems: SearchResult[] = los.flatMap((lo) => ({
      id: lo.id,
      href: `/modules/${bank}/learning-objectives/${lo.id}`,
      parentId: lo.parentId,
      courses: lo.courses,
      text: lo.text,
      source: lo.source,
      questionBank: bank,
      subject: lo.id.split(".")[0],
      numberOfQuestions: lo.nestedQuestions.length,
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => RESULTS.set(r.id, r));
  })();

  await initializationWork;
};

export const questionBankLoSearchRouter = router({
  getSearchConfigFilters: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];

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

      const searchFields: Array<{ id: SearchField | "all"; text: string }> = [
        { id: "all", text: "All Fields" },
        { id: "id", text: "Learning Objective ID" },
        { id: "text", text: "text" },
      ];

      return { subjects, courses, searchFields };
    }),
  searchLearningObjectives: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string(),
        course: z.string(),
        searchField: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { q, subject, searchField, questionBank, limit, cursor, course } =
        input;

      await populateSearchIndex(questionBank);

      const opts = { fuzzy: 0.2 };

      const results =
        q && searchField !== "id"
          ? SEARCH_INDEX.search(q, opts).map(({ id }) => RESULTS.get(id))
          : Array.from(RESULTS.values());

      const processedResults = results.filter((r): r is SearchResult => {
        if (!r) return false;
        if (r.questionBank !== questionBank) return false;
        if (subject !== "all" && !r.subject.includes(subject)) return false;
        if (course !== "all" && !r.courses.includes(course)) return false;
        if (searchField === "id" && !r.id.startsWith(q)) return false;
        return true;
      });

      const finalItems = processedResults.slice(cursor, cursor + limit);

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
});
