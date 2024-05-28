import { z } from "zod";
import { QuestionBankSearchParamsSchema } from "@cf/core/content";
import { compileMarkdown } from "@cf/core/markdown";
import { QuestionBankSearch } from "@cf/providers/content";
import { publicProcedure, router } from "../config/trpc";

export const questionBankSearchRouter = router({
  getAutocompleteSuggestions: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const qbSearch = new QuestionBankSearch();
      const rawResults = await qbSearch.searchForAutocomplete(input.query);
      const results = rawResults.map((result) => ({
        ...result,
        text: compileMarkdown(result.text.slice(0, 200)),
        href: `/content/${result.resource}/${result.id}`,
      }));
      return { results };
    }),

  search: publicProcedure
    .input(QuestionBankSearchParamsSchema)
    .query(async ({ input }) => {
      const qbSearch = new QuestionBankSearch();
      const results = await qbSearch.searchForAutocomplete(input.q);
      return { results };
    }),
});
