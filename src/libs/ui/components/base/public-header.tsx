import { Link } from "@tanstack/react-router";
import { GithubIcon } from "../../icons/github-icon";
import { cn } from "../../utils/cn";
import { ThemeToggle } from "./theme-toggle";
import type { FC } from "react";

export const GITHUB_URL = "https://github.com/PupoSDC/chair-flight";

export const PublicHeader: FC = () => {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-12 flex-none items-center gap-6 border-b",
        "border-rule bg-paper/80 px-4 backdrop-blur",
      )}
    >
      <Link to="/" className="flex items-center gap-2 text-ink no-underline">
        <img src="/favicon.svg" alt="" className="size-6" />
        <span className="text-sm font-bold tracking-widest uppercase">
          Chair Flight
        </span>
      </Link>
      <Link
        to="/blog"
        className="text-sm text-muted no-underline hover:text-accent"
      >
        Blog
      </Link>
      <span className="flex-1" />
      <div className="flex items-center gap-1">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className={cn(
            "grid size-8 place-items-center rounded-md border",
            "border-rule-strong bg-paper text-ink hover:border-accent",
            "hover:text-accent",
          )}
        >
          <GithubIcon />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
};
