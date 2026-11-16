import { ChevronsUpDownIcon } from "../../icons/chevrons-up-down-icon";
import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const Select: FC<
  Omit<ComponentProps<"select">, "children"> & {
    label: string;
    hideLabel?: boolean;
    placeholder: string;
    options: {
      value: string;
      label: string;
    }[];
  }
> = ({ label, hideLabel, placeholder, options, ...props }) => (
  <label className="flex min-w-0 flex-col gap-1">
    <span
      className={cn("text-xs font-semibold text-muted", hideLabel && "sr-only")}
    >
      {label}
      {props.required && <span className="ml-0.5 text-accent">*</span>}
    </span>
    <span className="relative">
      <select
        className={cn(
          "h-8 w-full min-w-0 rounded-md border border-rule-strong",
          "bg-paper px-2 text-[13px] text-ink disabled:opacity-50",
          "appearance-none pr-8",
          "has-[option[value='']:checked]:text-muted/50",
        )}
        {...props}
      >
        <option value="" disabled className="text-ink">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronsUpDownIcon
        size={14}
        className={cn(
          "pointer-events-none absolute top-1/2 right-2.5",
          "-translate-y-1/2 text-muted",
        )}
      />
    </span>
  </label>
);
