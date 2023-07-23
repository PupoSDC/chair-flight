import type { FlashCardContent } from "./flash-cards";
import type {
  LearningObjective,
  LearningObjectiveSummary,
} from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";

export interface QuestionBankRepository {
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  getQuestionTemplate(questionId: string): Promise<QuestionTemplate>;
  getQuestionTemplates(questionIds: string[]): Promise<QuestionTemplate[]>;
  getAllLearningObjectives(): Promise<LearningObjective[]>;
  getLearningObjective(id: string): Promise<LearningObjective>;
  getLearningObjectives(ids: string[]): Promise<LearningObjective[]>;
  getAllSubjects(): Promise<LearningObjectiveSummary[]>;
  getAllFlashCards(): Promise<Record<string, FlashCardContent[]>>;
  writeQuestions(questions: QuestionTemplate[]): Promise<void>;
  writeLearningObjectives(los: LearningObjective[]): Promise<void>;
  writeSubjects(subjects: LearningObjectiveSummary[]): Promise<void>;
  writeFlashCards(
    flashCards: Record<string, FlashCardContent[]>,
  ): Promise<void>;
}
