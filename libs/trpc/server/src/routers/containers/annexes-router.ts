import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { AnnexSearch } from "@chair-flight/providers/search";
import { questionBanks } from "../../common/providers";
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
      const annexSearch = new AnnexSearch(bank);
      const filters = await annexSearch.getFilters();
      return { filters };
    }),
});
