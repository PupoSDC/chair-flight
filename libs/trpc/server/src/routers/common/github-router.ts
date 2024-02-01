import {
  createNewIssue,
  createNewQuestionPr,
  newQuestionPrSchema,
  newIssueSchema,
} from "@chair-flight/core/github";
import { publicProcedure, router } from "../../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => createNewIssue(input)),
  updateQuestion: publicProcedure
    .input(newQuestionPrSchema)
    .mutation(async ({ input }) => createNewQuestionPr(input)),
});
