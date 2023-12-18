import type { LearningObjectiveId, QuestionId } from "./ids";
import type { LearningObjectiveWithHref } from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";
import type { Subject } from "./subjects";

export type QuestionBankName = "737" | "atpl" | "a320";
export type ModuleName = QuestionBankName | "prep";

export type QuestionsMap = Record<QuestionId, QuestionTemplate | undefined>;

export type LearningObjectivesMap = Record<
  LearningObjectiveId,
  LearningObjectiveWithHref | undefined
>;

export interface QuestionBank {
  getAllSubjects: () => Promise<Subject[]>;
  getAllLearningObjectives: () => Promise<LearningObjectiveWithHref[]>;
  getAllLearningObjectivesMap: () => Promise<LearningObjectivesMap>;
  getAllQuestionTemplates: () => Promise<QuestionTemplate[]>;
  getAllQuestionTemplatesMap: () => Promise<QuestionsMap>;

  getSubject: (args: { subjectId: string }) => Promise<Subject>;

  getLearningObjective: (args: {
    learningObjectiveId: string;
  }) => Promise<LearningObjectiveWithHref>;

  getSomeLearningObjectives: (args: {
    questionId: string;
  }) => Promise<LearningObjectiveWithHref[]>;

  getQuestionTemplate: (args: {
    questionId: string;
  }) => Promise<QuestionTemplate>;

  getSomeQuestionTemplates: (args: {
    questionIds: string[];
  }) => Promise<QuestionTemplate[]>;

  preloadQuestionBankForStaticRender: (args: {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }) => Promise<void>;
}
