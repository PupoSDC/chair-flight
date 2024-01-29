import { z } from "zod";
import { getAnnexesSearchFilters } from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../../config/trpc";

export const annexesContainersRouter = router({
  getAnnexSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const filters = await getAnnexesSearchFilters(bank);
      return { filters };
    }),
});
