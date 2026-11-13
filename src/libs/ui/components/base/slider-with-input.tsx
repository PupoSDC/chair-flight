import { cn } from "../../utils/cn";
import type { FC } from "react";

export const SliderWithInput: FC<{
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}> = ({ value, min, max, disabled, onChange }) => (
  <div
    className={cn(
      "flex h-10 items-center gap-4 rounded-md border border-rule-strong",
      "bg-paper px-3",
      disabled && "opacity-60",
    )}
  >
    <input
      type="number"
      aria-label="Number of questions"
      disabled={disabled}
      min={min}
      max={max}
      value={value}
      onChange={(event) =>
        onChange(Math.min(Math.max(Number(event.target.value), min), max))
      }
      className={cn(
        "w-14 flex-none border-0 bg-transparent p-0 text-sm text-ink",
        "[appearance:textfield] focus:outline-none",
        "[&::-webkit-inner-spin-button]:appearance-none",
        "[&::-webkit-outer-spin-button]:appearance-none",
      )}
    />
    <input
      type="range"
      tabIndex={-1}
      aria-hidden="true"
      disabled={disabled}
      min={min}
      max={max}
      value={Math.min(value, max)}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-1 min-w-0 flex-1 cursor-pointer accent-accent"
    />
  </div>
);
