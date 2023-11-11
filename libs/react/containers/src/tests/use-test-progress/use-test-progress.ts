import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Test } from "@chair-flight/base/types";

type TestProgress = {
  tests: Record<string, Test>;
  examModeAutoSkip: boolean;
  studyModeAutoSkip: boolean;
  getTest: (args: { testId: string }) => Test;
  addTest: (args: { test: Test }) => void;
  startTest: (args: { testId: string }) => void;
  answerTestQuestion: (args: {
    testId: string;
    questionId: string;
    optionId: string;
  }) => void;
  goToTestQuestion: (args: { testId: string; questionId: string }) => void;
  goToNextQuestion: (args: { testId: string }) => void;
  goToPreviousQuestion: (args: { testId: string }) => void;
  tickTestTimer: (args: { testId: string; timeSpentInMs: number }) => void;
  finishTest: (args: { testId: string }) => void;
  setExamModeAutoSkip: (args: { enabled: boolean }) => void;
  setStudyModeAutoSkip: (args: { enabled: boolean }) => void;
};

export const useTestProgress = create<TestProgress>()(
  devtools(
    persist(
      (set, get) => ({
        tests: {},
        examModeAutoSkip: false,
        studyModeAutoSkip: false,
        getTest: ({ testId }) => {
          const test = get().tests[testId];
          if (!test) throw new Error(`Test ${testId} not found`);
          return test;
        },
        addTest: ({ test }) => {
          set({ tests: { ...get().tests, [test.id]: test } });
        },
        startTest: ({ testId }) => {
          const test = get().tests[testId];
          if (!test) throw new Error(`Test ${testId} not found`);
          const newTest: Test = {
            ...test,
            startedAtEpochMs: Date.now(),
            status: "started",
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        answerTestQuestion: ({ testId, questionId, optionId }) => {
          const test = get().tests[testId];
          const question = test.questions.find(
            (q) => q.questionId === questionId,
          );
          if (!question) {
            throw new Error(
              `Question ${questionId} not found in test ${testId}`,
            );
          }
          question.selectedOptionId = optionId;

          let currentQuestionIndex = test.currentQuestionIndex;
          switch (test.mode) {
            case "exam": {
              if (get().examModeAutoSkip) {
                currentQuestionIndex = Math.min(
                  test.currentQuestionIndex + 1,
                  test.questions.length - 1,
                );
              }
              break;
            }
            case "study": {
              if (get().studyModeAutoSkip) {
                currentQuestionIndex = Math.min(
                  test.currentQuestionIndex + 1,
                  test.questions.length - 1,
                );
              }
              break;
            }
          }
          const newTest = {
            ...test,
            currentQuestionIndex,
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        goToTestQuestion: ({ testId, questionId }) => {
          const test = get().tests[testId];
          const question = test.questions.find(
            (q) => q.questionId === questionId,
          );
          if (!question) {
            throw new Error(
              `Question ${questionId} not found in test ${testId}`,
            );
          }
          const newTest = {
            ...test,
            currentQuestionIndex: test.questions.indexOf(question),
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        goToNextQuestion: ({ testId }) => {
          const test = get().tests[testId];
          const question = test.questions[test.currentQuestionIndex + 1];
          if (!question) return;
          const newTest = {
            ...test,
            currentQuestionIndex: test.currentQuestionIndex + 1,
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        goToPreviousQuestion: ({ testId }) => {
          const test = get().tests[testId];
          const question = test.questions[test.currentQuestionIndex - 1];
          if (!question) return;
          const newTest = {
            ...test,
            currentQuestionIndex: test.currentQuestionIndex - 1,
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        tickTestTimer: ({ testId, timeSpentInMs }) => {
          const test = get().tests[testId];
          if (!test) {
            throw new Error(`Test ${testId} not found`);
          }
          const newTest = {
            ...test,
            timeSpentInMs: test.timeSpentInMs + timeSpentInMs,
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        finishTest: ({ testId }) => {
          const test = get().tests[testId];
          if (!test) throw new Error(`Test ${testId} not found`);

          const newTest: Test = {
            ...test,
            finishedAtEpochMs: Date.now(),
            status: "finished",
          };
          set({ tests: { ...get().tests, [testId]: newTest } });
        },
        setExamModeAutoSkip: ({ enabled }) => {
          set({ examModeAutoSkip: enabled });
        },
        setStudyModeAutoSkip: ({ enabled }) => {
          set({ studyModeAutoSkip: enabled });
        },
      }),
      { name: "cf-test-progress" },
    ),
  ),
);
