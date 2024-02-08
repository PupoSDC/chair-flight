import type { LearningObjectiveId } from "../entities/ids";

export const getNumberOfAvailableQuestions = (
  subject: {
    learningObjectives: Array<{
      id: LearningObjectiveId;
      numberOfQuestions: number;
      learningObjectives: Array<{
        id: LearningObjectiveId;
        numberOfQuestions: number;
      }>;
    }>;
  },
  selectedLearningObjectives: LearningObjectiveId[],
) => {
  return subject.learningObjectives.reduce((sum, lo) => {
    if (selectedLearningObjectives.includes(lo.id)) {
      return sum + lo.numberOfQuestions;
    }
    lo.learningObjectives.forEach((lo2) => {
      if (!selectedLearningObjectives.includes(lo2.id)) return;
      sum += lo2.numberOfQuestions;
    });
    return sum;
  }, 0);
};
