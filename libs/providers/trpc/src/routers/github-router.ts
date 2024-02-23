import { newIssueSchema, editQuestionsPrSchema } from "@cf/core/github";
import { Github } from "@cf/providers/github";
import { publicProcedure, router } from "../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => Github.get().createNewIssue(input)),
  createEditQuestionsPr: publicProcedure
    .input(editQuestionsPrSchema)
    .mutation(({ input }) => Github.get().createEditQuestionsPr(input)),
});
