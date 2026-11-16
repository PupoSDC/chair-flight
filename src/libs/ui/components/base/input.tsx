import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const Input: FC<
  ComponentProps<"input"> & {
    label: string;
    hideLabel?: boolean;
    error?: string;
    invalid?: boolean;
  }
> = ({ label, hideLabel, error, invalid, ...props }) => (
  <label className="flex min-w-0 flex-col gap-1">
    <span
      className={cn("text-xs font-semibold text-muted", hideLabel && "sr-only")}
    >
      {label}
      {props.required && <span className="ml-0.5 text-accent">*</span>}
    </span>
    <input
      className={cn(
        "h-8 w-full min-w-0 rounded-md border bg-paper px-2 text-[13px]",
        "placeholder:text-muted/50 disabled:opacity-50",
        invalid
          ? "border-red-600 text-red-600 dark:border-red-400 dark:text-red-400"
          : cn("text-ink", error ? "border-danger" : "border-rule-strong"),
      )}
      aria-invalid={Boolean(error) || invalid}
      {...props}
    />
    {error && <span className="text-[11px] text-danger">{error}</span>}
  </label>
);
