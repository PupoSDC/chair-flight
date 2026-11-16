import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "../../libs/ui/icons/search-icon";
import { cn } from "../../libs/ui/utils/cn";
import { searchA320Database } from "../-server-functions/question-banks/search-a320-database";
import type { FC } from "react";

type SearchResult = {
  query: string;
  questions?: Awaited<ReturnType<typeof searchA320Database>>;
};

const A320SearchPage: FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult>();
  const input = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    if (!trimmedQuery) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const questions = await searchA320Database({
          data: { query: trimmedQuery },
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setResult({ query: trimmedQuery, questions });
        }
      } catch {
        if (!controller.signal.aborted) setResult({ query: trimmedQuery });
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [trimmedQuery]);

  const currentResult = result?.query === trimmedQuery ? result : undefined;
  const questions = currentResult?.questions ?? [];
  const status = (() => {
    if (!trimmedQuery) return "";
    if (!currentResult) return "Searching…";
    if (!currentResult.questions) {
      return "Could not search questions. Try again.";
    }
    if (!questions.length) return `Nothing found for “${trimmedQuery}”.`;
    return "";
  })();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <label
        className={cn(
          "flex h-12 items-center gap-3 rounded-lg border border-rule",
          "bg-paper px-4 focus-within:border-accent",
        )}
      >
        <SearchIcon size={20} className="flex-none text-muted" />
        <input
          type="search"
          value={query}
          maxLength={200}
          ref={input}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (value.trim() !== trimmedQuery) setResult(undefined);
            setQuery(value);
          }}
          placeholder="Search questions..."
          aria-label="Search questions"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent text-base text-ink",
            "outline-none",
          )}
        />
      </label>
      {status && (
        <p role="status" className="m-0 p-6 text-center text-sm text-muted">
          {status}
        </p>
      )}
      {questions.length > 0 && (
        <section className="flex flex-col">
          <h2
            className={cn(
              "m-0 text-xs font-semibold tracking-widest text-muted uppercase",
            )}
          >
            Questions
          </h2>
          {questions.map((question) => (
            <Link
              key={question.id}
              to="/modules/a320/questions/$questionId"
              params={{ questionId: question.id }}
              className={cn(
                "flex flex-col gap-1 border-b border-rule py-3 text-ink",
                "no-underline hover:text-accent",
              )}
            >
              <span className="text-xs text-accent">{question.id}</span>
              <span className="line-clamp-2 text-sm">
                {question.preview.split("\n")[0]}
              </span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export const Route = createFileRoute("/(a320)/modules/a320/search")({
  staticData: { breadcrumbs: () => [{ label: "Search" }] },
  component: A320SearchPage,
});
