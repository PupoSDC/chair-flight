import { createFileRoute, Link } from "@tanstack/react-router";
import {
  QUESTION_BANK_NAMES,
  QUESTION_BANKS,
} from "../../libs/core/question-bank/question-banks";
import { cn } from "../../libs/ui/utils/cn";
import { fetchModuleCounts } from "../-server-functions/question-bank/fetch-module-counts";
import type { FC } from "react";

const ModuleHomePage: FC = () => {
  const { questionBank } = Route.useParams();
  const counts = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <div>
        <h1 className="m-0 text-2xl font-bold">
          {QUESTION_BANKS[questionBank].title}
        </h1>
        <p className="m-0 mt-1 text-sm text-muted">
          {QUESTION_BANKS[questionBank].description}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUESTION_BANK_NAMES.map((name) => (
          <Link
            key={name}
            to="/modules/$questionBank"
            params={{ questionBank: name }}
            className={cn(
              "group flex flex-col overflow-hidden rounded-lg border",
              "bg-paper text-ink no-underline hover:border-accent",
              name === questionBank ? "border-accent" : "border-rule",
            )}
          >
            <img
              src={QUESTION_BANKS[name].image}
              alt=""
              className="aspect-video w-full object-cover"
            />
            <span className="flex flex-col gap-0.5 p-3">
              <span className="font-semibold group-hover:text-accent">
                {QUESTION_BANKS[name].title}
              </span>
              <span className="text-sm text-muted">
                {counts[name] ?? 0}{" "}
                {QUESTION_BANKS[name].hasFlashcards
                  ? "Flashcards"
                  : "Questions"}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(modules)/modules/$questionBank/")({
  loader: () => fetchModuleCounts(),
  component: ModuleHomePage,
});
