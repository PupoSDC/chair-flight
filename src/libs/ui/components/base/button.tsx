import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const Button: FC<
  ComponentProps<"button"> & {
    variant?: "default" | "primary" | "danger" | "success" | "warning";
    size?: "small" | "medium" | "large";
  }
> = ({
  variant = "default",
  size = "small",
  type = "button",
  className,
  ...props
}) => (
  <button
    type={type}
    className={cn(
      "inline-flex flex-none cursor-pointer items-center justify-center",
      "gap-2 border font-semibold whitespace-nowrap no-underline",
      "disabled:cursor-default disabled:opacity-50",
      size === "small" && "h-8 rounded-md px-3 text-[13px]",
      size === "medium" && "h-10 rounded-md px-4 text-sm",
      size === "large" && "h-12 rounded-lg px-6 text-base",
      variant === "default" &&
        cn(
          "border-rule-strong bg-paper text-ink",
          "enabled:hover:border-accent enabled:hover:text-accent",
        ),
      variant === "primary" &&
        "border-brand bg-brand text-white enabled:hover:opacity-90",
      variant === "danger" &&
        "border-danger bg-danger text-white enabled:hover:opacity-90",
      variant === "success" &&
        "border-success bg-success text-white enabled:hover:opacity-90",
      variant === "warning" &&
        cn("border-warning bg-paper text-warning", "enabled:hover:opacity-80"),
      className,
    )}
    {...props}
  />
);
