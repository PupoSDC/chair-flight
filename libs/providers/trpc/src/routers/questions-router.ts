import { z } from "zod";
import { questionBankNameSchema } from "@cf/core/question-bank";
import { QuestionBank } from "@cf/providers/question-bank";
import { publicProcedure, router } from "../config/trpc";

export const questionsRouter = router({
  getQuestionTemplate: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const qb = await QuestionBank.get(input.questionBank);
      const question = await qb.getOne("questions", input.questionId);
      const related = await qb.getSome("questions", question.relatedQuestions);
      return { question, relatedQuestions: related };
    }),
});
