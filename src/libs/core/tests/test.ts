import type { QuestionBankName } from "../question-banks/question-banks.ts";

export type Test = {
  id: string;
  title: string;
  mode: "exam" | "study";
  questionBank: QuestionBankName;
  status: "created" | "started" | "finished";
  createdAtEpochMs: number;
  startedAtEpochMs: number | null;
  finishedAtEpochMs: number | null;
  timeSpentInMs: number;
  durationInMs: number;
  currentQuestionIndex: number;
  questions: {
    questionId: string;
    templateId: string;
    selectedOptionId?: string;
    correctOptionId: string;
    seed: string;
    question: string;
    explanation: string;
    annexes: string[];
    options: {
      id: string;
      text: string;
      why: string;
    }[];
  }[];
};
