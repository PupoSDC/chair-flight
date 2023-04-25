import { createReducer } from "@reduxjs/toolkit";
import { InvalidStoreState } from "@chair-flight/base/errors";
import {
  addTest,
  answerTestQuestion,
  finishTest,
  navigateToTestQuestion,
  startTest,
  tickTestTime,
} from "../actions/test-actions";
import { store as globalStore } from "../store/store";
import type { Test } from "@chair-flight/base/types";

export type TestsReducer = Record<string, Test>;

export const testsReducer = createReducer<TestsReducer>({}, (builder) => {
  builder
    .addCase(addTest, (store, action) => {
      const { test } = action.payload;
      store[test.id] = test;
    })
    .addCase(startTest, (store, action) => {
      const { testId } = action.payload;
      const test = store[testId];
      if (!test) {
        throw new InvalidStoreState(`Test ${testId} not found`, action);
      }
      test.startedAtEpochMs = Date.now();
      test.status = "started";
    })
    .addCase(answerTestQuestion, (store, action) => {
      const { testId, questionId, optionId } = action.payload;
      const test = store[testId];
      const question = test.questions.find((q) => q.questionId === questionId);
      if (!question) {
        throw new InvalidStoreState(
          `Question ${questionId} not found in test ${testId}`,
          action
        );
      }
      question.selectedOptionId = optionId;

      const { examModeAutoSkip, studyModeAutoSkip } =
        globalStore.getState().userPreferences;

      switch (test.mode) {
        case "exam":
          if (examModeAutoSkip) {
            test.currentQuestionIndex = Math.min(
              test.currentQuestionIndex + 1,
              test.questions.length - 1
            );
          }
          return;
        case "study":
          if (studyModeAutoSkip) {
            test.currentQuestionIndex = Math.min(
              test.currentQuestionIndex + 1,
              test.questions.length - 1
            );
          }
          return;
      }
    })
    .addCase(navigateToTestQuestion, (store, action) => {
      const { testId, questionId } = action.payload;
      const test = store[testId];
      const questionIndex = test.questions.findIndex(
        (q) => q.questionId === questionId
      );
      if (questionIndex === -1) {
        throw new InvalidStoreState(
          `Question ${questionId} not found in test ${testId}`,
          action
        );
      }
      test.currentQuestionIndex = questionIndex;
    })
    .addCase(tickTestTime, (store, action) => {
      const { testId, timeSpentInMs } = action.payload;
      const test = store[testId];
      test.timeSpentInMs += timeSpentInMs;
    })
    .addCase(finishTest, (store, action) => {
      const { testId } = action.payload;
      const test = store[testId];
      test.status = "finished";
      test.finishedAtEpochMs = Date.now();
    });
});
