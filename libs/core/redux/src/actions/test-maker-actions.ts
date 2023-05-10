import { createAction } from "@reduxjs/toolkit";
import type { LearningObjectiveId, TestMode } from "@chair-flight/base/types";

export const setTestMakerSubject = createAction<{
  subject: LearningObjectiveId;
}>("test-maker/subject-set");

export const setTestMakerChapters = createAction<
  Array<{ chapter: LearningObjectiveId; value: boolean }>
>("test-maker/chapters-set");

export const setTestMakerNumberOfQuestions = createAction<{
  numberOfQuestions: number;
}>("test-maker/number-of-questions-set");

export const setTestMakerTestMode = createAction<{ mode: TestMode }>(
  "test-maker/mode-set"
);
