import type { MiniFs } from "@chair-flight/base/types";

export type AnnexId = string;
export type ContentId = string;
export type CourseId = string;
export type DocId = string;
export type ExternalQuestionId = string;
export type FlashcardId = string;
export type FlashcardCollectionId = string;
export type LearningObjectiveId = string;

export type QuestionOptionId = string;
export type QuestionTemplateId = string;
export type SubjectId = string;

export type AnnexFormat = "jpg";

export type QuestionBankName = "type" | "atpl" | "prep";

export type QuestionBankResource =
  | "questions"
  | "learningObjectives"
  | "annexes"
  | "flashcards"
  | "courses"
  | "subjects"
  | "docs";

export type QuestionVariantType =
  | "simple"
  | "definition"
  | "true-or-false"
  | "one-two"
  | "multiple-correct";

export type Course = {
  id: CourseId;
  text: string;
};

export type Subject = {
  id: SubjectId;
  courses: CourseId[];
  learningObjectives: LearningObjectiveId[];
  longName: string;
  shortName: string;
  numberOfExamQuestions: number;
  numberOfExamMinutes: number;
  numberOfQuestions: number;
};

export type LearningObjective = {
  id: LearningObjectiveId;
  parentId: LearningObjectiveId | CourseId;
  courses: CourseId[];
  learningObjectives: LearningObjectiveId[];

  text: string;
  source: string;
  questions: QuestionTemplateId[];

  /** Includes Questions from this LO and from nested LOs */
  nestedQuestions: QuestionTemplateId[];
};

export type FlashcardContent = {
  id: FlashcardId;
  question: string;
  answer: string;
};

export type FlashcardCollection = {
  id: FlashcardCollectionId;
  title: string;
  flashcards: FlashcardContent[];
};

export type Annex = {
  id: AnnexId;
  href: string;
  doc: DocId;
  format: AnnexFormat;
  description: string;
  questions: QuestionTemplateId[];
  subjects: SubjectId[];
  learningObjectives: LearningObjectiveId[];
};

export type QuestionVariantSimple = {
  type: "simple";
  question: string;
  options: Array<{
    id: QuestionOptionId;
    text: string;
    correct: boolean;
    why: string;
  }>;
};

export type QuestionVariantDefinition = {
  type: "definition";
  question: string;
  options: Array<{
    id: QuestionOptionId;
    term: string;
    definition: string;
  }>;
  fakeOptions: Array<{
    id: QuestionOptionId;
    definition: string;
  }>;
};

export type QuestionVariantTrueOrFalse = {
  type: "true-or-false";
  question: string;
  answer: boolean;
};

export type QuestionVariantOneTwo = {
  type: "one-two";
  question: string;
  firstCorrectStatements: string[];
  firstIncorrectStatements: string[];
  secondCorrectStatements: string[];
  secondIncorrectStatements: string[];
};

export type QuestionVariantMultipleCorrect = {
  type: "multiple-correct";
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
    why: string;
  }>;
};

export type QuestionVariant =
  | QuestionVariantSimple
  | QuestionVariantDefinition
  | QuestionVariantTrueOrFalse
  | QuestionVariantOneTwo
  | QuestionVariantMultipleCorrect;

export type QuestionTemplate = {
  id: QuestionTemplateId;
  doc: DocId;
  relatedQuestions: QuestionTemplateId[];
  externalIds: ExternalQuestionId[];
  subjects: SubjectId[];
  annexes: AnnexId[];
  learningObjectives: LearningObjectiveId[];
  explanation: string;
  srcLocation: string;
  variant: QuestionVariant;
};

export type Doc = {
  id: DocId;
  parent?: DocId;
  title: string;

  // Inferred data
  subject: SubjectId;
  learningObjectives: LearningObjectiveId[];
  questions: QuestionTemplateId[];
  children: DocId[];
  fileName: string;
  content: string;
  empty: boolean;
};

export type QuestionBankNameToType = {
  questions: QuestionTemplate;
  learningObjectives: LearningObjective;
  annexes: Annex;
  flashcards: FlashcardCollection;
  subjects: Subject;
  courses: Course;
  docs: Doc;
};

export type QuestionBankResourceArrays = {
  [K in QuestionBankResource]: QuestionBankNameToType[K][] | undefined;
};

export type QuestionBankResourceMaps = {
  [K in QuestionBankResource]:
    | Record<string, QuestionBankNameToType[K]>
    | undefined;
};

export type QuestionBank = {
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
  preloadForStaticRender: (args: MiniFs) => Promise<void>;
};
