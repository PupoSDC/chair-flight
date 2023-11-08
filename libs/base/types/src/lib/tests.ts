import type { Question } from "./questions";

export type TestMode = "exam" | "study";
export type TestStatus = "created" | "started" | "finished";
export type QuestionBank = "737" | "atpl";

export type Test = {
  id: string;
  title: string;
  mode: TestMode;
  questionBank: QuestionBank;
  status: TestStatus;
  createdAtEpochMs: number;
  startedAtEpochMs: number | null;
  finishedAtEpochMs: number | null;
  timeSpentInMs: number;
  durationInMs: number;
  currentQuestionIndex: number;
  questions: Question[];
};
