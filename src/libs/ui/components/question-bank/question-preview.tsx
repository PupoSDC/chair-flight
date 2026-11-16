import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { isUserFlowEnabled } from "../../../base/feature-flags";
import { ChevronLeftIcon } from "../../icons/chevron-left-icon";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { ChevronsLeftIcon } from "../../icons/chevrons-left-icon";
import { HelpIcon } from "../../icons/help-icon";
import { LightbulbIcon } from "../../icons/lightbulb-icon";
import { MessageIcon } from "../../icons/message-icon";
import { RefreshIcon } from "../../icons/refresh-icon";
import { cn } from "../../utils/cn";
import { ButtonIcon } from "../base/button-icon";
import { Markdown } from "../base/markdown";
import { QuestionComments } from "../community/question-comments";
import { QuestionMultipleChoice } from "../tests/question-multiple-choice";
import { AnnexModal } from "./annex-modal";
import type { LinkProps } from "@tanstack/react-router";
import type { FC } from "react";

const TABS = [
  { id: "question", label: "Question", Icon: HelpIcon },
  { id: "explanation", label: "Explanation", Icon: LightbulbIcon },
  { id: "comments", label: "Comments", Icon: MessageIcon },
] as const;

const SectionTitle: FC<{ children: string }> = ({ children }) => (
  <h2 className="m-0 mb-2 text-base font-bold">{children}</h2>
);

export const QuestionPreview: FC<{
  questionBank: "atpl" | "b737" | "a320";
  question: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      why: string;
    }[];
    annexes: string[];
    correctOptionId: string;
    explanation?: string;
    shuffleable?: boolean;
  };
  relatedQuestions: {
    id: string;
    preview: string;
  }[];
  backLink: LinkProps;
  position?: {
    index: number;
    total: number;
  };
  onPrevious?: () => void;
  onNext?: () => void;
  onRefresh: () => void;
  relatedQuestionLink: (questionId: string) => LinkProps;
}> = ({
  questionBank,
  question,
  relatedQuestions,
  backLink,
  position,
  onPrevious,
  onNext,
  onRefresh,
  relatedQuestionLink,
}) => {
  const [tab, setTab] = useState<"question" | "explanation" | "comments">(
    "question",
  );
  const [shakes, setShakes] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [annexHref, setAnnexHref] = useState<string>();

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex-none border-b border-rule bg-paper">
        <div
          role="tablist"
          className="flex h-9 w-full items-center gap-1 pr-2 pl-1"
        >
          <Link
            {...backLink}
            aria-label="Back to questions"
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md",
              "text-ink no-underline hover:text-accent",
            )}
          >
            <ChevronsLeftIcon size={16} />
          </Link>
          <div className="mx-2 h-5 w-px bg-rule-strong" />
          {position && (
            <>
              <div className="flex items-center gap-1">
                <ButtonIcon
                  label="Previous question"
                  icon={ChevronLeftIcon}
                  className="size-7 border-0 bg-transparent"
                  disabled={!onPrevious}
                  onClick={onPrevious}
                />
                <span
                  className={cn(
                    "min-w-14 text-center text-[13px] text-muted",
                    "tabular-nums",
                  )}
                >
                  {position.index + 1} / {position.total}
                </span>
                <ButtonIcon
                  label="Next question"
                  icon={ChevronRightIcon}
                  className="size-7 border-0 bg-transparent"
                  disabled={!onNext}
                  onClick={onNext}
                />
              </div>
              <div className="mx-2 h-5 w-px bg-rule-strong" />
            </>
          )}
          {TABS.filter(({ id }) => id !== "comments" || isUserFlowEnabled).map(
            ({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-label={label}
                title={label}
                className={cn(
                  "inline-flex h-7 cursor-pointer items-center gap-2",
                  "border-0 bg-transparent px-2 text-[13px]",
                  tab === id
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-ink",
                )}
                onClick={() => setTab(id)}
              >
                <Icon size={20} />
                {tab === id && label}
              </button>
            ),
          )}
          {question.shuffleable !== false && (
            <ButtonIcon
              key={shakes}
              label="Try again"
              className={cn(
                "ml-auto size-7 border-0 bg-transparent",
                shakes > 0 && "motion-safe:[&>svg]:animate-spin-once",
              )}
              onClick={() => {
                setShakes((count) => count + 1);
                setSelectedOptionId(undefined);
                onRefresh();
              }}
              icon={RefreshIcon}
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-1 gap-8 px-4 pt-8 pb-4",
          tab === "question" ? "max-w-3xl" : "max-w-6xl lg:grid-cols-2",
        )}
      >
        <div
          key={shakes}
          className={cn(
            "min-w-0",
            shakes > 0 && "motion-safe:animate-shake",
            tab !== "question" && "max-lg:hidden",
          )}
        >
          <QuestionMultipleChoice
            question={question.question}
            options={question.options}
            annexes={question.annexes}
            selectedOptionId={selectedOptionId}
            correctOptionId={question.correctOptionId}
            showResult={Boolean(selectedOptionId)}
            disabled={Boolean(selectedOptionId)}
            onOptionClick={setSelectedOptionId}
            onAnnexClick={setAnnexHref}
          />
        </div>
        {tab !== "question" && (
          <div className="min-w-0 lg:border-l lg:border-rule lg:pl-8">
            {tab === "explanation" && (
              <div className="flex flex-col gap-6">
                <section>
                  {question.explanation ? (
                    <Markdown>{question.explanation}</Markdown>
                  ) : (
                    <p className="m-0 text-sm text-muted">
                      No explanation yet.
                    </p>
                  )}
                </section>
                {relatedQuestions.length > 0 && (
                  <section>
                    <SectionTitle>Related Questions</SectionTitle>
                    <ul
                      className={cn(
                        "m-0 flex list-none flex-col gap-2 p-0 text-sm",
                      )}
                    >
                      {relatedQuestions.map((related) => (
                        <li key={related.id} className="flex gap-3">
                          <Link
                            {...relatedQuestionLink(related.id)}
                            className="flex-none font-semibold text-accent"
                          >
                            {related.id}
                          </Link>
                          <Markdown>{related.preview}</Markdown>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
            {tab === "comments" && (
              <section>
                <SectionTitle>Comments</SectionTitle>
                <QuestionComments
                  questionBank={questionBank}
                  questionId={question.id}
                />
              </section>
            )}
          </div>
        )}
        {annexHref && (
          <AnnexModal
            href={annexHref}
            onClose={() => setAnnexHref(undefined)}
          />
        )}
      </div>
    </div>
  );
};
