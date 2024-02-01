import type { TestQuestion } from "./test-questions";

export type TestMode = "exam" | "study";
export type TestStatus = "created" | "started" | "finished";

export type Test = {
  id: string;
  title: string;
  mode: TestMode;
  questionBank: "atpl" | "type";
  status: TestStatus;
  createdAtEpochMs: number;
  startedAtEpochMs: number | null;
  finishedAtEpochMs: number | null;
  timeSpentInMs: number;
  durationInMs: number;
  currentQuestionIndex: number;
  questions: TestQuestion[];
};
