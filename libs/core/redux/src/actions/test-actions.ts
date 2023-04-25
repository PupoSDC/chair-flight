import { createAction } from "@reduxjs/toolkit";
import type {
  QuestionId,
  QuestionOptionId,
  Test,
} from "@chair-flight/base/types";

export const addTest = createAction<{ test: Test }>("tests/test-added");
export const startTest = createAction<{ testId: string }>("tests/started");
export const finishTest = createAction<{ testId: string }>("tests/finished");

export const answerTestQuestion = createAction<{
  testId: string;
  questionId: QuestionId;
  optionId: QuestionOptionId;
}>("tests/question-answered");

export const navigateToTestQuestion = createAction<{
  testId: string;
  questionId: QuestionId;
}>("tests/navigate-to-question");

export const tickTestTime = createAction<{
  testId: string;
  timeSpentInMs: number;
}>("tests/tick-time");
