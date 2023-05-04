import { createAction } from "@reduxjs/toolkit";
import type { LearningObjectiveId, TestMode } from "@chair-flight/base/types";

export const setSubject = createAction<{ subject: LearningObjectiveId }>(
  "test-maker/subject-set"
);

export const toggleChapter = createAction<{ chapter: LearningObjectiveId }>(
  "test-maker/chapter-toggled"
);

export const setNumberOfQuestions = createAction<{ numberOfQuestions: number }>(
  "test-maker/number-of-questions-set"
);

export const setTestMode = createAction<{ mode: TestMode }>(
  "test-maker/mode-set"
);
