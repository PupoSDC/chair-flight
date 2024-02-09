import { z } from "zod";
import { compileMdx } from "../../common/compile-mdx";
import { publicProcedure, router } from "../../config/trpc";

export const markdownRouter = router({
  getRenderedMarkdown: publicProcedure
    .input(z.object({ markdown: z.string() }))
    .query(async ({ input }) => {
      const markdownDocument = await compileMdx(input.markdown);
      return { markdownDocument };
    }),
});
