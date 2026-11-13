import { useEffect, useState } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { cn } from "../../utils/cn";
import { Checkbox } from "../base/checkbox";
import { Modal } from "../base/modal";
import { NestedCheckboxSelect } from "../base/nested-checkbox-select";
import { Select } from "../base/select";
import { SliderWithInput } from "../base/slider-with-input";
import type { FC } from "react";
import type { fetchSubjects } from "../../../../routes/-server-functions/question-bank/fetch-subjects";
import type { QuestionBankName } from "../../../core/question-bank/question-banks";

type Subject = Awaited<ReturnType<typeof fetchSubjects>>[number];

export type TestMakerConfig = {
  mode: "exam" | "study";
  subject: string;
  learningObjectiveIds: string[];
  numberOfQuestions: number;
};

const MAX_QUESTIONS = 200;

const getStorageKey = (questionBank: QuestionBankName) =>
  `chair-flight-test-maker-${questionBank}`;

const readConfig = (questionBank: QuestionBankName) => {
  try {
    const stored = localStorage.getItem(getStorageKey(questionBank));
    return stored ? (JSON.parse(stored) as Partial<TestMakerConfig>) : {};
  } catch {
    return {};
  }
};

const getDefaults = (subject: Subject) => ({
  learningObjectiveIds: subject.chapters.map((chapter) => chapter.id),
  numberOfQuestions: subject.numberOfExamQuestions,
});

const SectionLabel: FC<{ label: string; aside?: React.ReactNode }> = ({
  label,
  aside,
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs font-semibold text-ink">{label}</span>
    {aside}
  </div>
);

export const TestMaker: FC<{
  questionBank: QuestionBankName;
  subjects: Subject[];
  submitting: boolean;
  error: string;
  onSubmit: (config: TestMakerConfig) => void;
}> = ({ questionBank, subjects, submitting, error, onSubmit }) => {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState<TestMakerConfig>(() => ({
    mode: "exam",
    subject: subjects[0]?.id ?? "",
    learningObjectiveIds: [],
    numberOfQuestions: 40,
    ...(subjects[0] ? getDefaults(subjects[0]) : {}),
  }));

  useEffect(() => {
    const stored = readConfig(questionBank);
    const subject = subjects.find((item) => item.id === stored.subject);
    if (!subject) return;
    setConfig({
      ...getDefaults(subject),
      mode: stored.mode === "study" ? "study" : "exam",
      subject: subject.id,
      ...(stored.learningObjectiveIds
        ? { learningObjectiveIds: stored.learningObjectiveIds }
        : {}),
      ...(stored.numberOfQuestions
        ? { numberOfQuestions: stored.numberOfQuestions }
        : {}),
    });
  }, [questionBank, subjects]);

  const saveConfig = (next: TestMakerConfig) => {
    setConfig(next);
    try {
      localStorage.setItem(getStorageKey(questionBank), JSON.stringify(next));
    } catch {}
  };

  const subject = subjects.find((item) => item.id === config.subject);
  const chapters = subject?.chapters ?? [];
  const questionCounts = new Map(
    chapters.flatMap((chapter) => [
      [chapter.id, chapter.numberOfQuestions] as const,
      ...chapter.sections.map(
        (section) => [section.id, section.numberOfQuestions] as const,
      ),
    ]),
  );
  const availableQuestions = config.learningObjectiveIds.reduce(
    (total, id) => total + (questionCounts.get(id) ?? 0),
    0,
  );
  const maxQuestions = Math.max(1, Math.min(MAX_QUESTIONS, availableQuestions));
  const isExam = config.mode === "exam";
  const numberOfQuestions = isExam
    ? (subject?.numberOfExamQuestions ?? config.numberOfQuestions)
    : Math.min(config.numberOfQuestions, maxQuestions);
  const allSelected = chapters.every((chapter) =>
    config.learningObjectiveIds.includes(chapter.id),
  );
  const someSelected = chapters.some((chapter) =>
    config.learningObjectiveIds.includes(chapter.id),
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
  const valid = config.learningObjectiveIds.length > 0 && !submitting;

  const nestedSelect = (className?: string) => (
    <NestedCheckboxSelect
      className={className}
      items={items}
      values={config.learningObjectiveIds}
      onChange={(learningObjectiveIds) =>
        saveConfig({ ...config, learningObjectiveIds })
      }
    />
  );

  return (
    <form
      className="mx-auto flex h-full w-full max-w-4xl flex-col gap-3 p-3 sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...config, numberOfQuestions });
      }}
    >
      <Select
        label="Mode"
        placeholder="Mode"
        value={config.mode}
        disabled={submitting}
        options={[
          { value: "exam", label: "Exam" },
          { value: "study", label: "Study" },
        ]}
        onChange={(event) =>
          saveConfig({
            ...config,
            mode: event.target.value === "study" ? "study" : "exam",
          })
        }
      />
      <Select
        label="Subject"
        placeholder="Subject"
        value={config.subject}
        disabled={submitting}
        options={subjects.map((item) => ({
          value: item.id,
          label: `${item.id} - ${item.shortName}`,
        }))}
        onChange={(event) => {
          const next = subjects.find((item) => item.id === event.target.value);
          if (next)
            saveConfig({ ...config, subject: next.id, ...getDefaults(next) });
        }}
      />
      <div className="flex flex-col gap-1.5">
        <SectionLabel
          label="Learning Objectives"
          aside={
            <label className="flex cursor-pointer items-center gap-2 text-xs">
              select all
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={() =>
                  saveConfig({
                    ...config,
                    learningObjectiveIds: allSelected
                      ? []
                      : chapters.map((chapter) => chapter.id),
                  })
                }
              />
            </label>
          }
        />
        {isMobile && (
          <input
            readOnly
            aria-label="Learning Objectives"
            className={cn(
              "h-9 w-full cursor-pointer rounded-md border border-rule-strong",
              "bg-paper px-3 text-sm text-ink",
            )}
            value={
              allSelected
                ? "All!"
                : config.learningObjectiveIds.length === 0
                  ? "None"
                  : "Some"
            }
            onClick={() => setModalOpen(true)}
          />
        )}
      </div>
      {!isMobile && (
        <div className="min-h-0 flex-1 overflow-auto rounded-md">
          {nestedSelect()}
        </div>
      )}
      <div className={cn("flex flex-col gap-1.5", isMobile && "mt-auto")}>
        <SectionLabel
          label="Number of Questions"
          aside={
            <span className="text-[11px] text-muted">
              {!isExam && `max: ${maxQuestions}, `}
              {`total: ${availableQuestions}`}
            </span>
          }
        />
        <SliderWithInput
          min={1}
          max={maxQuestions}
          value={numberOfQuestions}
          disabled={isExam || submitting}
          onChange={(value) =>
            saveConfig({ ...config, numberOfQuestions: value })
          }
        />
      </div>
      {error && <p className="m-0 text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!valid}
        className={cn(
          "h-11 w-full flex-none cursor-pointer rounded-md border-0",
          "bg-accent text-base font-semibold text-white hover:opacity-90",
          "disabled:cursor-default disabled:opacity-50",
        )}
      >
        {submitting ? "Creating..." : "Start!"}
      </button>
      {modalOpen && (
        <Modal
          title="Learning Objectives"
          size="full"
          onClose={() => setModalOpen(false)}
          footer={
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className={cn(
                "h-10 w-full cursor-pointer rounded-md border-0 bg-accent",
                "font-semibold text-white",
              )}
            >
              Submit
            </button>
          }
        >
          {nestedSelect()}
        </Modal>
      )}
    </form>
  );
};
