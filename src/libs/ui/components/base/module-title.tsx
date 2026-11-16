import { cn } from "../../utils/cn";
import type { FC } from "react";

export const ModuleTitle: FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col items-center lg:mb-0 lg:flex-1 lg:pr-16",
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-widest text-muted uppercase",
        )}
      >
        Chair Flight
      </span>
      <div
        className={cn(
          "flex flex-col items-center bg-gradient-to-b",
          "from-[color-mix(in_srgb,var(--ink)_70%,var(--accent))]",
          "to-accent bg-clip-text text-transparent",
        )}
      >
        <h1
          className={cn(
            "m-0 text-center text-8xl font-bold tracking-tight",
            "lg:text-[10rem] lg:leading-none",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "m-0 text-center text-2xl font-bold tracking-widest",
              "lg:text-4xl",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
