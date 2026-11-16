import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { ButtonLink } from "../../libs/ui/components/base/button-link";
import { ModuleTitle } from "../../libs/ui/components/base/module-title";
import { BookIcon } from "../../libs/ui/icons/book-icon";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { PlayIcon } from "../../libs/ui/icons/play-icon";
import { SearchIcon } from "../../libs/ui/icons/search-icon";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(b737)/modules/b737");

const B737HomePage: FC = () => {
  const { numberOfQuestions } = MODULE_ROUTE.useLoaderData();

  return (
    <div className="relative flex min-h-full flex-col">
      <div
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col gap-4 p-4 pt-[18vh]",
          "sm:p-8 sm:pt-[18vh] lg:max-w-5xl lg:flex-1 lg:flex-row",
          "lg:items-center lg:gap-0 lg:p-12 lg:pb-[calc(3rem+20vh)]",
        )}
      >
        <ModuleTitle title="737" />
        <div className="flex flex-col gap-4 lg:flex-1 lg:pl-16">
          <ButtonLink
            to="/modules/b737/create-test"
            variant="primary"
            size="large"
          >
            <PlayIcon size={20} />
            Create a test
          </ButtonLink>
          <ButtonLink
            to="/modules/b737/search"
            size="medium"
            className={cn(
              "justify-start font-normal text-muted lg:h-12 lg:gap-3",
              "lg:rounded-xl lg:px-4 lg:text-base",
            )}
          >
            <SearchIcon size={16} className="flex-none" />
            Search...
          </ButtonLink>
          <div className="grid gap-3 lg:gap-4">
            <ButtonLink
              to="/modules/b737/questions"
              size="medium"
              className={cn(
                "lg:h-12 lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4",
                "lg:text-base",
              )}
            >
              <HelpIcon size={16} className="flex-none text-accent" />
              Questions
              <span className="ml-auto text-muted tabular-nums">
                {numberOfQuestions.toLocaleString("en")}
              </span>
            </ButtonLink>
            <ButtonLink
              to="/modules/b737/docs"
              size="medium"
              className={cn(
                "lg:h-12 lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4",
                "lg:text-base",
              )}
            >
              <BookIcon size={16} className="flex-none text-accent" />
              Student notes
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

export const Route = createFileRoute("/(b737)/modules/b737/")({
  component: B737HomePage,
});
