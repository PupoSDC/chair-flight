import { z } from "zod";
import { makeMap } from "@cf/base/utils";
import { questionBankNameSchema } from "@cf/core/question-bank";
import { createTest, newTestConfigurationSchema } from "@cf/core/tests";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

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
      const rawTest = await createTest({ ...input, questions });
      const annexIds = rawTest.questions.flatMap((q) => q.annexes);
      const annexes = await qb.getSome("annexes", annexIds);
      const annexesMap = makeMap(annexes, (a) => a.id);
      const test = {
        ...rawTest,
        href: `/modules/${input.questionBank}/tests/${rawTest.id}/${input.config.mode}`,
        questions: rawTest.questions.map((q) => ({
          ...q,
          annexes: q.annexes.map((a) => annexesMap[a].href),
        })),
      };

      return { test };
    }),
});
