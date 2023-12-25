import { Media } from "./annexes";
import type { LearningObjectiveId, MediaId, QuestionId } from "./ids";
import type { LearningObjectiveWithHref } from "./learning-objectives";
import type { QuestionTemplate } from "./question-templates";
import type { Subject } from "./subjects";

export type QuestionBankName = "737" | "atpl" | "a320";
export type ModuleName = QuestionBankName | "prep";

export type QuestionsMap = Record<
  QuestionId, 
  QuestionTemplate | undefined
>;

export type LearningObjectivesMap = Record<
  LearningObjectiveId,
  LearningObjectiveWithHref | undefined
>;

export type MediaMap = Record<
  MediaId, 
  Media
>;

export interface QuestionBank {
  getAllSubjects: () => Promise<Subject[]>;
  getAllLearningObjectives: () => Promise<LearningObjectiveWithHref[]>;
  getAllLearningObjectivesMap: () => Promise<LearningObjectivesMap>;
  getAllQuestionTemplates: () => Promise<QuestionTemplate[]>;
  getAllQuestionTemplatesMap: () => Promise<QuestionsMap>;
 // getAllMediaData: () => Promise<Record<string, string>>;

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
