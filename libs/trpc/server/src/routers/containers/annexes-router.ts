import { z } from "zod";
import {
  questionBanks,
  questionBankNameSchema,
} from "@chair-flight/core/question-bank";
import { getAnnexesSearchFilters } from "@chair-flight/core/search";
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
