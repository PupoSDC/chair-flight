import {
  createNewIssue,
  createNewQuestionPr,
  newIssueSchema,
} from "@chair-flight/core/github";
import { questionEditSchema } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => createNewIssue(input)),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => createNewQuestionPr(input)),
});
