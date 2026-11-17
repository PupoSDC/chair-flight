import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { isUserFlowEnabled } from "../../libs/base/feature-flags";
import { getRandomId } from "../../libs/base/get-random-id";
import { createTestQuestion } from "../../libs/core/tests/create-test-question";
import { ButtonIcon } from "../../libs/ui/components/base/button-icon";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { QuestionComments } from "../../libs/ui/components/community/question-comments";
import { AnnexModal } from "../../libs/ui/components/question-bank/annex-modal";
import { QuestionMultipleChoice } from "../../libs/ui/components/tests/question-multiple-choice";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { LightbulbIcon } from "../../libs/ui/icons/lightbulb-icon";
import { MessageIcon } from "../../libs/ui/icons/message-icon";
import { ShuffleIcon } from "../../libs/ui/icons/shuffle-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplQuestion } from "../-server-functions/atpl/fetch-atpl-question";
import type { FC } from "react";

const ALL_TABS = [
  { id: "question", label: "Question", Icon: HelpIcon },
  { id: "explanation", label: "Explanation", Icon: LightbulbIcon },
  { id: "comments", label: "Comments", Icon: MessageIcon },
] as const;

const TABS = ALL_TABS.filter(
  ({ id }) => id !== "comments" || isUserFlowEnabled,
);

type TabId = (typeof ALL_TABS)[number]["id"];

const SectionTitle: FC<{ children: string }> = ({ children }) => (
  <h2 className="m-0 mb-2 text-base font-bold">{children}</h2>
);

const QuestionPractice: FC = () => {
  const questionBank = "atpl" as const;
  const template = Route.useLoaderData();
  const [tab, setTab] = useState<TabId>("question");
  const [seed, setSeed] = useState(template.id);
  const [shakes, setShakes] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [annexHref, setAnnexHref] = useState<string>();
  const question = useMemo(
    () =>
      createTestQuestion(
        {
          id: template.id,
          template: template.template,
          annexes: template.annexes.map((annex) => annex.href),
        },
        seed,
      ),
    [template, seed],
  );

  const canShuffle = template.template.type !== "true-or-false";

  return (
    <div
      className={cn(
        "flex min-h-full flex-col bg-[light-dark(#f5f5f5,var(--canvas))]",
      )}
    >
      <div
        className={cn(
          "sticky top-0 z-10 flex-none border-b border-rule bg-paper",
        )}
      >
        <div
          role="tablist"
          className={cn(
            "flex h-12 w-full items-center gap-1 px-4",
            "[&>button:first-child]:-ml-2.5",
          )}
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={label}
                title={label}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-2",
                  "rounded-md",
                  "border-0 px-2.5 text-[13px]",
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "bg-transparent text-muted hover:text-ink",
                )}
                onClick={() => setTab(id)}
              >
                <Icon size={20} />
                {active && label}
              </button>
            );
          })}
          {canShuffle && (
            <ButtonIcon
              label="Shuffle"
              className={cn("ml-auto", tab !== "question" && "max-lg:hidden")}
              onClick={() => {
                setSeed(getRandomId());
                setShakes((count) => count + 1);
                setSelectedOptionId(undefined);
              }}
              icon={ShuffleIcon}
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-1 gap-8 p-4",
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
                  <SectionTitle>Explanation</SectionTitle>
                  {question.explanation ? (
                    <Markdown>{question.explanation}</Markdown>
                  ) : (
                    <p className="m-0 text-sm text-muted">
                      No explanation yet.
                    </p>
                  )}
                </section>
                {template.learningObjectives.length > 0 && (
                  <section>
                    <SectionTitle>Learning Objectives</SectionTitle>
                    <ul
                      className={cn(
                        "m-0 flex list-none flex-col gap-2 p-0 text-sm",
                      )}
                    >
                      {template.learningObjectives.map((learningObjective) => (
                        <li key={learningObjective.id} className="flex gap-3">
                          <Link
                            to="/modules/atpl/learning-objectives/$learningObjectiveId"
                            params={{
                              learningObjectiveId: learningObjective.id,
                            }}
                            className="flex-none font-semibold text-accent"
                          >
                            {learningObjective.id}
                          </Link>
                          <Markdown>{learningObjective.text}</Markdown>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {template.relatedQuestions.length > 0 && (
                  <section>
                    <SectionTitle>Related Questions</SectionTitle>
                    <ul
                      className={cn(
                        "m-0 flex list-none flex-col gap-2 p-0 text-sm",
                      )}
                    >
                      {template.relatedQuestions.map((related) => (
                        <li key={related.id} className="flex gap-3">
                          <Link
                            to="/modules/atpl/questions/$questionId"
                            params={{ questionId: related.id }}
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
                {template.externalIds.length > 0 && (
                  <section>
                    <SectionTitle>External References</SectionTitle>
                    <p className="m-0 text-sm text-muted">
                      {template.externalIds.join(", ")}
                    </p>
                  </section>
                )}
              </div>
            )}
            {tab === "comments" && (
              <section>
                <SectionTitle>Comments</SectionTitle>
                <QuestionComments
                  questionBank={questionBank}
                  questionId={template.id}
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

const QuestionPage: FC = () => {
  const { questionId } = Route.useParams();

  return <QuestionPractice key={questionId} />;
};

export const Route = createFileRoute(
  "/(atpl)/modules/atpl/questions/$questionId",
)({
  staticData: {
    breadcrumbs: ({ params }) => [
      { label: "Questions", link: { to: "/modules/atpl/questions" } },
      { label: params.questionId },
    ],
  },
  loader: ({ params }) => fetchAtplQuestion({ data: { ...params } }),
  component: QuestionPage,
});
