import { z } from "zod";
import {
  getAllLearningObjectives,
  getQuestionTemplate,
  getAllQuestionTemplates,
  getAllQuestionTemplateMap,
  getAllLearningObjectivesMap,
  getLearningObjective,
  getSomeQuestionTemplates,
  getAllSubjects,
} from "@chair-flight/content/question-bank-atpl";
import {
  createTest,
  getQuestionPreview,
  newTestConfigurationSchema,
} from "@chair-flight/core/app";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/core/github";
import { questionEditSchema } from "@chair-flight/core/schemas";
import { makeCountHandler } from "../common/count";
import { makeSearchHandler } from "../common/search";
import { publicProcedure, router } from "../config/trpc";
import type { SearchResponseItem } from "../common/search";
import type {
  LearningObjective,
  LearningObjectiveWithHref,
} from "@chair-flight/base/types";

type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  numberOfVariants: number;
  learningObjectives: string[];
  externalIds: string[];
  href: string;
};

export const questionBankAtplRouter = router({
  getQuestion: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input }) => {
      const { questionId } = input;
      const questionTemplate = await getQuestionTemplate(questionId);
      const allLearningObjectives = await getAllLearningObjectives();
      const learningObjectives = allLearningObjectives
        .filter((lo) => questionTemplate?.learningObjectives.includes(lo.id))
        .map<LearningObjectiveWithHref>((lo) => ({
          ...lo,
          href: `/modules/atpl/learning-objectives/${lo.id}`,
        }));
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
    .query(async ({ input }) => {
      const { learningObjectiveId } = input;
      const learningObjective = await getLearningObjective(learningObjectiveId);
      const questionIds = learningObjective.questions;
      const questionTemplates = await getSomeQuestionTemplates(questionIds);
      return { learningObjective, questionTemplates };
    }),
  getAllSubjects: publicProcedure.query(async () => {
    const allSubjects = await getAllSubjects();
    const subjects = allSubjects.filter(
      (lo) => !["034", "082"].includes(lo.id),
    );
    return { subjects };
  }),
  createTest: publicProcedure
    .input(z.object({ config: newTestConfigurationSchema }))
    .mutation(async ({ input }) => {
      const { config } = input;
      const questions = await getAllQuestionTemplates();
      const test = await createTest({ config, questions });
      return { test };
    }),
  searchQuestions: makeSearchHandler({
    searchFields: [
      "id",
      "questionId",
      "learningObjectives",
      "text",
      "externalIds",
    ],
    getData: getAllQuestionTemplates,
    processData: (questions) => {
      return questions.flatMap((question) =>
        Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          learningObjectives: question.learningObjectives.join(", "),
          externalIds: variant.externalIds.join(", "),
          text: getQuestionPreview(question, variant.id),
        })),
      );
    },
    processResults: async (searchResults) => {
      const questionMap = await getAllQuestionTemplateMap();
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
              externalIds: result["externalIds"].split(", "),
              href: `/modules/atpl/questions/${questionId}?variantId=${variantId}`,
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
    searchFields: ["id", "text"],
    getData: getAllLearningObjectives,
    processData: (data) => {
      return data.map(({ questions, ...lo }) => ({
        ...lo,
        courses: lo.courses.join(", "),
      }));
    },
    preprocessResults: async (data, q) => {
      const MATCH_LO_ID = /^[0-9]{3}(.[0-9]{2}){0,3}$/;
      if (!q) {
        return data.map((result) => ({
          result,
          score: 1,
          match: {},
          terms: [],
        }));
      }
      if (MATCH_LO_ID.test(q)) {
        return data
          .filter((doc) => doc.id.startsWith(q))
          .map((result) => ({
            result,
            score: 1,
            match: {},
            terms: [],
          }));
      }
      return undefined;
    },
    processResults: async (searchResults) => {
      const learningObjectivesMap = await getAllLearningObjectivesMap();
      return searchResults.map<SearchResponseItem<LearningObjective>>(
        (result) => ({
          result: learningObjectivesMap[result.id] as LearningObjective,
          score: result.score,
          match: result.match,
          terms: result.terms,
        }),
      );
    },
  }),
  getNumberOfLearningObjectives: makeCountHandler({
    getData: getAllLearningObjectives,
  }),
});
