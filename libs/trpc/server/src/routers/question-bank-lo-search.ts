import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  QuestionBankLearningObjective,
  QuestionBankName,
  SubjectId,
} from "@chair-flight/base/types";

type SearchField = "id" | "text";

type SearchDocument = Record<SearchField, string>;

type SearchResult = Omit<
  QuestionBankLearningObjective,
  | "learningObjectives"
  | "nestedLearningObjectives"
  | "questions"
  | "nestedQuestions"
> & {
  subject: SubjectId;
  questionBank: QuestionBankName;
  numberOfLearningObjectives: number;
  numberOfQuestions: number;
};

let initializationWork: Promise<void> | undefined;

const RESULTS = new Map<string, SearchResult>();

const SEARCH_INDEX_FIELDS = ["id", "text"] as const satisfies SearchField[];

const SEARCH_STORE_FIELDS = ["id"] as const satisfies SearchField[];

const SEARCHABLE_FIELDS = ["id", "text"] as const satisfies SearchField[];

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: SEARCH_INDEX_FIELDS,
  storeFields: SEARCH_STORE_FIELDS,
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
      parentId: lo.parentId,
      courses: lo.courses,
      text: lo.text,
      source: lo.source,
      questionBank: bank,
      subject: lo.id.split(".")[0],
      numberOfLearningObjectives: lo.nestedLearningObjectives.length,
      numberOfQuestions: lo.nestedQuestions.length + lo.questions.length,
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => RESULTS.set(r.id, r));
  })();

  await initializationWork;
};

export const questionBankLoSearchRouter = router({
  searchLearningObjectives: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string().nullable(),
        course: z.string().nullable(),
        searchField: z.enum(SEARCHABLE_FIELDS).nullable(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { q, subject, searchField, questionBank, limit, cursor, course } =
        input;

      await populateSearchIndex(questionBank);

      const fields = searchField ? [searchField] : undefined;
      const opts = { fuzzy: 0.2, fields };

      const results = q
        ? SEARCH_INDEX.search(q, opts).map(({ id }) => RESULTS.get(id))
        : Array.from(RESULTS.values());

      const processedResults = results.filter((r): r is SearchResult => {
        if (!r) return false;
        if (r.questionBank !== questionBank) return false;
        if (subject && !r.subject.includes(subject)) return false;
        if (searchField && !`${r[searchField]}`.includes(q)) return false;
        if (course && !r.courses.includes(course)) return false;
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
