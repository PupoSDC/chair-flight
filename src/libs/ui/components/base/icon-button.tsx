import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const IconButton: FC<
  Omit<ComponentProps<"button">, "aria-label"> & {
    label: string;
  }
> = ({ label, title, type = "button", className, children, ...props }) => {
  return (
    <button
      type={type}
      aria-label={label}
      title={title ?? label}
      className={cn(
        "grid size-8 flex-none cursor-pointer place-items-center rounded-md border border-rule-strong bg-paper p-0 text-ink hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
