import { z } from "zod";
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

export const questionBankRouter = router({
  getConfig: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      return {
        hasFlashcards: await qb.has("flashcards"),
        hasQuestions: await qb.has("questions"),
        hasCourses: await qb.has("courses"),
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
      const collections = rawCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        numberOfFlashcards: collection.flashcards.length,
      }));
      return { collections };
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
  getAllCourses: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const courses = await qb.getAll("courses");
      return { courses };
    }),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => {
      return createNewQuestionPr(input);
    }),
});
