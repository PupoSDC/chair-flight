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
import {
  setExamModeAutoSkip,
  setStudyModeAutoSkip,
} from "../actions/user-preferences-actions";
import type { Test } from "@chair-flight/base/types";

export type TestProgressReducer = {
  tests: Record<string, Test>;
  examModeAutoSkip: boolean;
  studyModeAutoSkip: boolean;
};

export const testProgressReducer = createReducer<TestProgressReducer>(
  {
    tests: {},
    examModeAutoSkip: false,
    studyModeAutoSkip: false,
  },
  (builder) => {
    builder
      .addCase(addTest, (store, action) => {
        const { test } = action.payload;
        store.tests[test.id] = test;
      })
      .addCase(startTest, (store, action) => {
        const { testId } = action.payload;
        const test = store.tests[testId];
        if (!test) {
          throw new InvalidStoreState(`Test ${testId} not found`, action);
        }
        test.startedAtEpochMs = Date.now();
        test.status = "started";
      })
      .addCase(answerTestQuestion, (store, action) => {
        const { testId, questionId, optionId } = action.payload;
        const test = store.tests[testId];
        const question = test.questions.find(
          (q) => q.questionId === questionId,
        );
        if (!question) {
          throw new InvalidStoreState(
            `Question ${questionId} not found in test ${testId}`,
            action,
          );
        }
        question.selectedOptionId = optionId;

        switch (test.mode) {
          case "exam":
            if (store.examModeAutoSkip) {
              test.currentQuestionIndex = Math.min(
                test.currentQuestionIndex + 1,
                test.questions.length - 1,
              );
            }
            return;
          case "study":
            if (store.studyModeAutoSkip) {
              test.currentQuestionIndex = Math.min(
                test.currentQuestionIndex + 1,
                test.questions.length - 1,
              );
            }
            return;
        }
      })
      .addCase(navigateToTestQuestion, (store, action) => {
        const { testId, questionId } = action.payload;
        const test = store.tests[testId];
        const questionIndex = test.questions.findIndex(
          (q) => q.questionId === questionId,
        );
        if (questionIndex === -1) {
          throw new InvalidStoreState(
            `Question ${questionId} not found in test ${testId}`,
            action,
          );
        }
        test.currentQuestionIndex = questionIndex;
      })
      .addCase(tickTestTime, (store, action) => {
        const { testId, timeSpentInMs } = action.payload;
        const test = store.tests[testId];
        test.timeSpentInMs += timeSpentInMs;
      })
      .addCase(finishTest, (store, action) => {
        const { testId } = action.payload;
        const test = store.tests[testId];
        test.status = "finished";
        test.finishedAtEpochMs = Date.now();
      })
      .addCase(setExamModeAutoSkip, (store, action) => {
        store.examModeAutoSkip = action.payload.value;
      })
      .addCase(setStudyModeAutoSkip, (store, action) => {
        store.studyModeAutoSkip = action.payload.value;
      });
  },
);
