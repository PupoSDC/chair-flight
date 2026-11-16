import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { Logo } from "./logo";
import type { FC } from "react";

export const Wordmark: FC<{ className?: string }> = ({ className }) => (
  <Link
    to="/"
    className={cn("flex items-center gap-2 text-ink no-underline", className)}
  >
    <Logo />
    <span
      className={cn(
        "text-sm font-bold tracking-widest whitespace-nowrap uppercase",
      )}
    >
      Chair Flight
    </span>
  </Link>
);
