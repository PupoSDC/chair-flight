import { z } from "zod";
import { createTest, newTestConfigurationSchema } from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";

export const testsRouter = router({
  createTest: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        config: newTestConfigurationSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const questions = await qb.getAll("questions");
      const test = await createTest({ ...input, questions });
      return { test };
    }),
});
