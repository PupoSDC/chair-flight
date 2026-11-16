import { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../base/button";
import { Checkbox } from "../base/checkbox";
import { NestedCheckboxSelect } from "../base/nested-checkbox-select";
import { SliderWithInput } from "../base/slider-with-input";
import type { FC, ReactNode } from "react";

type Subject = {
  id: string;
  shortName: string;
  numberOfExamQuestions: number;
  chapters: {
    id: string;
    text: string;
    numberOfQuestions: number;
    sections: {
      id: string;
      text: string;
      numberOfQuestions: number;
    }[];
  }[];
};

export type TestMakerConfig = {
  mode: "exam" | "study";
  subject: string;
  learningObjectiveIds: string[];
  numberOfQuestions: number;
};

const MAX_QUESTIONS = 200;

const Step: FC<{
  title?: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}> = ({ title, aside, className, children }) => (
  <section className={cn("flex min-h-0 flex-col gap-3", className)}>
    {(title || aside) && (
      <div className="flex flex-none items-center justify-between gap-2">
        <h2 className="m-0 text-base font-bold">{title}</h2>
        {aside}
      </div>
    )}
    {children}
  </section>
);

const Option: FC<{
  selected: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
}> = ({ selected, label, hint, onClick }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "flex min-h-11 flex-1 cursor-pointer flex-col items-center",
      "justify-center gap-1 rounded-lg border-2 bg-paper px-3 py-2",
      "text-sm font-semibold text-ink",
      selected
        ? "border-accent text-accent"
        : "border-rule hover:border-accent",
    )}
  >
    {label}
    {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
  </button>
);

export const TestMaker: FC<{
  subjects: Subject[];
  submitting: boolean;
  error: string;
  banner?: ReactNode;
  wide?: boolean;
  onSubmit: (config: TestMakerConfig) => void;
}> = ({ subjects, submitting, error, banner, wide, onSubmit }) => {
  const [mode, setMode] = useState<TestMakerConfig["mode"] | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [choosingSubject, setChoosingSubject] = useState(true);
  const [learningObjectiveIds, setLearningObjectiveIds] = useState<string[]>(
    [],
  );
  const [requested, setRequested] = useState(20);

  const subject = subjects.find((item) => item.id === subjectId);
  const chapters = subject?.chapters ?? [];
  const study = mode === "study";
  const questionCounts = new Map(
    chapters.flatMap((chapter) => [
      [chapter.id, chapter.numberOfQuestions] as const,
      ...chapter.sections.map(
        (section) => [section.id, section.numberOfQuestions] as const,
      ),
    ]),
  );
  const availableQuestions = study
    ? learningObjectiveIds.reduce(
        (total, id) => total + (questionCounts.get(id) ?? 0),
        0,
      )
    : chapters.reduce((total, chapter) => total + chapter.numberOfQuestions, 0);
  const maxQuestions = Math.max(1, Math.min(MAX_QUESTIONS, availableQuestions));
  const numberOfQuestions = study
    ? Math.min(requested, maxQuestions)
    : Math.min(subject?.numberOfExamQuestions ?? 1, maxQuestions);
  const allSelected = chapters.every((chapter) =>
    learningObjectiveIds.includes(chapter.id),
  );
  const someSelected = chapters.some((chapter) =>
    learningObjectiveIds.includes(chapter.id),
  );
  const items = chapters.map((chapter) => ({
    id: chapter.id,
    label: chapter.text,
    subLabel: `${chapter.id} - ${chapter.numberOfQuestions} questions`,
    children: chapter.sections.map((section) => ({
      id: section.id,
      label: section.text,
      subLabel: `${section.id} - ${section.numberOfQuestions} questions`,
    })),
  }));
  const ready =
    Boolean(mode && subject) &&
    !choosingSubject &&
    availableQuestions > 0 &&
    (!study || learningObjectiveIds.length > 0) &&
    !submitting;

  const selectSubject = (next: Subject) => {
    setSubjectId(next.id);
    setLearningObjectiveIds(next.chapters.map((chapter) => chapter.id));
    setRequested(next.numberOfExamQuestions);
    setChoosingSubject(false);
  };

  const submit = () => {
    if (!mode || !subject || !ready) return;
    onSubmit({
      mode,
      subject: subject.id,
      learningObjectiveIds: study
        ? learningObjectiveIds
        : chapters.map((chapter) => chapter.id),
      numberOfQuestions,
    });
  };

  const twoColumns = Boolean(wide && study && subject && !choosingSubject);

  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full flex-col gap-4 overflow-hidden p-4",
        "sm:p-8 lg:flex-row lg:gap-8",
        twoColumns ? "max-w-6xl" : "max-w-xl",
        !wide && "gap-5",
      )}
    >
      <div
        className={cn(
          "contents lg:flex lg:min-h-0 lg:flex-col lg:gap-4",
          twoColumns ? "lg:w-80 lg:flex-none" : "lg:w-full",
        )}
      >
        {!(wide && mode) && (
          <h1 className="m-0 flex-none text-2xl font-bold sm:text-3xl">
            Create a test
          </h1>
        )}
        {banner}
        <Step
          title={wide && mode ? undefined : "Choose a mode"}
          className="flex-none"
        >
          <div className="flex gap-2">
            <Option
              selected={mode === "exam"}
              label="Exam"
              hint={
                mode
                  ? undefined
                  : "All chapters of a subject. You can't see your results until you finish."
              }
              onClick={() => setMode("exam")}
            />
            <Option
              selected={mode === "study"}
              label="Study"
              hint={
                mode
                  ? undefined
                  : "Pick learning objectives and see if your answers are correct as you go."
              }
              onClick={() => setMode("study")}
            />
          </div>
        </Step>
        {mode && (
          <Step
            title={wide && subject && !choosingSubject ? undefined : "Subject"}
            className={cn(choosingSubject ? "flex-1" : "flex-none")}
          >
            {choosingSubject || !subject ? (
              <ul
                className={cn(
                  "m-0 flex min-h-0 flex-1 list-none flex-col overflow-auto",
                  "overscroll-contain rounded-lg border border-rule bg-paper p-0",
                )}
              >
                {subjects.map((item) => (
                  <li
                    key={item.id}
                    className="flex-none border-b border-rule last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => selectSubject(item)}
                      className={cn(
                        "flex w-full cursor-pointer flex-col border-0",
                        "bg-transparent p-3 text-left text-ink",
                        "hover:text-accent",
                        item.id === subjectId && "text-accent",
                      )}
                    >
                      <span className="text-sm font-medium">
                        {item.id} - {item.shortName}
                      </span>
                      <span className="text-xs text-muted">
                        {item.numberOfExamQuestions} exam questions
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <button
                type="button"
                onClick={() => setChoosingSubject(true)}
                className={cn(
                  "flex w-full cursor-pointer flex-col rounded-lg border-2",
                  "border-accent bg-paper p-3 text-left text-accent",
                )}
              >
                <span className="text-sm font-medium">
                  {subject.id} - {subject.shortName}
                </span>
                <span className="text-xs text-muted">
                  {subject.numberOfExamQuestions} exam questions
                </span>
              </button>
            )}
          </Step>
        )}
        {mode && subject && !choosingSubject && (
          <Step
            title={wide ? "Questions" : "Number of questions"}
            className={cn("flex-none", wide && "gap-1.5 max-lg:order-1")}
            aside={
              <span className="text-[11px] text-muted">
                {`total: ${availableQuestions}`}
              </span>
            }
          >
            <SliderWithInput
              min={1}
              max={maxQuestions}
              value={numberOfQuestions}
              disabled={!study || submitting}
              onChange={setRequested}
            />
          </Step>
        )}
        <div
          className={cn(
            "mt-auto flex flex-none flex-col gap-2",
            wide && "max-lg:order-2",
          )}
        >
          {error && <p className="m-0 text-sm text-danger">{error}</p>}
          <Button
            variant="primary"
            size="large"
            className="w-full"
            disabled={!ready}
            onClick={submit}
          >
            {submitting ? "Creating..." : "Start"}
          </Button>
        </div>
      </div>
      {twoColumns && (
        <Step
          title="Learning objectives"
          className="min-h-0 flex-1"
          aside={
            <label className="flex cursor-pointer items-center gap-2 text-xs">
              select all
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={() =>
                  setLearningObjectiveIds(
                    allSelected ? [] : chapters.map((chapter) => chapter.id),
                  )
                }
              />
            </label>
          }
        >
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <NestedCheckboxSelect
              items={items}
              values={learningObjectiveIds}
              onChange={setLearningObjectiveIds}
            />
          </div>
        </Step>
      )}
    </div>
  );
};
