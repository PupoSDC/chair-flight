import { DateTime, Duration } from "luxon";
import type { Test } from "@chair-flight/core/question-bank";

const getClockTime = (milliseconds: number) => {
  const duration = Duration.fromMillis(milliseconds);
  return duration.toFormat("hh:mm");
};

/**
 * returns a bunch of derivative information from data in Test.
 */
export const processTest = (test: Test) => {
  const correctAnswers = test.questions.reduce(
    (s, q) => s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
    0,
  );

  const rawScore = (correctAnswers / test.questions.length) * 100;
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  const color = ((): "warning" | "success" | "danger" | "primary" => {
    if (test.status === "created") return "primary";
    if (test.status === "started") return "warning";
    if (score >= 75) return "success";
    return "danger";
  })();

  const timeLeft = (() => {
    if (test.status === "finished") return "-";
    if (test.mode === "study") return "-";
    const tLeft = test.durationInMs - test.timeSpentInMs;
    return getClockTime(tLeft);
  })();

  const timeSpent = getClockTime(test.timeSpentInMs);

  const timeStarted =
    test.startedAtEpochMs &&
    DateTime.fromMillis(test.startedAtEpochMs).toFormat("DDD");

  return {
    color,
    score,
    timeSpent,
    timeLeft,
    timeStarted,
  };
};
