import { createReducer } from "@reduxjs/toolkit";
import {
  setTestMakerNumberOfQuestions,
  setTestMakerSubject,
  setTestMakerTestMode,
  setTestMakerChapters,
} from "../actions/test-maker-actions";
import type { LearningObjectiveId, TestMode } from "@chair-flight/base/types";

export type TestMaker = {
  mode: TestMode;
  subject: LearningObjectiveId;
  chapters: Record<LearningObjectiveId, boolean>;
  numberOfQuestions: number;
};

export const testMakerReducer = createReducer<TestMaker>(
  {
    mode: "exam",
    subject: "",
    chapters: {},
    numberOfQuestions: 40,
  },
  (builder) => {
    builder
      .addCase(setTestMakerSubject, (store, action) => {
        const { subject } = action.payload;
        store.subject = subject;
      })
      .addCase(setTestMakerChapters, (store, action) => {
        action.payload.forEach(({ chapter, value }) => {
          store.chapters[chapter] = value;
        });
      })
      .addCase(setTestMakerNumberOfQuestions, (store, action) => {
        const { numberOfQuestions } = action.payload;
        store.numberOfQuestions = numberOfQuestions;
      })
      .addCase(setTestMakerTestMode, (store, action) => {
        const { mode } = action.payload;
        store.mode = mode;
      });
  }
);
