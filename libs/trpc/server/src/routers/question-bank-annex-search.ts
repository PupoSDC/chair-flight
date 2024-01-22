
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";

export const questionBankAnnexSearchRouter = router({
  searchAnnexes: publicProcedure
    .input(
      z.object({
        questionBank,
        subject: z.string().nullable(),
        learningObjectives: z.string().nullable(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { questionBank, subject, learningObjectives, limit, cursor } = input;
      const qb = questionBanks[questionBank];
      const annexes = await qb.getAll("annexes");
      const folder = `/content/content-question-bank-${questionBank}/annexes`;

      const processedResults = annexes.filter((r) => {
        if (!r) return false;
        if (subject && !r.subjects.includes(subject)) return false;
        if (learningObjectives) {
          const includesLo = r.learningObjectives
            .join(", ")
            .includes(learningObjectives);
          if (!includesLo) return false;
        }
        return true;
      });

      const finalItems = processedResults
        .slice(cursor, cursor + limit)
        .map((annex) => ({
          ...annex,
          src: `${folder}/${annex.id}.jpg`,
          questions: annex.questions.map((id) => ({
            id,
            href: `/modules/${questionBank}/questions/${id}`
          })),
          learningObjectives: annex.learningObjectives.map((id) => ({
            id,
            href: `/modules/${questionBank}/learning-objectives/${id}`
          }))
        }))

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
});
