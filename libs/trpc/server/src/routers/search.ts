import type { MatchInfo } from "minisearch";
import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import type { LearningObjective } from "@chair-flight/base/types";
import { getQuestionPreview } from "@chair-flight/core/app";
import { publicProcedure, router } from "../config/trpc";

type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  learningObjectives: string[];
  externalIds: string[];
  numberOfVariants: number;
};

type SearchResult<T> = {
  result: T;
  score: number;
  match: MatchInfo;
  terms: string[];
};

const searchQueryValidation = z.object({
  q: z.string().optional(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

const searchQuestionsFields = [
  "id",
  "questionId",
  "text",
  "learningObjectives",
  "numberOfVariants",
  "externalIds",
];

const searchQuestionsIndex = new MiniSearch<{
  id: string;
  questionId: string;
  text: string;
  learningObjectives: string;
  externalIds: string;
}>({
  fields: searchQuestionsFields.filter((f) => f !== "numberOfVariants"),
  storeFields: searchQuestionsFields,
});

const searchLearningObjectivesIndex = new MiniSearch<LearningObjective>({
  fields: ["id", "text"],
  storeFields: ["id"],
});

let searchQuestionsInitializationWork: Promise<void> | undefined;
let searchLearningObjectivesInitializationWork: Promise<void> | undefined;

export const searchRouter = router({
  searchQuestions: publicProcedure
    .input(searchQueryValidation)
    .query(async ({ ctx, input }) => {
      if (searchQuestionsInitializationWork) {
        await searchQuestionsInitializationWork;
      }

      if (searchQuestionsIndex.documentCount === 0) {
        searchQuestionsInitializationWork = (async () => {
          const questions = await ctx.questionBank.getAllQuestionTemplates();
          const itemsToPush = questions.flatMap((question) =>
            Object.values(question.variants).map((variant) => ({
              id: variant.id,
              questionId: question.id,
              learningObjectives: question.learningObjectives.join(", "),
              externalIds: variant.externalIds.join(", "),
              numberOfVariants: Object.values(question.variants).length,
              text: getQuestionPreview(question, variant.id),
            })),
          );

          await searchQuestionsIndex.addAllAsync(itemsToPush);
        })();
        await searchQuestionsInitializationWork;
      }

      const { q, limit, cursor = 0 } = input;
      const searchResults = q
        ? searchQuestionsIndex.search(q, { fuzzy: 0.2 })
        : [];
      const seenQuestions: Record<string, number> = {};
      const results = searchResults.reduce<SearchResult<QuestionPreview>[]>(
        (sum, result) => {
          const questionId = result["questionId"];
          if (seenQuestions[questionId]) return sum;
          seenQuestions[questionId] = 1;
          sum.push({
            result: {
              questionId: result["questionId"],
              variantId: result["id"],
              text: result["text"],
              learningObjectives: result["learningObjectives"].split(", "),
              externalIds: result["externalIds"].split(", "),
              numberOfVariants: result["numberOfVariants"],
            },
            score: result.score,
            match: result.match,
            terms: result.terms,
          });
          return sum;
        },
        [],
      );

      const items = results.slice(cursor, cursor + limit);
      return {
        items,
        totalResults: results.length,
        nextCursor: cursor + items.length,
      };
    }),
  searchLearningObjectives: publicProcedure
    .input(searchQueryValidation)
    .query(async ({ ctx, input }) => {
      if (searchLearningObjectivesInitializationWork) {
        await searchLearningObjectivesInitializationWork;
      }
      if (searchLearningObjectivesIndex.documentCount === 0) {
        searchLearningObjectivesInitializationWork = (async () => {
          const learningObjectives =
            await ctx.questionBank.getAllLearningObjectives();
          await searchLearningObjectivesIndex.addAllAsync(learningObjectives);
        })();
        await searchLearningObjectivesInitializationWork;
      }

      const { q, limit, cursor = 0 } = input;
      const learningObjectives =
        await ctx.questionBank.getAllLearningObjectives();
      const learningObjectiveMap = learningObjectives.reduce<
        Record<string, LearningObjective>
      >((sum, lo) => {
        sum[lo.id] = lo;
        return sum;
      }, {});

      const MATCH_LO_ID = /^[0-9]{3}(.[0-9]{2}){0,3}$/;
      let searchResultItems: SearchResult<LearningObjective>[];
      if (!q) {
        searchResultItems = learningObjectives.map((result) => ({
          result,
          score: 1,
          match: {},
          terms: [],
        }));
      } else if (MATCH_LO_ID.test(q)) {
        searchResultItems = learningObjectives
          .filter((doc) => doc.id.startsWith(q))
          .map((result) => ({
            result,
            score: 1,
            match: {},
            terms: [],
          }));
      } else {
        const miniSearchResults = await searchLearningObjectivesIndex.search(
          q,
          {
            boost: { id: 100, text: 0 },
            weights: { fuzzy: 0, prefix: 10 },
          },
        );
        searchResultItems = miniSearchResults.map((result) => ({
          result: learningObjectiveMap[result.id as string],
          score: result.score,
          match: result.match,
          terms: result.terms,
        }));
      }

      return {
        items: searchResultItems.slice(cursor, cursor + limit),
        totalResults: learningObjectives.length,
        nextCursor: cursor + limit,
      };
    }),
});
