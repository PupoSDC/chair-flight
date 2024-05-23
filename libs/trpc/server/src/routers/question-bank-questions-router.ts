import { z } from "zod";
import { getQuestionPreview } from "@cf/core/content";
import { compileMarkdown } from "@cf/core/markdown";
import { createTestQuestion } from "@cf/core/progress";
import { QuestionBank } from "@cf/providers/content";
import { publicProcedure, router } from "../config/trpc";

export const questionBankQuestionsRouter = router({
  getStandalone: publicProcedure
    .input(z.object({ id: z.string(), seed: z.string().default("default") }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const rawAnnexes = await qb.getSome("annexes", template.annexes);
      const rawQuestion = createTestQuestion(template, { seed: input.seed });
      const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));
      const { explanation, ...question } = rawQuestion;
      return { question, annexes };
    }),
  getExplanation: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      if (!template.explanation) return { explanation: null };
      const explanation = compileMarkdown(template.explanation);
      return { explanation };
    }),
  getPreview: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const rawPreview = getQuestionPreview(template.variant);
      const preview = compileMarkdown(rawPreview);
      return { preview };
    }),
});
