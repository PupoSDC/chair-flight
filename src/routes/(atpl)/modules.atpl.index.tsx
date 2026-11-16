import { createFileRoute, Link } from "@tanstack/react-router";
import { ButtonLink } from "../../libs/ui/components/base/button-link";
import { ModuleTitle } from "../../libs/ui/components/base/module-title";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { LayersIcon } from "../../libs/ui/icons/layers-icon";
import { PlayIcon } from "../../libs/ui/icons/play-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplModuleStats } from "../-server-functions/atpl/fetch-atpl-module-stats";
import type { FC } from "react";

const AtplHomePage: FC = () => {
  const stats = Route.useLoaderData();

  return (
    <div className="relative flex min-h-full flex-col">
      <div
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col gap-4 p-4 pt-[18vh]",
          "sm:p-8 sm:pt-[18vh] lg:max-w-5xl lg:flex-1 lg:flex-row",
          "lg:items-center lg:gap-0 lg:p-12 lg:pb-[calc(3rem+20vh)]",
        )}
      >
        <ModuleTitle title="ATPL" subtitle="EASA ECQB 2026" />
        <div className="flex flex-col gap-4 lg:flex-1 lg:pl-16">
          <ButtonLink
            to="/modules/atpl/create-test"
            variant="primary"
            size="large"
          >
            <PlayIcon size={20} />
            Create a test
          </ButtonLink>
          <div className="grid gap-3 lg:gap-4">
            <ButtonLink
              to="/modules/atpl/questions"
              size="medium"
              className={cn(
                "lg:h-12 lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4",
                "lg:text-base",
              )}
            >
              <HelpIcon size={16} className="flex-none text-accent" />
              Questions
              <span className="ml-auto text-muted tabular-nums">
                {stats.questions.toLocaleString("en")}
              </span>
            </ButtonLink>
            <ButtonLink
              to="/modules/atpl/learning-objectives"
              size="medium"
              className={cn(
                "lg:h-12 lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4",
                "lg:text-base",
              )}
            >
              <LayersIcon size={16} className="flex-none text-accent" />
              Learning objectives
              <span className="ml-auto text-muted tabular-nums">
                {stats.learningObjectives.toLocaleString("en")}
              </span>
            </ButtonLink>
          </div>
        </div>
        <nav
          aria-label="Switch module"
          className="absolute right-4 bottom-4 text-xs"
        >
          <Link
            to="/modules"
            className="text-muted no-underline hover:underline"
          >
            Switch modules
          </Link>
        </nav>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(atpl)/modules/atpl/")({
  loader: () => fetchAtplModuleStats(),
  component: AtplHomePage,
});
