import { createNewIssue, newIssueSchema } from "@chair-flight/core/github";
import { publicProcedure, router } from "../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => createNewIssue(input)),
});
