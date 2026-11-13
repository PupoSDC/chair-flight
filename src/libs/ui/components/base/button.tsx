import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const BUTTON_CLASS_NAME =
  "inline-flex h-8 flex-none cursor-pointer items-center justify-center gap-2 rounded-md border border-rule-strong bg-paper px-3 text-[13px] font-semibold text-ink no-underline hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-50";

export const Button: FC<ComponentProps<"button">> = ({
  type = "button",
  className,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(BUTTON_CLASS_NAME, className)}
      {...props}
    />
  );
};
