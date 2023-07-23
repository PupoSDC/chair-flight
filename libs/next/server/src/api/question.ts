import { LearningObjective, QuestionBankRepository, QuestionTemplate, QuestionTemplateId } from "@chair-flight/base/types";
import { useQuery } from '@tanstack/react-query';

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

export const getQuestionTemplateFromApi = async (
    questionId: QuestionTemplateId,
): Promise<GetQuestionTemplateResponse> => {
    const response = await fetch(`/api/questions/${questionId}`);
    const json = await response.json();
    return json as GetQuestionTemplateResponse;
};

export const useGetQuestionTemplate = (
    questionId: QuestionTemplateId,
) => useQuery({
    queryKey: ['questionTemplate', questionId],
    queryFn: () => getQuestionTemplateFromApi(questionId),
});