import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import { getQuestionsSearchFilters } from "@chair-flight/core/app";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { questionBanks } from "@chair-flight/providers/question-bank";
import { publicProcedure, router } from "../../config/trpc";

export const questionsContainersRouter = router({
  getQuestionOverview: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        questionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const id = input.questionId;
      const questionBank = input.questionBank;
      const qb = questionBanks[input.questionBank];
      const template = await qb.getOne("questions", id);
      const loIds = template.learningObjectives;
      const annexIds = Object.values(template.variants).flatMap(
        (v) => v.annexes,
      );
      const rawAnnexes = await qb.getSome("annexes", annexIds);
      const rawLos = await qb.getSome("learningObjectives", loIds);

      const annexes = makeMap(
        rawAnnexes,
        (a) => a.id,
        (a) => ({
          id: a.id,
          href: a.href,
        }),
      );

      const learningObjectives = rawLos.map((lo) => ({
        id: lo.id,
        text: lo.text,
        href: `/modules/${questionBank}/learning-objectives/${lo.id}`,
      }));

      return { template, annexes, learningObjectives };
    }),
  getQuestionSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const filters = await getQuestionsSearchFilters(bank);
      return { filters };
    }),
});
