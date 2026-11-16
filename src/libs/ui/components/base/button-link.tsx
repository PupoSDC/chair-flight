import { createLink } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

const ButtonAnchor: FC<
  ComponentProps<"a"> & {
    variant?: "default" | "primary";
    size?: "small" | "medium" | "large";
  }
> = ({ variant = "default", size = "small", className, ...props }) => (
  <a
    className={cn(
      "inline-flex flex-none cursor-pointer items-center justify-center",
      "gap-2 border font-semibold whitespace-nowrap no-underline",
      size === "small" && "h-8 rounded-md px-3 text-[13px]",
      size === "medium" && "h-10 rounded-md px-4 text-sm",
      size === "large" && "h-12 rounded-lg px-6 text-base",
      variant === "default" &&
        cn(
          "border-rule-strong bg-paper text-ink",
          "hover:border-accent hover:text-accent",
        ),
      variant === "primary" &&
        "border-brand bg-brand text-white hover:opacity-90",
      className,
    )}
    {...props}
  />
);

export const ButtonLink = createLink(ButtonAnchor);
