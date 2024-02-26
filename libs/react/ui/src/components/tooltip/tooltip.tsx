import { cntl } from "@cf/base/utils";
import { twMerge } from 'tailwind-merge'
import { HTMLAttributes, ReactNode, forwardRef } from "react";

export const Tooltip = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & { message: ReactNode }
>(({ message, children, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={twMerge(cntl`
      [&:hover>.tooltip]:block
      [&:hover>.tooltip]:opacity-100
      relative
    `, props.className)}
  >
    {children}
    <span 
      className={cntl`
        tooltip
        absolute
        hidden
        z-50
        overflow-hidden
        rounded-md
        bg-zinc-200
        dark:bg-zinc-900
        text-zinc-900
        dark:text-zinc-200
        px-3
        py-1.5
        text-xs
        text-popover-foreground
        w-max
        transition-opacity
        opacity-0 
      `}
    >
      {message}
    </span>
  </span>
));