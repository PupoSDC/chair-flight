import { questionBanks, userProgress } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const userProgressRouter = router({
  updateGlobalStatistics: publicProcedure.mutation(async () => {
    if (process.env["NODE_EMV"] !== "development") return;
    userProgress.populateQuestionTemplates([
      ...(await questionBanks.atpl.getAll("questions")),
      ...(await questionBanks.prep.getAll("questions")),
      ...(await questionBanks.type.getAll("questions")),
    ]);
  }),
});
