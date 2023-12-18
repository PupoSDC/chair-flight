import { z } from "zod";
import {
  getSubject,
  getQuestionTemplate,
  getAllQuestionTemplateMap,
  getAllQuestionTemplates,
} from "@chair-flight/content/question-bank-a320";
import {
  createTest,
  getQuestionPreview,
  newTestConfigurationSchema,
} from "@chair-flight/core/app";
import { getQuestionFromGit } from "@chair-flight/core/github";
import { makeCountHandler } from "../common/count";
import { makeSearchHandler } from "../common/search";
import { publicProcedure, router } from "../config/trpc";
import type { SearchResponseItem } from "../common/search";
import type { LearningObjectiveWithHref } from "@chair-flight/base/types";

type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  numberOfVariants: number;
  learningObjectives: string[];
  href: string;
};

export const questionBankA320Router = router({
  getAllSubjects: publicProcedure.query(async () => {
    const subject = await getSubject();
    return { subjects: [subject] };
  }),
  getQuestion: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input }) => {
      const { questionId } = input;
      const questionTemplate = await getQuestionTemplate(questionId);
      const learningObjectives: LearningObjectiveWithHref[] = [];
      return { questionTemplate, learningObjectives };
    }),
  getQuestionFromGithub: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input }) => {
      const { questionId } = input;
      const { srcLocation } = await getQuestionTemplate(questionId);
      const questionTemplate = await getQuestionFromGit({
        questionId: questionId,
        srcLocation: srcLocation,
        baseBranch: "main",
      });

      return { questionTemplate };
    }),
  getNumberOfQuestions: makeCountHandler({
    getData: getAllQuestionTemplates,
  }),
  searchQuestions: makeSearchHandler({
    searchFields: ["id", "questionId", "learningObjectives", "text"],
    getData: getAllQuestionTemplates,
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
    processResults: async (searchResults) => {
      const seenQuestions: Record<string, number> = {};
      const questionMap = await getAllQuestionTemplateMap();
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
              href: `/modules/a320/questions/${questionId}?variantId=${variantId}`,
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
  createTest: publicProcedure
    .input(z.object({ config: newTestConfigurationSchema }))
    .mutation(async ({ input }) => {
      const { config } = input;
      const questions = await getAllQuestionTemplates();
      const test = await createTest({ config, questions });
      return { test };
    }),
});
