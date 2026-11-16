import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SearchIcon } from "../../libs/ui/icons/search-icon";
import { cn } from "../../libs/ui/utils/cn";
import { searchB737Database } from "../-server-functions/question-banks/search-b737-database";
import type { FC } from "react";

type Results = Awaited<ReturnType<typeof searchB737Database>>;

const SearchPage: FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>();
  const [searching, setSearching] = useState(false);
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) {
      setResults(undefined);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timeout = setTimeout(() => {
      searchB737Database({ data: { query: trimmed } })
        .then((found) => !cancelled && setResults(found))
        .finally(() => !cancelled && setSearching(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [trimmed]);

  const isEmpty =
    results && results.chapters.length === 0 && results.questions.length === 0;

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
          // biome-ignore lint/a11y/noAutofocus: opened from the home search bar
          autoFocus
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes and questions..."
          aria-label="Search"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent text-base text-ink",
            "outline-none",
          )}
        />
      </label>
      {isEmpty && !searching && (
        <p className="m-0 p-6 text-center text-sm text-muted">
          Nothing found for “{trimmed}”.
        </p>
      )}
      {results && results.chapters.length > 0 && (
        <section className="flex flex-col">
          <h2
            className={cn(
              "m-0 text-xs font-semibold tracking-widest text-muted",
              "uppercase",
            )}
          >
            Student notes
          </h2>
          {results.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              to="/modules/b737/docs/$docId"
              params={{ docId: chapter.id }}
              className={cn(
                "flex flex-col gap-1 border-b border-rule py-3 text-ink",
                "no-underline hover:text-accent",
              )}
            >
              <span className="text-sm font-semibold">
                Chapter {Number(chapter.id)} · {chapter.title}
              </span>
              <span className="text-sm text-muted">{chapter.snippet}</span>
            </Link>
          ))}
        </section>
      )}
      {results && results.questions.length > 0 && (
        <section className="flex flex-col">
          <h2
            className={cn(
              "m-0 text-xs font-semibold tracking-widest text-muted",
              "uppercase",
            )}
          >
            Questions
          </h2>
          {results.questions.map((question) => (
            <Link
              key={question.id}
              to="/modules/b737/questions/$questionId"
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

export const Route = createFileRoute("/(b737)/modules/b737/search")({
  staticData: { breadcrumbs: () => [{ label: "Search" }] },
  component: SearchPage,
});
