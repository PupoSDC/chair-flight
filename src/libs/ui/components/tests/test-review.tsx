import { Link } from "@tanstack/react-router";
import {
  formatEpochAsDate,
  formatMillisecondsAsClock,
} from "../../../base/format-values";
import { getTestScore } from "../../../core/tests/get-test-score";
import { CheckIcon } from "../../icons/check-icon";
import { CloseIcon } from "../../icons/close-icon";
import { cn } from "../../utils/cn";
import { Markdown } from "../base/markdown";
import type { FC } from "react";
import type { Test } from "../../../core/tests/test";

const ScoreCircle: FC<{ score: number; passed: boolean }> = ({
  score,
  passed,
}) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-28 flex-none">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-current opacity-20"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className="stroke-current"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 grid place-items-center text-2xl font-bold",
          passed ? "text-success" : "text-danger",
        )}
      >
        {score}%
      </span>
    </div>
  );
};

const AnswerBox: FC<{ kind: "correct" | "wrong"; text: string }> = ({
  kind,
  text,
}) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-md border-2 p-3 text-sm",
      kind === "correct"
        ? "border-success bg-success-soft"
        : "border-danger bg-danger-soft",
    )}
  >
    {kind === "correct" ? (
      <CheckIcon size={18} className="flex-none text-success" />
    ) : (
      <CloseIcon size={18} className="flex-none text-danger" />
    )}
    <span>{text}</span>
  </div>
);

export const TestReview: FC<{
  test: Test;
}> = ({ test }) => {
  const { correctAnswers, score, passed } = getTestScore(test);

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex min-h-43 items-center justify-between gap-4 px-4 py-6 sm:px-8",
          passed
            ? "bg-success-soft text-success"
            : "bg-danger-soft text-danger",
        )}
      >
        <div className="flex min-w-0 flex-col gap-2 text-ink">
          <h1 className="m-0 text-3xl font-bold">Test results</h1>
          <p className="m-0 text-sm break-words">
            {test.id} | {formatEpochAsDate(test.finishedAtEpochMs ?? 0)} | Time
            Spent: {formatMillisecondsAsClock(test.timeSpentInMs)} |{" "}
            {correctAnswers}/{test.questions.length}
          </p>
        </div>
        <ScoreCircle score={score} passed={passed} />
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
        {test.questions.map((question, index) => {
          const correct =
            question.selectedOptionId === question.correctOptionId;
          const correctOption = question.options.find(
            (option) => option.id === question.correctOptionId,
          );
          const selectedOption = question.options.find(
            (option) => option.id === question.selectedOptionId,
          );
          return (
            <section
              key={question.questionId}
              className={cn(
                "flex flex-col gap-3 rounded-lg border border-l-10 border-rule",
                "bg-paper p-4",
                correct ? "border-l-success" : "border-l-danger",
              )}
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="font-semibold">{index + 1}</span>
                <Link
                  to="/modules/$questionBank/questions/$questionId"
                  params={{
                    questionBank: test.questionBank,
                    questionId: question.templateId,
                  }}
                  className="text-accent"
                >
                  {question.templateId}
                </Link>
              </div>
              <Markdown>{question.question}</Markdown>
              <AnswerBox kind="correct" text={correctOption?.text ?? ""} />
              {!correct && (
                <AnswerBox
                  kind="wrong"
                  text={selectedOption?.text ?? "No option selected"}
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
