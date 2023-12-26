import {
  QuestionBankFlashcardCollection,
  QuestionBankFlashcardContent,
} from "./question-bank-flashcards";
import type { LearningObjectiveId, MediaId, QuestionId } from "./ids";
import type { QuestionBankLearningObjective } from "./question-bank-learning-objectives";
import type { QuestionBankMedia } from "./question-bank-media";
import type { QuestionBankQuestionTemplate } from "./question-bank-question-templates";
import type { QuestionBankSubject } from "./question-bank-subjects";

export type QuestionBankName = "737" | "atpl" | "a320" | "interview";
export type ModuleName = QuestionBankName | "prep";

export type QuestionsMap = Record<
  QuestionId,
  QuestionBankQuestionTemplate | undefined
>;

export type LearningObjectivesMap = Record<
  LearningObjectiveId,
  QuestionBankLearningObjective | undefined
>;

export type MediaMap = Record<MediaId, QuestionBankMedia | undefined>;

export interface QuestionBank {
  getAllSubjects: () => Promise<QuestionBankSubject[]>;
  getAllLearningObjectives: () => Promise<QuestionBankLearningObjective[]>;
  getAllLearningObjectivesMap: () => Promise<LearningObjectivesMap>;
  getAllQuestionTemplates: () => Promise<QuestionBankQuestionTemplate[]>;
  getAllQuestionTemplatesMap: () => Promise<QuestionsMap>;
  getAllMedia: () => Promise<QuestionBankMedia[]>;
  getAllFlashcardCollections: () => Promise<QuestionBankFlashcardCollection[]>;

  getSubject: (args: { subjectId: string }) => Promise<QuestionBankSubject>;

  getFlashCardCollection: (args: {
    collectionId: string;
  }) => Promise<QuestionBankFlashcardCollection>;

  getLearningObjective: (args: {
    learningObjectiveId: string;
  }) => Promise<QuestionBankLearningObjective>;

  getSomeLearningObjectives: (args: {
    questionId: string;
  }) => Promise<QuestionBankLearningObjective[]>;

  getQuestionTemplate: (args: {
    questionId: string;
  }) => Promise<QuestionBankQuestionTemplate>;

  getSomeQuestionTemplates: (args: {
    questionIds: string[];
  }) => Promise<QuestionBankQuestionTemplate[]>;

  preloadQuestionBankForStaticRender: (args: {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }) => Promise<void>;
}
