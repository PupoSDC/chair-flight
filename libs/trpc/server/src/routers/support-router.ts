import { newIssueSchema } from "@cf/core/content";
import { Github } from "@cf/providers/content";
import { publicProcedure, router } from "../config/trpc";

export const supportRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(async ({ input }) => {
      const github = new Github();
      return github.createNewIssue(input);
    }),
});
