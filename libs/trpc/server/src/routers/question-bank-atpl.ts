import { z } from "zod";
import {
  getLearningObjectives,
  getQuestion,
  getQuestions,
  getQuestionsMap,
  getSubjects,
} from "@chair-flight/content/question-bank-atpl";
import { getQuestionPreview } from "@chair-flight/core/app";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/core/github";
import { questionEditSchema } from "@chair-flight/core/schemas";
import { makeSearchHandler } from "../common/search";
import { publicProcedure, router } from "../config/trpc";
import type { SearchResponseItem } from "../common/search";

type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  numberOfVariants: number;
  learningObjectives: string[];
  href: string;
};

export const questionBank737Router = router({
  getSubjects: publicProcedure.query(async () => {
    const subjects = await getSubjects();
    return { subjects };
  }),
  getQuestion: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input }) => {
      const { questionId } = input;
      const questionTemplate = await getQuestion(questionId);
      const subject = await getSubject();
      const learningObjectives = (subject.children ?? []).filter(
        (lo) => questionTemplate?.learningObjectives.includes(lo.id),
      );
      return { questionTemplate, learningObjectives };
    }),
  getQuestionFromGithub: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { questionId } = input;
      const { questionBank } = ctx;
      const { srcLocation } =
        await questionBank.getQuestionTemplate(questionId);
      const questionTemplate = await getQuestionFromGit({
        questionId: questionId,
        srcLocation: srcLocation,
        baseBranch: "main",
      });

      return { questionTemplate };
    }),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => {
      return createNewQuestionPr(input);
    }),
  getLearningObjective: publicProcedure
    .input(
      z.object({
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { learningObjectiveId } = input;
      const { questionBank } = ctx;
      const learningObjective =
        await questionBank.getLearningObjective(learningObjectiveId);
      const questionTemplates = await questionBank.getQuestionTemplates(
        learningObjective.questions,
      );
      return {
        learningObjective,
        questionTemplates,
      };
    }),
  searchQuestions: makeSearchHandler({
    searchFields: ["id", "questionId", "learningObjectives", "text"],
    getData: getQuestions,
    processData: (questions) => {
      return questions.flatMap((question) =>
        Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          learningObjectives: question.learningObjectives.join(", "),
          text: getQuestionPreview(question, variant.id),
        })),
      );
    },
    processResults: async (_, searchResults) => {
      const questionMap = await getQuestionsMap();
      const seenQuestions: Record<string, number> = {};
      return searchResults.reduce<SearchResponseItem<QuestionPreview>[]>(
        (sum, result) => {
          const questionId = result["questionId"];
          const variantId = result["id"];
          if (seenQuestions[questionId]) return sum;
          seenQuestions[questionId] = 1;
          const variants = questionMap[questionId]?.variants;
          sum.push({
            result: {
              questionId: result["questionId"],
              variantId: result["id"],
              text: result["text"],
              numberOfVariants: variants ? Object.values(variants).length : 1,
              learningObjectives: result["learningObjectives"].split(", "),
              href: `/modules/737-type-rating/questions/${questionId}?variantId=${variantId}`,
            },
            score: result.score,
            match: result.match,
            terms: result.terms,
          });
          return sum;
        },
        [],
      );
    },
  }),
  searchLearningObjectives: makeSearchHandler({
    searchFields: ["id", "questionId", "learningObjectives", "text"],
    getData: getLearningObjectives,
    processData: (questions) => {
      return questions.flatMap((question) =>
        Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          learningObjectives: question.learningObjectives.join(", "),
          text: getQuestionPreview(question, variant.id),
        })),
      );
    },
    processResults: async (_, searchResults) => {
      const questionMap = await getQuestionsMap();
      const seenQuestions: Record<string, number> = {};
      return searchResults.reduce<SearchResponseItem<QuestionPreview>[]>(
        (sum, result) => {
          const questionId = result["questionId"];
          const variantId = result["id"];
          if (seenQuestions[questionId]) return sum;
          seenQuestions[questionId] = 1;
          const variants = questionMap[questionId]?.variants;
          sum.push({
            result: {
              questionId: result["questionId"],
              variantId: result["id"],
              text: result["text"],
              numberOfVariants: variants ? Object.values(variants).length : 1,
              learningObjectives: result["learningObjectives"].split(", "),
              href: `/modules/737-type-rating/questions/${questionId}?variantId=${variantId}`,
            },
            score: result.score,
            match: result.match,
            terms: result.terms,
          });
          return sum;
        },
        [],
      );
    },
  }),
});

/**
  publicProcedure
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
*/
