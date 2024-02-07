import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const questionsRouter = router({
  getQuestionTemplate: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const question = await qb.getOne("questions", input.questionId);
      const related = await qb.getSome("questions", question.relatedQuestions);
      return { question, relatedQuestions: related };
    }),
});
