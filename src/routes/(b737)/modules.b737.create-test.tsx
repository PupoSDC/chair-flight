import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../../libs/ui/components/base/button";
import { SliderWithInput } from "../../libs/ui/components/base/slider-with-input";
import { TestResumeBanner } from "../../libs/ui/components/tests/test-resume-banner";
import { useTest } from "../../libs/ui/hooks/use-test";
import { cn } from "../../libs/ui/utils/cn";
import { getB737ClientOnlyTest } from "../-server-functions/question-banks/get-b737-client-only-test";
import type { FC, ReactNode } from "react";

const MODULE_ROUTE = getRouteApi("/(b737)/modules/b737");

type Mode = "exam" | "study";
type Scope = "all" | "pick";

const MAX_QUESTIONS = 200;
const EXAM_QUESTIONS = 40;

const B737TestBuilderStep: FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <h2 className="m-0 text-base font-bold">{title}</h2>
    {children}
  </section>
);

const B737TestBuilderOption: FC<{
  selected: boolean;
  label: string;
  hint?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ selected, label, hint, disabled, onClick }) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "flex min-h-11 flex-1 cursor-pointer flex-col items-center",
      "justify-center gap-1 rounded-lg border-2 bg-paper px-3 py-2",
      "text-sm font-semibold text-ink",
      selected
        ? "border-accent text-accent"
        : "border-rule hover:border-accent",
      "disabled:cursor-default disabled:opacity-60",
    )}
  >
    {label}
    {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
  </button>
);

const B737TestBuilder: FC<{
  chapters: {
    id: string;
    title: string;
    numberOfQuestions: number;
  }[];
  presetChapterId?: string;
}> = ({ chapters, presetChapterId }) => {
  const navigate = useNavigate();
  const { test: currentTest, saveTest } = useTest();
  const presetChapter = chapters.find((item) => item.id === presetChapterId);
  const [mode, setMode] = useState<Mode | null>(presetChapter ? "study" : null);
  const [scope, setScope] = useState<Scope | null>(
    presetChapter ? "pick" : null,
  );
  const [chapterId, setChapterId] = useState<string | null>(
    presetChapter?.id ?? null,
  );
  const [choosing, setChoosing] = useState(!presetChapter);
  const [requested, setRequested] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isExam = mode === "exam";
  const effectiveScope = isExam ? "all" : scope;
  const chapter = chapters.find((item) => item.id === chapterId);
  const selectedChapters =
    effectiveScope === "all" ? chapters : chapter ? [chapter] : [];
  const available = selectedChapters.reduce(
    (total, chapter) => total + chapter.numberOfQuestions,
    0,
  );
  const maxQuestions = Math.max(1, Math.min(MAX_QUESTIONS, available));
  const numberOfQuestions = isExam
    ? Math.min(EXAM_QUESTIONS, maxQuestions)
    : Math.min(requested, maxQuestions);
  const scopeReady =
    available > 0 &&
    (effectiveScope === "all" || (effectiveScope === "pick" && !choosing));

  const start = async () => {
    if (!mode || !scopeReady || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const test = await getB737ClientOnlyTest({
        data: {
          mode,
          chapterIds: selectedChapters.map((chapter) => chapter.id),
          numberOfQuestions,
        },
      });
      saveTest(test);
      await navigate({
        to: "/test/$testId",
        params: { testId: test.id },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-xl flex-col gap-5",
        "overflow-hidden p-4 sm:p-8",
      )}
    >
      <h1 className="m-0 flex-none text-2xl font-bold sm:text-3xl">
        Create a test
      </h1>

      <TestResumeBanner test={currentTest} />

      <B737TestBuilderStep title="Choose a mode">
        <div className="flex gap-2">
          <B737TestBuilderOption
            selected={mode === "exam"}
            label="Exam"
            hint={
              mode
                ? undefined
                : `${EXAM_QUESTIONS} questions, all chapters. You can't see your results until you finish.`
            }
            onClick={() => setMode("exam")}
          />
          <B737TestBuilderOption
            selected={mode === "study"}
            label="Study"
            hint={
              mode
                ? undefined
                : cn(
                    "Configure a study session and see if your answers are correct as you go.",
                  )
            }
            onClick={() => setMode("study")}
          />
        </div>
      </B737TestBuilderStep>

      {mode === "exam" && (
        <B737TestBuilderStep title="Choose chapters">
          <div className="flex gap-2">
            <B737TestBuilderOption selected label="All chapters" disabled />
          </div>
        </B737TestBuilderStep>
      )}

      {mode === "study" && (
        <B737TestBuilderStep title="Choose chapters">
          <div className="flex gap-2">
            <B737TestBuilderOption
              selected={scope === "all"}
              label="All chapters"
              onClick={() => setScope("all")}
            />
            <B737TestBuilderOption
              selected={scope === "pick"}
              label="Pick a chapter"
              onClick={() => {
                setScope("pick");
                setChapterId(null);
                setChoosing(true);
              }}
            />
          </div>
        </B737TestBuilderStep>
      )}

      {mode === "study" && scope === "pick" && (
        <section
          className={cn("flex min-h-0 flex-col gap-3", choosing && "flex-1")}
        >
          <h2 className="m-0 flex-none text-base font-bold">Chapter</h2>
          {choosing || !chapter ? (
            <ul
              className={cn(
                "m-0 flex min-h-0 flex-1 list-none flex-col overflow-auto",
                "overscroll-contain rounded-lg border border-rule bg-paper p-0",
              )}
            >
              {chapters.map((item) => (
                <li
                  key={item.id}
                  className="flex-none border-b border-rule last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setChapterId(item.id);
                      setChoosing(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer flex-col border-0",
                      "bg-transparent",
                      "p-3 text-left text-ink hover:text-accent",
                      item.id === chapterId && "text-accent",
                    )}
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted">
                      {item.numberOfQuestions} questions
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <button
              type="button"
              onClick={() => setChoosing(true)}
              className={cn(
                "flex w-full cursor-pointer flex-col rounded-lg border-2",
                "border-accent bg-paper p-3 text-left text-accent",
              )}
            >
              <span className="text-sm font-medium">{chapter.title}</span>
              <span className="text-xs text-muted">
                {chapter.numberOfQuestions} questions
              </span>
            </button>
          )}
        </section>
      )}

      {mode && scopeReady && (
        <B737TestBuilderStep title="Number of questions">
          <SliderWithInput
            min={1}
            max={maxQuestions}
            value={numberOfQuestions}
            disabled={isExam || submitting}
            onChange={setRequested}
          />
        </B737TestBuilderStep>
      )}

      <div className="mt-auto flex flex-none flex-col gap-2">
        {error && <p className="m-0 text-sm text-danger">{error}</p>}
        <Button
          variant="primary"
          size="large"
          className="w-full"
          disabled={!mode || !scopeReady || submitting}
          onClick={start}
        >
          {submitting ? "Creating..." : "Start"}
        </Button>
      </div>
    </div>
  );
};

const B737CreateTestPage: FC = () => {
  const chapters = MODULE_ROUTE.useLoaderData().chapters.filter(
    (item) => item.numberOfQuestions > 0,
  );
  const { chapter } = Route.useSearch();

  return (
    <B737TestBuilder
      key={chapter}
      chapters={chapters}
      presetChapterId={chapter}
    />
  );
};

export const Route = createFileRoute("/(b737)/modules/b737/create-test")({
  staticData: { breadcrumbs: () => [{ label: "Create test" }] },
  validateSearch: z.object({ chapter: z.string().optional() }),
  component: B737CreateTestPage,
});
