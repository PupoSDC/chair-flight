import { useTheme } from "../../hooks/use-theme";
import { AlarmIcon } from "../../icons/alarm-icon";
import { ChevronLeftIcon } from "../../icons/chevron-left-icon";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { CloseIcon } from "../../icons/close-icon";
import { GridIcon } from "../../icons/grid-icon";
import { HangarIcon } from "../../icons/hangar-icon";
import { HelpIcon } from "../../icons/help-icon";
import { MoonIcon } from "../../icons/moon-icon";
import { SunIcon } from "../../icons/sun-icon";
import { cn } from "../../utils/cn";
import type { FC, ReactNode } from "react";

const HeaderCell: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "flex items-center justify-center gap-2 px-2 text-sm font-semibold",
      "whitespace-nowrap sm:px-5",
      className,
    )}
  >
    {children}
  </div>
);

const HeaderButton: FC<{
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ label, disabled, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "grid size-7 flex-none cursor-pointer place-items-center border-0",
      "sm:size-8",
      "bg-transparent p-0 text-ink hover:text-accent disabled:opacity-50",
    )}
  >
    {children}
  </button>
);

export const TestHeader: FC<{
  title: string;
  index: number;
  total: number;
  clock: string;
  showMeta: boolean;
  onExit?: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onOpenMeta: () => void;
  onOpenNavigation: () => void;
  onFinish: () => void;
}> = ({
  title,
  index,
  total,
  clock,
  showMeta,
  onExit,
  onPrevious,
  onNext,
  onOpenMeta,
  onOpenNavigation,
  onFinish,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "flex h-12 flex-none items-stretch justify-center border-b",
        "border-rule bg-canvas",
      )}
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-stretch justify-between divide-x",
          "divide-rule border-x border-rule sm:w-auto sm:justify-center",
        )}
      >
        <HeaderCell className="w-12 flex-none px-0 sm:w-16 sm:px-0">
          <HeaderButton label="Previous question" onClick={onPrevious}>
            <ChevronLeftIcon size={20} />
          </HeaderButton>
        </HeaderCell>
        <HeaderCell className="hidden capitalize md:flex">{title}</HeaderCell>
        <HeaderCell className="flex-1">
          <span className="max-sm:hidden">Question</span>
          <span className="tabular-nums">
            {index + 1}/{total}
          </span>
        </HeaderCell>
        <HeaderCell className="flex-1">
          <AlarmIcon size={20} className="max-sm:hidden" />
          <span className="tabular-nums">{clock}</span>
        </HeaderCell>
        <HeaderCell className="gap-1 px-2 sm:px-4">
          <HeaderButton
            label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleTheme}
          >
            {theme === "light" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </HeaderButton>
          {onExit && (
            <HeaderButton label="Back to module" onClick={onExit}>
              <HangarIcon size={20} />
            </HeaderButton>
          )}
          {showMeta && (
            <HeaderButton label="Explanation & Meta" onClick={onOpenMeta}>
              <HelpIcon size={20} />
            </HeaderButton>
          )}
          <HeaderButton label="Question Navigation" onClick={onOpenNavigation}>
            <GridIcon size={20} />
          </HeaderButton>
          <HeaderButton label="Finish" onClick={onFinish}>
            <CloseIcon size={20} />
          </HeaderButton>
        </HeaderCell>
        <HeaderCell className="w-12 flex-none px-0 sm:w-16 sm:px-0">
          <HeaderButton label="Next question" onClick={onNext}>
            <ChevronRightIcon size={20} />
          </HeaderButton>
        </HeaderCell>
      </div>
    </header>
  );
};
