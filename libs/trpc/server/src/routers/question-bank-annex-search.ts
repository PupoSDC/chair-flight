import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";

type SearchField =  "description";

export const questionBankAnnexSearchRouter = router({
  getSearchConfigFilters: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];

      const rawSubjects = await qb.getAll("subjects");
      const subjects = rawSubjects.map((s) => ({
        id: s.id,
        text: `${s.id} - ${s.shortName}`
      }))
      subjects.unshift({ id: "all", text: "All Subjects" });


      return { subjects };
    }),
  searchAnnexes: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { questionBank, subject, limit, cursor } =
        input;
      const qb = questionBanks[questionBank];
      const annexes = await qb.getAll("annexes");

      const processedResults = annexes.filter((r) => {
        if (!r) return false;
        if (subject !== "all" && !r.subjects.includes(subject)) return false;
        return true;
      });

      const finalItems = processedResults
        .slice(cursor, cursor + limit)
        .map((annex) => ({
          ...annex,
          questions: annex.questions.map((id) => ({
            id,
            href: `/modules/${questionBank}/questions/${id}`,
          })),
          learningObjectives: annex.learningObjectives.map((id) => ({
            id,
            href: `/modules/${questionBank}/learning-objectives/${id}`,
          })),
        }));

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
});
