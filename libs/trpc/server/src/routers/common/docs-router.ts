import { z } from "zod";
import { questionBankNameSchema } from "@cf/core/question-bank";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const docsRouter = router({
  getDoc: publicProcedure
    .input(
      z.object({
        docId: z.string(),
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const doc = await qb.getOne("docs", input.docId);
      return { doc };
    }),
});
