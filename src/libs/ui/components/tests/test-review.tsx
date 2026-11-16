import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  formatEpochAsDate,
  formatMillisecondsAsClock,
} from "../../../base/format-values";
import { getTestScore } from "../../../core/tests/get-test-score";
import { CheckIcon } from "../../icons/check-icon";
import { ChevronLeftIcon } from "../../icons/chevron-left-icon";
import { CloseIcon } from "../../icons/close-icon";
import { cn } from "../../utils/cn";
import { Markdown } from "../base/markdown";
import type { FC } from "react";
import type { QuestionBankName } from "../../../core/question-banks/question-banks";
import type { Test } from "../../../core/tests/test";

const ScoreCircle: FC<{ score: number; passed: boolean }> = ({
  score,
  passed,
}) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-28 flex-none">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="size-full -rotate-90"
      >
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

type View = "statistics" | "all" | "wrong" | "correct";

const VIEWS: { value: View; label: string }[] = [
  { value: "all", label: "All" },
  { value: "wrong", label: "Wrong" },
  { value: "correct", label: "Correct" },
  { value: "statistics", label: "Chapters" },
];

const ACTIVE_CLASS_NAMES: Record<View, string> = {
  all: "bg-ink text-canvas",
  wrong: "bg-danger text-white",
  correct: "bg-success text-white",
  statistics: "bg-ink text-canvas",
};

export const TestReview: FC<{
  test: Test;
  chapters?: { id: string; text: string }[];
  questionLearningObjectives?: Record<string, string[]>;
}> = ({ test, chapters, questionLearningObjectives }) => {
  const { correctAnswers, score, passed } = getTestScore(test);
  const [view, setView] = useState<View>("all");
  const isCorrect = (question: Test["questions"][number]) =>
    question.selectedOptionId === question.correctOptionId;
  const wrongAnswers = test.questions.length - correctAnswers;
  const counts: Record<View, number> = {
    statistics: 0,
    all: test.questions.length,
    wrong: wrongAnswers,
    correct: correctAnswers,
  };
  const [openChapterId, setOpenChapterId] = useState<string>();
  const getChapterQuestions = (chapterId: string) =>
    test.questions.filter((question) =>
      (questionLearningObjectives?.[question.templateId] ?? []).some(
        (id) => id === chapterId || id.startsWith(`${chapterId}.`),
      ),
    );
  const statistics = (chapters ?? [])
    .map((chapter) => {
      const inChapter = getChapterQuestions(chapter.id);
      return {
        ...chapter,
        total: inChapter.length,
        correct: inChapter.filter(isCorrect).length,
      };
    })
    .filter((chapter) => chapter.total > 0);
  const openChapter = statistics.find((item) => item.id === openChapterId);
  const chapterQuestions = openChapter
    ? getChapterQuestions(openChapter.id)
    : [];
  const visibleViews = VIEWS.filter(
    (item) => item.value !== "statistics" || statistics.length > 0,
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 sm:px-8">
      <div className="flex flex-col gap-4 pt-4 pb-2">
        <div className="flex items-center gap-5">
          <ScoreCircle score={score} passed={passed} />
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className={cn(
                "text-3xl font-bold",
                passed ? "text-success" : "text-danger",
              )}
            >
              {passed ? "Passed" : "Failed"}
            </span>
            <span className="text-base font-semibold">
              {correctAnswers} of {test.questions.length} correct
            </span>
            <span className="text-xs text-muted">
              {formatEpochAsDate(test.finishedAtEpochMs ?? 0)} ·{" "}
              {formatMillisecondsAsClock(test.timeSpentInMs)}
            </span>
          </div>
        </div>
      </div>
      <div className="sticky -top-px z-10 bg-canvas pt-[calc(0.5rem+1px)] pb-2">
        <div
          className={cn(
            "grid grid-cols-4 gap-1 rounded-xl border border-rule bg-paper",
            "p-1",
          )}
        >
          {visibleViews.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={view === item.value}
              onClick={() => {
                setView(item.value);
                setOpenChapterId(undefined);
              }}
              className={cn(
                "flex h-10 min-w-0 cursor-pointer flex-col items-center",
                "justify-center rounded-lg border-0 text-xs leading-tight",
                "font-semibold",
                view === item.value
                  ? ACTIVE_CLASS_NAMES[item.value]
                  : "bg-transparent text-muted hover:text-ink",
              )}
            >
              <span>{item.label}</span>
              {item.value !== "statistics" && (
                <span className="text-sm tabular-nums">
                  {counts[item.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 py-4">
        {view === "statistics" && !openChapter && (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {statistics.map((chapter) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => setOpenChapterId(chapter.id)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-2 rounded-lg",
                    "border",
                    "border-rule bg-paper p-3 text-left text-ink",
                    "hover:border-accent",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-baseline justify-between gap-3 text-sm",
                    )}
                  >
                    <span className="min-w-0 font-medium">{chapter.text}</span>
                    <span className="flex-none text-xs text-muted tabular-nums">
                      {chapter.correct}/{chapter.total}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex h-2 overflow-hidden rounded-full bg-danger",
                    )}
                  >
                    <div
                      className="bg-success"
                      style={{
                        width: `${(chapter.correct / chapter.total) * 100}%`,
                      }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        {openChapter && (
          <button
            type="button"
            onClick={() => setOpenChapterId(undefined)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 border-0",
              "bg-transparent p-0 text-left text-sm font-semibold text-ink",
            )}
          >
            <ChevronLeftIcon size={18} className="flex-none" />
            <span className="min-w-0 flex-1">{openChapter.text}</span>
            <span className="flex-none text-xs text-muted tabular-nums">
              {openChapter.correct}/{openChapter.total}
            </span>
          </button>
        )}
        {(view !== "statistics" || openChapter) &&
          test.questions.map((question, index) => {
            const correct = isCorrect(question);
            if (openChapter && !chapterQuestions.includes(question)) {
              return null;
            }
            if (view === "wrong" && correct) return null;
            if (view === "correct" && !correct) return null;
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
                  "flex flex-col gap-3 rounded-lg border border-l-10",
                  "border-rule",
                  "bg-paper p-4",
                  correct ? "border-l-success" : "border-l-danger",
                )}
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="font-semibold">{index + 1}</span>
                  <Link
                    to={`/modules/${test.questionBank as Exclude<QuestionBankName, "prep">}/questions/$questionId`}
                    params={{ questionId: question.templateId }}
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
                <div className="border-t border-rule pt-3">
                  {question.explanation ? (
                    <Markdown>{question.explanation}</Markdown>
                  ) : (
                    <p className="m-0 text-sm text-muted">
                      No explanation available.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
};
