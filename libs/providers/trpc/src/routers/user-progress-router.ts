import { QuestionBank } from "@cf/providers/question-bank";
import { UserProgress } from "@cf/providers/user-progress";
import { publicProcedure, router } from "../config/trpc";

export const userProgressRouter = router({
  updateGlobalStatistics: publicProcedure.mutation(async () => {
    if (process.env["NODE_EMV"] !== "development") return;
    UserProgress.get().populateQuestionTemplates([
      ...(await QuestionBank.get("atpl").getAll("questions")),
      ...(await QuestionBank.get("prep").getAll("questions")),
      ...(await QuestionBank.get("type").getAll("questions")),
    ]);
  }),
});
