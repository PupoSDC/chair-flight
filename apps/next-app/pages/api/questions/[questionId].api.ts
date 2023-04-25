import { NotFoundError } from "@chair-flight/base/errors";
import { apiHandler } from "@chair-flight/next/server";
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

  if (!questionTemplate) throw new NotFoundError("Question not found");
  const learningObjectives = await questionBank.getLearningObjectives(
    questionTemplate.learningObjectives
  );
  return { questionTemplate, learningObjectives };
};

export default apiHandler(
  {
    get: ({ req, questionBank }) =>
      getQuestionTemplate(req.query["questionId"] as string, questionBank),
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
