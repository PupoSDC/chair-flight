import type {
  AnnexId,
  QuestionBankName,
  QuestionOptionId,
  QuestionTemplateId,
} from "./question-bank-types";

export type TestId = string;
export type QuestionId = string;

export type TestMode = "exam" | "study";
export type TestStatus = "created" | "started" | "finished";
export type TestQuestionType = "multiple-choice";

export type TestQuestionMultipleChoice = {
  questionId: QuestionId;
  templateId: QuestionTemplateId;
  selectedOptionId?: QuestionOptionId;
  correctOptionId: QuestionOptionId;
  seed: string;
  type: TestQuestionType;
  question: string;
  explanation: string;
  annexes: AnnexId[];
  options: Array<{
    id: QuestionOptionId;
    text: string;
    why: string;
  }>;
};

export type TestQuestion = TestQuestionMultipleChoice;

export type Test = {
  id: string;
  title: string;
  mode: TestMode;
  questionBank: QuestionBankName;
  status: TestStatus;
  createdAtEpochMs: number;
  startedAtEpochMs: number | null;
  finishedAtEpochMs: number | null;
  timeSpentInMs: number;
  durationInMs: number;
  currentQuestionIndex: number;
  questions: TestQuestion[];
};
