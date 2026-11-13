import type { Test } from "./test.ts";

export const getTestScore = (test: Test) => {
  const correctAnswers = test.questions.filter(
    (question) => question.selectedOptionId === question.correctOptionId,
  ).length;
  const score = Math.round((correctAnswers / test.questions.length) * 100);
  return { correctAnswers, score, passed: score >= 75 };
};
