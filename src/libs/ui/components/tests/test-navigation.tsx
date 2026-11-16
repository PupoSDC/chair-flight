import { useState } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { ChevronLeftIcon } from "../../icons/chevron-left-icon";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { ChevronsLeftIcon } from "../../icons/chevrons-left-icon";
import { ChevronsRightIcon } from "../../icons/chevrons-right-icon";
import { cn } from "../../utils/cn";
import { Button } from "../base/button";
import { ButtonIcon } from "../base/button-icon";
import type { FC } from "react";
import type { Test } from "../../../core/tests/test";

export const TestNavigation: FC<{
  test: Test;
  onSelect: (index: number) => void;
  onFinish: () => void;
}> = ({ test, onSelect, onFinish }) => {
  const isSmall = useMediaQuery("(max-width: 639px)");
  const pageSize = isSmall ? 40 : 100;
  const pageCount = Math.max(1, Math.ceil(test.questions.length / pageSize));
  const [page, setPage] = useState(
    Math.floor(test.currentQuestionIndex / pageSize),
  );
  const currentPage = Math.min(page, pageCount - 1);
  const study = test.mode === "study";
  const offset = currentPage * pageSize;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fill,32px)] justify-center gap-1.5",
        )}
      >
        {test.questions.slice(offset, offset + pageSize).map((item, i) => {
          const index = offset + i;
          const answered = Boolean(item.selectedOptionId);
          const correct = item.selectedOptionId === item.correctOptionId;
          return (
            <button
              key={item.questionId}
              type="button"
              aria-label={`Question ${index + 1}`}
              aria-current={index === test.currentQuestionIndex}
              onClick={() => onSelect(index)}
              className={cn(
                "grid size-8 cursor-pointer place-items-center rounded-md",
                "border-2 text-xs font-semibold",
                !answered && "border-rule-strong bg-transparent text-ink",
                answered && !study && "border-accent bg-accent text-white",
                answered && study && correct && "border-success bg-success",
                answered && study && !correct && "border-danger bg-danger",
                answered && study && "text-white",
                index === test.currentQuestionIndex &&
                  "outline-2 outline-offset-2 outline-accent",
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2">
        <ButtonIcon
          label="First page"
          disabled={currentPage === 0}
          onClick={() => setPage(0)}
          icon={ChevronsLeftIcon}
        />
        <ButtonIcon
          label="Previous page"
          disabled={currentPage === 0}
          onClick={() => setPage(currentPage - 1)}
          icon={ChevronLeftIcon}
        />
        <span className="min-w-16 text-center text-sm tabular-nums">
          {currentPage + 1} / {pageCount}
        </span>
        <ButtonIcon
          label="Next page"
          disabled={currentPage >= pageCount - 1}
          onClick={() => setPage(currentPage + 1)}
          icon={ChevronRightIcon}
        />
        <ButtonIcon
          label="Last page"
          disabled={currentPage >= pageCount - 1}
          onClick={() => setPage(pageCount - 1)}
          icon={ChevronsRightIcon}
        />
      </div>
      <Button variant="danger" onClick={onFinish}>
        Finish
      </Button>
    </div>
  );
};
