import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { questionSchema } from "@chair-flight/core/schemas";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/providers/github";
import { publicProcedure, router } from "../config/trpc";

export const questionsRouter = router({
  getNumberOfQuestions: publicProcedure.query(async ({ ctx }) => {
    const { questionBank } = ctx;
    const numberOfQuestions = (await questionBank.getAllQuestionTemplates())
      .length;
    return { numberOfQuestions };
  }),
  getQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { questionId } = input;
      const { questionBank } = ctx;
      const questionTemplate = await questionBank.getQuestionTemplate(
        questionId,
      );
      const learningObjectives = await questionBank.getLearningObjectives(
        questionTemplate.learningObjectives,
      );
      return { questionTemplate, learningObjectives };
    }),
  getQuestionFromGithub: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { questionId } = input;
      const { questionBank } = ctx;
      const { srcLocation } = await questionBank.getQuestionTemplate(
        questionId,
      );
      const questionTemplate = await getQuestionFromGit({
        questionId: questionId,
        srcLocation: srcLocation,
        baseBranch: "main",
      });

      return { questionTemplate };
    }),
  updateQuestion: publicProcedure
    .input(
      z.object({
        question: questionSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { question } = input;
      createNewQuestionPr(question);
    }),
});
