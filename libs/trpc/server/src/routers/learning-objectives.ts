import { z } from "zod";
import { publicProcedure, router } from "../config/trpc";

export const learningObjectivesRouter = router({
  getLearningObjective: publicProcedure
    .input(
      z.object({
        learningObjectiveId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { learningObjectiveId } = input;
      const { questionBank } = ctx;
      const learningObjective = await questionBank.getLearningObjective(
        learningObjectiveId,
      );
      const questionTemplates = await questionBank.getQuestionTemplates(
        learningObjective.questions,
      );
      return {
        learningObjective,
        questionTemplates,
      };
    }),
});
