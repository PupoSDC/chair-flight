import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import { UnimplementedError } from "@chair-flight/base/errors";
import {
  createTest,
  getQuestionPreview,
  newTestConfigurationSchema,
} from "@chair-flight/core/app";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/core/github";
import { questionBanks } from "@chair-flight/core/question-bank";
import {
  questionBankNameSchema as questionBank,
  questionEditSchema,
} from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  QuestionBankLearningObjective,
  QuestionBankName,
} from "@chair-flight/base/types";
import type { MatchInfo } from "minisearch";

const questionSearchFields = [
  "id",
  "questionId",
  "learningObjectives",
  "text",
  "externalIds",
];

const questionSearchIndexes: Record<QuestionBankName, MiniSearch> = {
  b737: new MiniSearch({
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
  prep: new MiniSearch({
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
  getConfig: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      return {
        hasFlashcards: await qb.has("flashcards"),
        hasQuestions: await qb.has("questions"),
        hasLearningObjectives: await qb.has("learningObjectives"),
        hasMedia: await qb.has("media"),
      };
    }),
  getAllSubjects: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const subjects = await qb.getAll("subjects");
      return { subjects };
    }),
  getQuestion: publicProcedure
    .input(z.object({ questionBank, questionId: z.string() }))
    .query(async ({ input }) => {
      const id = input.questionId;
      const qb = questionBanks[input.questionBank];
      const questionTemplate = await qb.getOne("questions", id);
      const loIds = questionTemplate.learningObjectives;
      const learningObjectives = await qb.getSome("learningObjectives", loIds);
      return { questionTemplate, learningObjectives };
    }),
  getQuestionFromGithub: publicProcedure
    .input(z.object({ questionBank, questionId: z.string() }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const question = await qb.getOne("questions", input.questionId);
      const questionTemplate = await getQuestionFromGit({
        questionId: question.id,
        srcLocation: question.srcLocation,
      });
      return { questionTemplate };
    }),
  getLearningObjective: publicProcedure
    .input(z.object({ questionBank, learningObjectiveId: z.string() }))
    .query(async ({ input }) => {
      const loId = input.learningObjectiveId;
      const qb = questionBanks[input.questionBank];
      const learningObjective = await qb.getOne("learningObjectives", loId);
      return { learningObjective };
    }),
  getFlashcardsCollections: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const rawCollections = await qb.getAll("flashcards");
      const flashcardCollections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        numberOfFlashcards: collection.flashcards.length,
      }));
      return { flashcardCollections };
    }),
  getFlashcardsCollection: publicProcedure
    .input(z.object({ questionBank, collectionId: z.string() }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const id = input.collectionId;
      const flashcardCollection = await qb.getOne("flashcards", id);
      return { flashcardCollection };
    }),
  getNumberOfQuestions: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const allQuestions = await qb.getAll("questions");
      return { count: allQuestions.length };
    }),
  getNumberOfLearningObjectives: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const allLearningObjectives = await qb.getAll("learningObjectives");
      return { count: allLearningObjectives.length };
    }),
  getNumberOfAnnexes: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const allAnnexes = await qb.getAll("media");
      return { count: allAnnexes.length };
    }),
  getNumberOfFlashcards: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const allFlashcards = await qb.getAll("flashcards");
      const count = allFlashcards.reduce((s, e) => s + e.flashcards.length, 0);
      return { count };
    }),
  searchQuestions: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string().optional(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      if (initializationWork) await initializationWork;
      const questionBankName = input.questionBank;
      const qb = questionBanks[input.questionBank];
      const searchIndex = questionSearchIndexes[input.questionBank];
      const questions = await qb.getAll("questions");
      const questionMap = await qb.getAll("questions");
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
        questionBank,
        q: z.string().optional(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      if (input.questionBank !== "atpl") throw new UnimplementedError("");
      const qb = questionBanks[input.questionBank];
      const searchIndex = learningObjectiveSearchIndexes[input.questionBank];
      const los = await qb.getAll("learningObjectives");
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

      let results: SearchResponseItem<QuestionBankLearningObjective>[] = [];
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
          result: result as unknown as QuestionBankLearningObjective,
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
    .input(z.object({ questionBank, config: newTestConfigurationSchema }))
    .mutation(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const questions = await qb.getAll("questions");
      const test = await createTest({ ...input, questions });
      return { test };
    }),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => {
      return createNewQuestionPr(input);
    }),
});
