import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import { UnimplementedError } from "@chair-flight/base/errors";
import { QuestionBank737 } from "@chair-flight/content/question-bank-737";
import { QuestionBankA320 } from "@chair-flight/content/question-bank-a320";
import { QuestionBankAtpl } from "@chair-flight/content/question-bank-atpl";
import {
  createTest,
  getQuestionPreview,
  newTestConfigurationSchema,
} from "@chair-flight/core/app";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/core/github";
import {
  questionBankNameSchema,
  questionEditSchema,
} from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  LearningObjectiveWithHref,
  QuestionBank,
  QuestionBankName,
} from "@chair-flight/base/types";
import type { MatchInfo } from "minisearch";

const keyToQuestionBank: Record<QuestionBankName, QuestionBank> = {
  "737": new QuestionBank737(),
  a320: new QuestionBankA320(),
  atpl: new QuestionBankAtpl(),
};

const questionSearchFields = [
  "id",
  "questionId",
  "learningObjectives",
  "text",
  "externalIds",
];

const questionSearchIndexes: Record<QuestionBankName, MiniSearch> = {
  "737": new MiniSearch({
    fields: questionSearchFields,
    storeFields: questionSearchFields,
  }),
  a320: new MiniSearch({
    fields: questionSearchFields,
    storeFields: questionSearchFields,
  }),
  atpl: new MiniSearch({
    fields: questionSearchFields,
    storeFields: questionSearchFields,
  }),
};

const learningObjectiveSearchFields = ["id", "text"];

const learningObjectiveSearchIndexes: Record<"atpl", MiniSearch> = {
  atpl: new MiniSearch({
    fields: learningObjectiveSearchFields,
    storeFields: learningObjectiveSearchFields,
  }),
};

const getQuestionBank = (input: { questionBank: QuestionBankName }) => {
  return keyToQuestionBank[input.questionBank];
};

// Marks that a request is already indexing a Minisearch to avoid saturating
// the server.
let initializationWork: Promise<void> | undefined;

export type SearchResponseItem<T> = {
  result: T;
  score: number;
  match: MatchInfo;
  terms: string[];
};

export type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  numberOfVariants: number;
  learningObjectives: string[];
  externalIds: string[];
  href: string;
};

export const questionBankRouter = router({
  getAllSubjects: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const subjects = await questionBank.getAllSubjects();
      return { subjects };
    }),
  getQuestion: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const [questionTemplate, learningObjectives] = await Promise.all([
        questionBank.getQuestionTemplate(input),
        questionBank.getSomeLearningObjectives(input),
      ]);
      return { questionTemplate, learningObjectives };
    }),
  getQuestionFromGithub: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const question = await questionBank.getQuestionTemplate(input);
      const questionTemplate = await getQuestionFromGit({
        questionId: question.id,
        srcLocation: question.srcLocation,
      });
      return { questionTemplate };
    }),
  getLearningObjective: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const learningObjective = await questionBank.getLearningObjective(input);
      return { learningObjective };
    }),
  getNumberOfQuestions: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const allQuestions = await questionBank.getAllQuestionTemplates();
      return { count: allQuestions.length };
    }),
  getNumberOfLearningObjectives: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const allLearningObjectives =
        await questionBank.getAllLearningObjectives();
      return { count: allLearningObjectives.length };
    }),
  getNumberOfAnnexes: publicProcedure
   .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      //const allAnnexes = await questionBank.getAllAnnexes();
      return { count: 0 };
    }),
  searchQuestions: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        q: z.string().optional(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      if (initializationWork) await initializationWork;
      const questionBankName = input.questionBank;
      const questionBank = getQuestionBank(input);
      const searchIndex = questionSearchIndexes[input.questionBank];
      const questions = await questionBank.getAllQuestionTemplates();
      const questionMap = await questionBank.getAllQuestionTemplates();
      const { q, limit, cursor = 0 } = input;

      if (searchIndex.documentCount === 0) {
        initializationWork = (async () => {
          const processedData = questions.flatMap((question) =>
            Object.values(question.variants).map((variant) => ({
              id: variant.id,
              questionId: question.id,
              learningObjectives: question.learningObjectives.join(", "),
              externalIds: variant.externalIds.join(", "),
              text: getQuestionPreview(question, variant.id),
            })),
          );
          await searchIndex.addAllAsync(processedData);
        })();
        await initializationWork;
      }

      const results = q ? searchIndex.search(q, { fuzzy: 0.2 }) : [];
      const seenQuestions: Record<string, number> = {};
      const processedResults = results.reduce<
        SearchResponseItem<QuestionPreview>[]
      >((sum, result) => {
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
            href: `/modules/${questionBankName}/questions/${questionId}?variantId=${variantId}`,
          },
          score: result.score,
          match: result.match,
          terms: result.terms,
        });
        return sum;
      }, []);

      const items = processedResults.slice(cursor, cursor + limit);

      return {
        items,
        totalResults: processedResults.length,
        nextCursor: cursor + items.length,
      };
    }),
  searchLearningObjectives: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        q: z.string().optional(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      if (input.questionBank !== "atpl") throw new UnimplementedError("");
      const questionBank = getQuestionBank(input);
      const searchIndex = learningObjectiveSearchIndexes[input.questionBank];
      const los = await questionBank.getAllLearningObjectives();
      const { q, limit, cursor = 0 } = input;

      if (searchIndex.documentCount === 0) {
        initializationWork = (async () => {
          const processedData = los.map(({ questions, ...lo }) => ({
            ...lo,
            courses: lo.courses.join(", "),
          }));
          await searchIndex.addAllAsync(processedData);
        })();
        await initializationWork;
      }

      const MATCH_LO_ID = /^[0-9]{3}(.[0-9]{2}){0,3}$/;

      let results: SearchResponseItem<LearningObjectiveWithHref>[] = [];
      if (!q) {
        results = los.map((result) => ({
          result,
          score: 1,
          match: {},
          terms: [],
        }));
      } else if (MATCH_LO_ID.test(q)) {
        results = los
          .filter((doc) => doc.id.startsWith(q))
          .map((result) => ({
            result,
            score: 1,
            match: {},
            terms: [],
          }));
      } else {
        results = searchIndex.search(q, { fuzzy: 0.2 }).map((result) => ({
          result: result as unknown as LearningObjectiveWithHref,
          score: result.score,
          match: result.match,
          terms: result.terms,
        }));
      }

      const items = results.slice(cursor, cursor + limit);

      return {
        items,
        totalResults: results.length,
        nextCursor: cursor + items.length,
      };
    }),
  createTest: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        config: newTestConfigurationSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const questionBank = getQuestionBank(input);
      const questions = await questionBank.getAllQuestionTemplates();
      const test = await createTest({ ...input, questions });
      return { test };
    }),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => {
      return createNewQuestionPr(input);
    }),
});
