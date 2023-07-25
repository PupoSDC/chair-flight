import type { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { questionSchema } from "@chair-flight/question-bank/schemas";
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
      if (!questionTemplate) {
        const error: TRPCError = {
          name: "TRPCError",
          code: "NOT_FOUND",
          message: '"password" must be at least 4 characters',
        };
        throw error;
      }
      const learningObjectives = await questionBank.getLearningObjectives(
        questionTemplate.learningObjectives,
      );
      return { questionTemplate, learningObjectives };
    }),
  updateQuestion: publicProcedure
    .input(
      z.object({
        question: questionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { question } = input;
      const { questionBank } = ctx;
      const provider = getEnvVariableOrThrow("QUESTION_BANK_PROVIDER");
      const isLocal = provider === "local";
      return { url: "" };
    }),
});
