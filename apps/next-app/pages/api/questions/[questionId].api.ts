import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
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
  questionBank: QuestionBankRepository,
): Promise<GetQuestionTemplateResponse> => {
  const questionTemplate = await questionBank.getQuestionTemplate(questionId);
  const learningObjectives = await questionBank.getLearningObjectives(
    questionTemplate.learningObjectives,
  );
  return { questionTemplate, learningObjectives };
};

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
        throw new Error("Not implemented");
        //return await createNewQuestionPr(req.body.question);
      }
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
