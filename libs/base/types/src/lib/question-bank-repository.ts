import type {
  LearningObjective,
  LearningObjectiveSummary,
} from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";

export interface QuestionBankRepository {
  getQuestionTemplate(questionId: string): Promise<QuestionTemplate>;
  getLearningObjective(id: string): Promise<LearningObjective>;
  getLearningObjectives(ids: string[]): Promise<LearningObjective[]>;
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  getAllLearningObjectives(): Promise<LearningObjective[]>;
  writeQuestions(questions: QuestionTemplate[]): Promise<void>;
  writeLearningObjectives(los: LearningObjective[]): Promise<void>;

  /**
   * Returns a list of subjects that can be directly selected for test
   * generation
   */
  getSubjects(): Promise<LearningObjectiveSummary[]>;
}
