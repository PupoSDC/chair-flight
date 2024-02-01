export type AnnexId = string;
export type ContentId = string;
export type CourseId = string;
export type DocId = string;
export type ExternalQuestionId = string;
export type FlashcardId = string;
export type FlashcardCollectionId = string;
export type LearningObjectiveId = string;
export type QuestionId = string;
export type QuestionOptionId = string;
export type QuestionTemplateId = string;
export type QuestionVariantId = string;
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
  format: AnnexFormat;
  description: string;
  questions: QuestionId[];
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

export type QuestionTemplate = {
  id: QuestionTemplateId;
  docId: DocId;
  relatedQuestions: QuestionTemplateId[];
  externalIds: ExternalQuestionId[];
  subjects: SubjectId[];
  annexes: AnnexId[];
  learningObjectives: LearningObjectiveId[];
  explanation: string;
  srcLocation: string;
  variant:
  | QuestionVariantSimple
  | QuestionVariantDefinition
  | QuestionVariantTrueOrFalse
  | QuestionVariantOneTwo
  | QuestionVariantMultipleCorrect;
};

export type Doc = {
  id: DocId;
  parent?: DocId;
  title: string;

  // Inferred data
  subject: SubjectId;
  learningObjectives: LearningObjectiveId[];
  questions: QuestionId[];
  children: DocId[];
  fileName: string;
  content: string;
  empty: boolean;
};