import type { LearningObjective } from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";

export interface QuestionBankRepository {
  getQuestionTemplate(questionId: string): Promise<QuestionTemplate>;
  getLearningObjective(id: string): Promise<LearningObjective>;
  getLearningObjectives(ids: string[]): Promise<LearningObjective[]>;
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  getAllLearningObjectives(): Promise<LearningObjective[]>;
  writeQuestions(questions: QuestionTemplate[]): Promise<void>;
  writeLearningObjectives(los: LearningObjective[]): Promise<void>;
}
