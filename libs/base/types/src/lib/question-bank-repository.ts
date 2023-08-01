import type { FlashCardContent } from "./flash-cards";
import type { LearningObjective } from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";
import type { Subject } from "./subjects";

export interface QuestionBankRepository {
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  getQuestionTemplates(questionIds: string[]): Promise<QuestionTemplate[]>;
  getQuestionTemplate(questionId: string): Promise<QuestionTemplate>;

  getAllLearningObjectives(): Promise<LearningObjective[]>;
  getLearningObjectives(ids: string[]): Promise<LearningObjective[]>;
  getLearningObjective(id: string): Promise<LearningObjective>;

  getAllSubjects(): Promise<Subject[]>;

  getAllFlashCards(): Promise<Record<string, FlashCardContent[]>>;
  getFlashCards(collection: string): Promise<FlashCardContent[]>;
}
