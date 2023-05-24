import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import {
  NotFoundError,
  UnimplementedEndpointError,
} from "@chair-flight/base/errors";
import type { QuestionTemplate } from "@chair-flight/base/types";
import { apiHandler } from "@chair-flight/next/server";

export type MergeQuestionsPostBody = {
  sourceQuestionId: string;
  destinationQuestionId: string;
};

export const mergeQuestionsPostBodySchema = z.object({
  sourceQuestionId: z.string(),
  destinationQuestionId: z.string(),
});

export default apiHandler(
  {
    post: async ({ req, questionBank }): Promise<void> => {
      const provider = getEnvVariableOrThrow("QUESTION_BANK_PROVIDER");
      const isLocal = provider === "local";
      if (!isLocal) throw new UnimplementedEndpointError();

      const { sourceQuestionId, destinationQuestionId } =
        mergeQuestionsPostBodySchema.parse(req.body);

      const allQuestions = await questionBank.getAllQuestionTemplates();
      const sourceQuestion = allQuestions.find(
        (q) => q.id === sourceQuestionId
      );
      const destinationQuestion = allQuestions.find(
        (q) => q.id === destinationQuestionId
      );

      if (!sourceQuestion || !destinationQuestion) {
        throw new NotFoundError("Unable to merge");
      }

      const newQuestions = allQuestions
        .map<QuestionTemplate | null>((q) => {
          if (q.id === sourceQuestionId) {
            return null;
          }
          if (q.id === destinationQuestionId) {
            return {
              ...destinationQuestion,
              variants: {
                ...destinationQuestion.variants,
                ...sourceQuestion.variants,
              },
            };
          }
          return q;
        })
        .filter((q): q is QuestionTemplate => !!q);

      await questionBank.writeQuestions(newQuestions);
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
