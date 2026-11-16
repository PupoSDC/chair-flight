import { useEffect, useState } from "react";
import { formatMillisecondsAsMinutes } from "../../../base/format-values";
import { cn } from "../../utils/cn";
import { Button } from "../base/button";
import { Drawer } from "../base/drawer";
import { Markdown } from "../base/markdown";
import { Modal } from "../base/modal";
import { AnnexModal } from "../question-bank/annex-modal";
import { QuestionMultipleChoice } from "./question-multiple-choice";
import { TestHeader } from "./test-header";
import { TestNavigation } from "./test-navigation";
import type { FC } from "react";
import type { Test } from "../../../core/tests/test";

const OPTION_KEYS = ["a", "b", "c", "d", "e", "f"];

export const TestRunner: FC<{
  test: Test;
  onChange: (test: Test) => void;
  onExit: () => void;
}> = ({ test, onChange, onExit }) => {
  const [sessionStartEpochMs, setSessionStartEpochMs] = useState(Date.now);
  const [nowEpochMs, setNowEpochMs] = useState(Date.now);
  const [annexHref, setAnnexHref] = useState<string>();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNowEpochMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const study = test.mode === "study";
  const total = test.questions.length;
  const index = test.currentQuestionIndex;
  const question = test.questions[index];
  const timeSpentInMs = test.timeSpentInMs + nowEpochMs - sessionStartEpochMs;
  const timeLeftInMs = test.durationInMs - timeSpentInMs;
  const expired = !study && timeLeftInMs <= 0;
  const answered = Boolean(question.selectedOptionId);

  const updateTest = (changes: Partial<Test>) => {
    const now = Date.now();
    onChange({
      ...test,
      status: "started",
      startedAtEpochMs: test.startedAtEpochMs ?? now,
      timeSpentInMs,
      ...changes,
    });
    setSessionStartEpochMs(now);
    setNowEpochMs(now);
  };

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= total) return;
    updateTest({ currentQuestionIndex: nextIndex });
  };

  const selectOption = (selectedOptionId: string) => {
    if (study && answered) return;
    updateTest({
      questions: test.questions.map((item, itemIndex) =>
        itemIndex === index ? { ...item, selectedOptionId } : item,
      ),
    });
  };

  const finishTest = () =>
    updateTest({ status: "finished", finishedAtEpochMs: Date.now() });

  const exitTest = () => {
    updateTest({});
    onExit();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (navigationOpen || metaOpen || finishOpen || annexHref) return;
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") goTo(index - 1);
      else if (event.key === "ArrowRight" || event.key === "ArrowDown")
        goTo(index + 1);
      else {
        const optionIndex = OPTION_KEYS.indexOf(event.key.toLowerCase());
        const numberIndex = Number(event.key) - 1;
        const option =
          question.options[optionIndex >= 0 ? optionIndex : numberIndex];
        if (option) selectOption(option.id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="flex h-dvh flex-col bg-[light-dark(#ffffff,#000000)]">
      <TestHeader
        title={test.title}
        index={index}
        total={total}
        clock={formatMillisecondsAsMinutes(
          study ? timeSpentInMs : timeLeftInMs,
        )}
        showMeta={study}
        onExit={study ? exitTest : undefined}
        onPrevious={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
        onOpenMeta={() => setMetaOpen(true)}
        onOpenNavigation={() => setNavigationOpen(true)}
        onFinish={() => setFinishOpen(true)}
      />
      <div className="relative isolate flex min-h-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-auto">
          <div
            className={cn(
              "mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 sm:py-8",
            )}
          >
            <QuestionMultipleChoice
              question={question.question}
              options={question.options}
              annexes={question.annexes}
              selectedOptionId={question.selectedOptionId}
              correctOptionId={question.correctOptionId}
              showResult={study && answered}
              disabled={study && answered}
              onAnnexClick={setAnnexHref}
              onOptionClick={selectOption}
            />
          </div>
        </main>
      </div>
      <Drawer
        title="Question Navigation"
        open={navigationOpen}
        onClose={() => setNavigationOpen(false)}
      >
        <TestNavigation
          test={test}
          onSelect={(nextIndex) => {
            goTo(nextIndex);
            setNavigationOpen(false);
          }}
          onFinish={() => {
            setNavigationOpen(false);
            setFinishOpen(true);
          }}
        />
      </Drawer>
      <Drawer
        title="Question Meta"
        open={metaOpen}
        width={640}
        onClose={() => setMetaOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p className="m-0 text-xs text-muted">
            {question.templateId} · seed {question.seed}
          </p>
          {answered ? (
            <Markdown>{question.explanation || "No explanation."}</Markdown>
          ) : (
            <p className="m-0 text-sm text-muted">
              Answer the question to see its explanation.
            </p>
          )}
        </div>
      </Drawer>
      {finishOpen && !expired && (
        <Modal
          title="Finish test"
          onClose={() => setFinishOpen(false)}
          footer={
            <div className="flex flex-wrap justify-end gap-2">
              {study && (
                <Button variant="warning" onClick={exitTest}>
                  Exit without finishing
                </Button>
              )}
              <Button variant="danger" onClick={finishTest}>
                Finish
              </Button>
            </div>
          }
        >
          <p className="m-0 text-sm">
            Are you sure you want to finish the test?
          </p>
        </Modal>
      )}
      {expired && (
        <Modal
          title="Time is up"
          onClose={finishTest}
          footer={
            <div className="flex justify-end">
              <Button onClick={finishTest}>See results</Button>
            </div>
          }
        >
          <p className="m-0 text-sm">The time for this test has ended.</p>
        </Modal>
      )}
      {annexHref && (
        <AnnexModal href={annexHref} onClose={() => setAnnexHref(undefined)} />
      )}
    </div>
  );
};
