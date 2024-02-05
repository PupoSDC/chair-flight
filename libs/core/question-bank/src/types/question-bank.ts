import type { QuestionBankAnnexes } from "./question-bank-annexes";
import type { QuestionBankDoc } from "./question-bank-docs";
import type { QuestionBankFlashcardCollection } from "./question-bank-flashcards";
import type { QuestionBankQuestionTemplate } from "./question-bank-question-templates";
import type {
  QuestionBankCourse,
  QuestionBankLearningObjective,
  QuestionBankSubject,
} from "./question-bank-subjects";
import type { MiniFs } from "@chair-flight/base/types";

export type QuestionBankName = "type" | "atpl" | "prep";

export type QuestionBankResource =
  | "questions"
  | "learningObjectives"
  | "annexes"
  | "flashcards"
  | "courses"
  | "subjects"
  | "docs";

export type QuestionBankNameToType = {
  questions: QuestionBankQuestionTemplate;
  learningObjectives: QuestionBankLearningObjective;
  annexes: QuestionBankAnnexes;
  flashcards: QuestionBankFlashcardCollection;
  subjects: QuestionBankSubject;
  courses: QuestionBankCourse;
  docs: QuestionBankDoc;
};

export type QuestionBankResourceArrays = {
  [K in QuestionBankResource]: QuestionBankNameToType[K][] | undefined;
};

export type QuestionBankResourceMaps = {
  [K in QuestionBankResource]:
    | Record<string, QuestionBankNameToType[K]>
    | undefined;
};

export interface QuestionBankProvider {
  getName: () => QuestionBankName;
  has: (r: QuestionBankResource) => Promise<boolean>;
  getAll: <T extends QuestionBankResource>(
    r: T,
  ) => Promise<QuestionBankNameToType[T][]>;
  getSome: <T extends QuestionBankResource>(
    r: T,
    id: string[],
  ) => Promise<QuestionBankNameToType[T][]>;
  getOne: <T extends QuestionBankResource>(
    r: T,
    id: string,
  ) => Promise<QuestionBankNameToType[T]>;
  preloadForStaticRender: (fs: MiniFs) => Promise<void>;
}
