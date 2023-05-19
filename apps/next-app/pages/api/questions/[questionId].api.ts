import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { UnimplementedError } from "@chair-flight/base/errors";
import { apiHandler } from "@chair-flight/next/server";
import { questionSchema } from "@chair-flight/question-bank/schemas";
import type {
  LearningObjective,
  QuestionTemplate,
  QuestionTemplateId,
  QuestionBankRepository,
} from "@chair-flight/base/types";

export type GetQuestionTemplateResponse = {
  questionTemplate: QuestionTemplate;
  learningObjectives: LearningObjective[];
};

export const getQuestionTemplate = async (
  questionId: QuestionTemplateId,
  questionBank: QuestionBankRepository
): Promise<GetQuestionTemplateResponse> => {
  const questionTemplate = await questionBank.getQuestionTemplate(questionId);
  const learningObjectives = await questionBank.getLearningObjectives(
    questionTemplate.learningObjectives
  );
  return { questionTemplate, learningObjectives };
};

export const putBodySchema = z.object({
  question: questionSchema,
});

export type PutBodySchema = z.infer<typeof putBodySchema>;

export default apiHandler(
  {
    get: ({ req, questionBank }) => {
      const questionId = req.query["questionId"] as string;
      return getQuestionTemplate(questionId, questionBank);
    },
    put: async ({ req, questionBank }) => {
      const isLocal = getEnvVariableOrThrow("QUESTION_BANK_PROVIDER");
      if (!isLocal) {
        throw new UnimplementedError(
          "Cannot edit questions outside local mode"
        );
      }
      const { question } = putBodySchema.parse(req.body);
      const allQuestions = await questionBank.getAllQuestionTemplates();
      const newQuestions = allQuestions.map((q) => {
        if (q.id === question.id) {
          return question;
        }
        return q;
      });
      await questionBank.writeQuestions(newQuestions);
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
