import { cn } from "../../utils/cn";
import type { FC, ReactNode } from "react";

const TONE_CLASS_NAMES = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-rule text-ink",
};

export const Badge: FC<{
  tone?: keyof typeof TONE_CLASS_NAMES;
  className?: string;
  children: ReactNode;
}> = ({ tone = "accent", className, children }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-xs",
      TONE_CLASS_NAMES[tone],
      className,
    )}
  >
    {children}
  </span>
);
