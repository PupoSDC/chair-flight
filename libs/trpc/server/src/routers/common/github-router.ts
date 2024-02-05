import { newIssueSchema, questionEditSchema } from "@chair-flight/core/github";
import { github } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => github.createNewIssue(input)),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => github.createNewQuestionPr(input)),
});
