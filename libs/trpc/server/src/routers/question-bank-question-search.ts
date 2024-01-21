import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import { getQuestionPreview } from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type { QuestionBankName } from "@chair-flight/base/types";

type SearchField =
  | "id"
  | "questionId"
  | "questionBank"
  | "subjects"
  | "learningObjectives"
  | "externalIds"
  | "text";

type SearchDocument = Record<SearchField, string>;

type SearchResult = {
  id: string;
  questionBank: QuestionBankName;
  questionId: string;
  variantId: string;
  subjects: string[];
  text: string;
  learningObjectives: Array<{
    name: string;
    href: string;
  }>;
  externalIds: string[];
  href: string;
};

let initializationWork: Promise<void> | undefined;

const EXACT_MATCH_SEPERATOR = ", ";
const RESULTS = new Map<string, SearchResult>();

const SEARCH_INDEX_FIELDS = [
  "id",
  "questionId",
  "questionBank",
  "subjects",
  "learningObjectives",
  "text",
  "externalIds",
] as const satisfies SearchField[];

const SEARCH_STORE_FIELDS = [
  "id",
  "questionId",
] as const satisfies SearchField[];

const SEARCHABLE_FIELDS = [
  "questionId",
  "learningObjectives",
  "text",
  "externalIds",
] as const satisfies SearchField[];

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: SEARCH_INDEX_FIELDS,
  storeFields: SEARCH_STORE_FIELDS,
});

const populateSearchIndex = async (bank: QuestionBankName): Promise<void> => {
  const qb = questionBanks[bank];
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const questions = await qb.getAll("questions");
    const hasQuestions = await qb.has("questions");
    const firstId = Object.values(questions.at(0)?.variants ?? []).at(0)?.id;

    if (!hasQuestions) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = questions.flatMap((question) => {
      const subjects = question.learningObjectives.map((l) => l.split(".")[0]);
      const los = question.learningObjectives.join(EXACT_MATCH_SEPERATOR);
      const uniqueSubjects = [...new Set(subjects)];
      return Object.values(question.variants).map((variant) => ({
        id: variant.id,
        questionId: question.id,
        questionBank: bank,
        subjects: uniqueSubjects.join(EXACT_MATCH_SEPERATOR),
        learningObjectives: los,
        externalIds: variant.externalIds.join(EXACT_MATCH_SEPERATOR),
        text: getQuestionPreview(question, variant.id),
      }));
    });

    const resultItems: SearchResult[] = questions.flatMap((q) => {
      const subjects = q.learningObjectives.map((l) => l.split(".")[0]);
      const uniqueSubjects = [...new Set(subjects)];
      return Object.values(q.variants).map((v) => ({
        questionBank: bank,
        id: v.id,
        questionId: q.id,
        variantId: v.id,
        text: getQuestionPreview(q, v.id),
        subjects: uniqueSubjects,
        learningObjectives: q.learningObjectives.map((name) => ({
          name,
          href: `/modules/${bank}/learning-objectives/${name}`,
        })),
        externalIds: v.externalIds,
        href: `/modules/${bank}/questions/${q.id}?variantId=${v.id}`,
      }));
    });

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => RESULTS.set(r.id, r));
  })();

  await initializationWork;
};

export const questionBankQuestionSearchRouter = router({
  initialize: publicProcedure.query(async () => {
    const banks = Object.keys(questionBanks) as QuestionBankName[];
    for (const bank of banks) await populateSearchIndex(bank);
    return "ok";
  }),
  searchQuestions: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string().nullable(),
        searchField: z.enum(SEARCHABLE_FIELDS).nullable(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { q, subject, searchField, questionBank, limit, cursor } = input;

      await populateSearchIndex(questionBank);

      const fields = searchField ? [searchField] : undefined;
      const opts = { fuzzy: 0.2, fields };

      const results = q
        ? SEARCH_INDEX.search(q, opts).map(({ id }) => RESULTS.get(id))
        : Array.from(RESULTS.values());

      const processedResults = results.filter((r): r is SearchResult => {
        if (!r) return false;
        if (r["questionBank"] !== questionBank) return false;
        if (subject && !r.subjects.join(",").includes(subject)) return false;
        if (searchField && !`${r[searchField]}`.includes(q)) return false;
        return true;
      });

      const finalItems = processedResults.slice(cursor, cursor + limit);

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
  getQuestionsFromLearningObjective: publicProcedure
    .input(
      z.object({
        questionBank,
        learningObjectiveId: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { questionBank, learningObjectiveId, limit, cursor } = input;
      await populateSearchIndex(questionBank);
      const qb = questionBanks[input.questionBank];
      const { questions, nestedQuestions } = await qb.getOne(
        "learningObjectives",
        learningObjectiveId,
      );
      const ogQuestions = await qb.getSome(
        "questions",
        [...new Set([...questions, ...nestedQuestions])]
      );
      const processedResults: SearchResult[] = ogQuestions
        .map((q) => {
          const v = Object.values(q.variants)[0];
          return RESULTS.get(v.id);
        })
        .filter(Boolean);

      const finalItems = processedResults.slice(cursor, cursor + limit);

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
});
