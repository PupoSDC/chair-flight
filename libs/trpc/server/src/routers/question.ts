import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { questionSchema } from "@chair-flight/question-bank/schemas";
import { publicProcedure, router } from "../config/trpc";
import { createNewQuestionPr } from "./questions-create-new-question-pr";

export const questionsRouter = router({
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
      if (isLocal) {
        const allQuestions = await questionBank.getAllQuestionTemplates();
        const newQuestions = allQuestions.map((q) => {
          if (q.id === question.id) {
            return question;
          }
          return q;
        });
        await questionBank.writeQuestions(newQuestions);
        return { url: "" };
      } else {
        return createNewQuestionPr(question);
      }
    }),
});
