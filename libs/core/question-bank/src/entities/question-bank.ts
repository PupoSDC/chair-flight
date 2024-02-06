import { z } from "zod";
import type { Annex } from "./question-bank-annex";
import type { Course } from "./question-bank-course";
import type { Doc } from "./question-bank-doc";
import type { FlashcardCollection } from "./question-bank-flashcards";
import type { LearningObjective } from "./question-bank-learning-objectives";
import type { QuestionBankName } from "./question-bank-name";
import type { QuestionTemplate } from "./question-bank-question";
import type { Subject } from "./question-bank-subject";

export type QuestionBankNameToType = {
  questions: QuestionTemplate;
  learningObjectives: LearningObjective;
  annexes: Annex;
  flashcards: FlashcardCollection;
  subjects: Subject;
  courses: Course;
  docs: Doc;
};

export type QuestionBankResource = keyof QuestionBankNameToType;

export const questionBankResourceSchema = z.enum([
  "questions",
  "learningObjectives",
  "annexes",
  "flashcards",
  "courses",
  "subjects",
  "docs",
]);

export type QuestionBankResourceArrays = {
  [K in QuestionBankResource]: QuestionBankNameToType[K][] | undefined;
};

export type QuestionBankResourceMaps = {
  [K in QuestionBankResource]:
    | Record<string, QuestionBankNameToType[K]>
    | undefined;
};

export type QuestionBankProvider = {
  preloadForStaticRender: (args: MiniFs) => Promise<void>;
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
};
