import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { cn } from "../../utils/cn";
import type { FC, ReactNode } from "react";
import type { QuestionBankName } from "../../../core/question-bank/question-banks";

const COLORS = {
  blue: {
    text: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent",
    hover: "hover:border-accent hover:bg-accent-soft",
  },
  teal: {
    text: "text-teal",
    bg: "bg-teal-soft",
    border: "border-teal",
    hover: "hover:border-teal hover:bg-teal-soft",
  },
  rose: {
    text: "text-rose",
    bg: "bg-rose-soft",
    border: "border-rose",
    hover: "hover:border-rose hover:bg-rose-soft",
  },
};

export const ModuleSelectionButton: FC<{
  color: keyof typeof COLORS;
  questionBank: QuestionBankName;
  title: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  onSelect: () => void;
}> = ({ color, questionBank, title, description, icon, active, onSelect }) => {
  const { text, bg, border, hover } = COLORS[color];

  return (
    // biome-ignore lint/a11y/useSemanticElements: contains a nested link, which cannot live inside a button
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => event.key === "Enter" && onSelect()}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md border",
        "p-2 text-left text-ink sm:p-3",
        active ? cn(bg, border, "shadow-sm") : cn("border-transparent", hover),
      )}
    >
      <span className={cn("hidden flex-none p-3 sm:block", text)}>{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="text-xs">{description}</span>
        <Link
          to="/modules/$questionBank"
          params={{ questionBank }}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-sm underline",
            text,
          )}
        >
          Show more
          <ChevronRightIcon />
        </Link>
      </span>
    </div>
  );
};
