import {
  newIssueSchema,
  editQuestionsPrSchema,
} from "@chair-flight/core/github";
import { github } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const githubRouter = router({
  createIssue: publicProcedure
    .input(newIssueSchema)
    .mutation(({ input }) => github.createNewIssue(input)),
  createEditQuestionsPr: publicProcedure
    .input(editQuestionsPrSchema)
    .mutation(async ({ input }) => github.createEditQuestionsPr(input)),
});
