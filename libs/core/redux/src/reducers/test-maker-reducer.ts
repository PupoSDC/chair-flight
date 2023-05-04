import { createReducer } from "@reduxjs/toolkit";
import {
  setNumberOfQuestions,
  setSubject,
  setTestMode,
  toggleChapter,
} from "../actions/test-maker-actions";
import type { LearningObjectiveId, TestMode } from "@chair-flight/base/types";

export type TestMaker = {
  mode: TestMode;
  subject: LearningObjectiveId;
  chapters: LearningObjectiveId[];
  numberOfQuestions: number;
};

export const testMakerReducer = createReducer<TestMaker>(
  {
    mode: "exam",
    subject: "",
    chapters: [],
    numberOfQuestions: 40,
  },
  (builder) => {
    builder
      .addCase(setSubject, (store, action) => {
        const { subject } = action.payload;
        store.subject = subject;
      })
      .addCase(toggleChapter, (store, action) => {
        const { chapter } = action.payload;
        const index = store.chapters.indexOf(chapter);
        if (index === -1) {
          store.chapters.push(chapter);
        } else {
          store.chapters.splice(index, 1);
        }
      })
      .addCase(setNumberOfQuestions, (store, action) => {
        const { numberOfQuestions } = action.payload;
        store.numberOfQuestions = numberOfQuestions;
      })
      .addCase(setTestMode, (store, action) => {
        const { mode } = action.payload;
        store.mode = mode;
      });
  }
);
