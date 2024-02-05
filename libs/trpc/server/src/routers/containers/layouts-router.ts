import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const layoutsContainersRouter = router({
  getLayoutModule: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const questionBank = input.questionBank;
      const bank = questionBanks[questionBank];

      const routes = {
        home: {
          href: `/modules/${questionBank}`,
          isVisible: true,
        },
        questions: {
          href: `/modules/${questionBank}/questions`,
          isVisible: await bank.has("questions"),
        },
        learningObjectives: {
          href: `/modules/${questionBank}/learning-objectives`,
          isVisible: await bank.has("learningObjectives"),
        },
        annexes: {
          href: `/modules/${questionBank}/annexes`,
          isVisible: await bank.has("annexes"),
        },
        tests: {
          href: `/modules/${questionBank}/tests`,
          isVisible: await bank.has("questions"),
        },
        docs: {
          href: `/modules/${questionBank}/docs`,
          isVisible: false, //await bank.has("docs"),
        },
        flashcards: {
          href: `/modules/${questionBank}/flashcards`,
          isVisible: await bank.has("flashcards"),
        },
      };

      return { routes, questionBank };
    }),
  getLayoutPublic: publicProcedure.input(z.object({})).query(async () => ({})),
});
