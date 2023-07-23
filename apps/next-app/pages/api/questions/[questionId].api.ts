import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { createNewQuestionPr } from "@chair-flight/core/app";
import { apiHandler, getQuestionTemplate } from "@chair-flight/next/server";
import { questionSchema } from "@chair-flight/question-bank/schemas";
import type {
  LearningObjective,
  QuestionTemplate,
  QuestionTemplateId,
  QuestionBankRepository,
} from "@chair-flight/base/types";

export const updateQuestionTemplateLocally = async (
  question: QuestionTemplate,
  questionBank: QuestionBankRepository,
) => {
  const allQuestions = await questionBank.getAllQuestionTemplates();
  const newQuestions = allQuestions.map((q) => {
    if (q.id === question.id) {
      return question;
    }
    return q;
  });
  await questionBank.writeQuestions(newQuestions);
  return { url: "" };
};

export const putBodySchema = z.object({
  question: questionSchema,
});

export type PutBodySchema = z.infer<typeof putBodySchema>;

export type PutResponseSchema = {
  url: string;
};

export default apiHandler(
  {
    get: ({ req, questionBank }) => {
      const questionId = req.query["questionId"] as string;
      return getQuestionTemplate(questionId, questionBank);
    },
    put: async ({ req, questionBank }): Promise<PutResponseSchema> => {
      const provider = getEnvVariableOrThrow("QUESTION_BANK_PROVIDER");
      const isLocal = provider === "local";
      const { question } = putBodySchema.parse(req.body);
      if (isLocal) {
        return await updateQuestionTemplateLocally(question, questionBank);
      } else {
        return await createNewQuestionPr(req.body.question);
      }
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
