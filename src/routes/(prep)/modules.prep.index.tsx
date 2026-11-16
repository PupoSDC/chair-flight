import { createFileRoute, Link } from "@tanstack/react-router";
import {
  QUESTION_BANK_NAMES,
  QUESTION_BANKS,
} from "../../libs/core/question-banks/question-banks";
import { CardsIcon } from "../../libs/ui/icons/cards-icon";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchPrepModuleStats } from "../-server-functions/prep/fetch-prep-module-stats";
import type { FC, ReactNode } from "react";

const ExploreCard: FC<{
  to: string;
  icon: ReactNode;
  title: string;
  text: string;
}> = ({ to, icon, title, text }) => (
  <Link
    to={to}
    className={cn(
      "group flex flex-col gap-1 rounded-lg border border-rule bg-paper p-4",
      "text-ink no-underline hover:border-accent",
    )}
  >
    <span className="text-accent">{icon}</span>
    <span className="mt-1 font-semibold group-hover:text-accent">{title}</span>
    <span className="text-sm text-muted">{text}</span>
    <span
      className={cn(
        "mt-1 inline-flex items-center text-sm font-medium text-accent",
      )}
    >
      Explore
      <ChevronRightIcon size={16} />
    </span>
  </Link>
);

const ModuleHomePage: FC = () => {
  const questionBank = "prep" as const;
  const stats = Route.useLoaderData();
  const bank = QUESTION_BANKS[questionBank];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-8">
      <div>
        <h1 className="m-0 text-2xl font-bold sm:text-3xl">{bank.title}</h1>
        <p className="m-0 mt-1 text-sm text-muted">{bank.description}</p>
      </div>

      {bank.hasFlashcards && (
        <ExploreCard
          to={`/modules/${questionBank}/flashcards`}
          icon={<CardsIcon size={24} />}
          title={`${stats.flashcards.toLocaleString("en")} flashcards`}
          text="Practise answering open ended questions out loud."
        />
      )}

      <nav
        aria-label="Switch module"
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1 border-t",
          "border-rule pt-4 text-sm",
        )}
      >
        <span className="text-muted">Other modules:</span>
        {QUESTION_BANK_NAMES.filter((name) => name !== questionBank).map(
          (name) => (
            <Link
              key={name}
              to={`/modules/${name}`}
              className="text-accent no-underline hover:underline"
            >
              {QUESTION_BANKS[name].shortTitle}
            </Link>
          ),
        )}
        <Link
          to="/modules"
          className="ml-auto text-muted no-underline hover:text-accent"
        >
          All modules
        </Link>
      </nav>
    </div>
  );
};

export const Route = createFileRoute("/(prep)/modules/prep/")({
  loader: () => fetchPrepModuleStats(),
  component: ModuleHomePage,
});
