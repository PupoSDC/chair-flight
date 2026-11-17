import { cn } from "../../utils/cn";
import { Markdown } from "../base/markdown";
import { BuffetOnsetChart } from "../question-bank/annex-buffet-onset-chart";
import { MrjtLoadTrimSheet } from "../question-bank/annex-mrjt-load-trim-sheet";
import type { FC } from "react";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export const QuestionMultipleChoice: FC<{
  question: string;
  options: {
    id: string;
    text: string;
    why?: string;
  }[];
  annexes?: string[];
  selectedOptionId?: string;
  correctOptionId?: string;
  showResult?: boolean;
  disabled?: boolean;
  onOptionClick: (optionId: string) => void;
  onAnnexClick?: (href: string) => void;
}> = ({
  question,
  options,
  annexes = [],
  selectedOptionId,
  correctOptionId,
  showResult,
  disabled,
  onOptionClick,
  onAnnexClick,
}) => {
  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <Markdown className="question-markdown text-base">{question}</Markdown>
      {annexes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {annexes.map((href) => {
            const sheet = href
              .split("?")[0]
              .endsWith("031-mrjt-load-trim-sheet.svg");
            const buffet = href
              .split("?")[0]
              .endsWith("buffet-onset-boundary-chart.svg");
            const fields = Object.fromEntries(
              new URLSearchParams(href.split("?")[1]),
            );
            return (
              <button
                key={href}
                type="button"
                aria-label="Open annex"
                className={cn(
                  "cursor-pointer overflow-hidden",
                  "rounded-md border",
                  "border-rule-strong bg-paper p-0 hover:border-accent",
                  "grid size-14 place-items-center",
                )}
                onClick={() => onAnnexClick?.(href)}
              >
                {sheet ? (
                  <MrjtLoadTrimSheet fields={fields} className="size-full!" />
                ) : buffet ? (
                  <BuffetOnsetChart fields={fields} className="size-full!" />
                ) : (
                  <img src={href} alt="" className="size-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const selected = option.id === selectedOptionId;
          const correct = option.id === correctOptionId;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              className={cn(
                "flex min-h-[78px] cursor-pointer items-center gap-5",
                "rounded-md",
                "border px-4 py-3 text-left text-sm",
                "disabled:cursor-default",
                !showResult &&
                  (selected
                    ? "border-brand bg-brand text-white"
                    : "border-ink/80 bg-paper text-ink hover:border-accent"),
                showResult &&
                  selected &&
                  correct &&
                  "border-success bg-success text-white",
                showResult &&
                  selected &&
                  !correct &&
                  "border-danger bg-danger text-white",
                showResult &&
                  !selected &&
                  correct &&
                  "border-2 border-success bg-paper text-ink",
                showResult &&
                  !selected &&
                  !correct &&
                  "border-ink/40 bg-paper text-ink",
              )}
              onClick={() => onOptionClick(option.id)}
            >
              <span
                className={cn(
                  "w-8 flex-none text-center text-[44px] leading-none",
                  !showResult && !selected && "text-muted",
                )}
              >
                {OPTION_LETTERS[index]}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span>{option.text}</span>
                {showResult && option.why && (
                  <Markdown className="text-xs opacity-80">
                    {option.why}
                  </Markdown>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
