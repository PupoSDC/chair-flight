import { z } from "zod";
import { publicProcedure, router } from "../config/trpc";

export const questionReviewRouter = router({
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
});
