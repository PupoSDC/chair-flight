export type AnswerId = string;
export type QuestionId = string;
export type QuestionBlockId = string;
export type ContentId = string;
export type LearningObjectiveId = string;

export enum CourseName {
  ATPL_A = 'ATPL(A)',
  CPL_A = 'CPL(A)',
  ATPL_H_IR = 'ATPL(H)/IR',
  ATPL_H_VFR = 'ATPL(H)/VFR',
  CPL_H = 'CPL(H)',
  IR = 'IR',
  CBIR_A = 'CBIR(A)',
}

type CorrectOption = {
  id: string;
  text: string;
  correct: true;
  why?: string;
};

type WrongOption = {
  id: string;
  text: string;
  correct: false;
  why?: string;
};

export type Question = {
  id: QuestionId;
  version: number;
  variant: number;
  question: string;
  correct: string;
  options: [CorrectOption, WrongOption, WrongOption, WrongOption];
  annexes: string[];
  explanation: string;
  externalIds: string[];
  learningObjectives: LearningObjectiveId[];
};

export type QuestionBankContentMetaData = {
  id: ContentId;
  title: string;
  text: string;
  questions: QuestionId[];
  los: LearningObjectiveId[];
};

export type QuestionBankContentMap = Record<
  ContentId,
  Record<ContentId, Record<ContentId, unknown>>
>;

export type LearningObjectiveMetadata = {
  id: LearningObjectiveId;
  courses: CourseName[];
  questions: QuestionId[];
  text: string;
  contentId: string;
  source: string;
};

export type QuestionBankIndex = {
  learningObjectives: Record<LearningObjectiveId, LearningObjectiveMetadata>;
  content: Record<ContentId, QuestionBankContentMetaData>;
  contentTree: Record<ContentId, QuestionBankContentMap>;
  questions: Record<QuestionId, Question[]>;
};
