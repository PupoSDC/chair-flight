import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(b737)/modules/b737");

const B737DocsPage: FC = () => {
  const chapters = MODULE_ROUTE.useLoaderData().chapters;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 sm:p-8">
      <header className="flex flex-col gap-3 border-b border-rule pb-6">
        <span
          className={cn(
            "text-xs font-semibold tracking-widest text-accent uppercase",
          )}
        >
          Student notes
        </span>
        <h1
          className={cn(
            "m-0 bg-gradient-to-b from-ink to-accent bg-clip-text text-7xl",
            "font-bold tracking-tight text-transparent sm:text-8xl",
          )}
        >
          737
        </h1>
        <p className="text-sm">
          This is a collection of sudent notes based on the contents of the
          737-800/8200 FCOM.
        </p>
        <p className="m-0 border-l-4 border-rule pl-3 text-sm text-muted">
          <strong className="text-ink">Note:</strong> This is just a summary of
          the FCOM content that regularly shows up in Type Rating exams. For an
          overview of the systems in each chapter, check the FCOM.
        </p>
      </header>
      <ol className="m-0 flex list-none flex-col p-0">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="border-b border-rule">
            <Link
              to="/modules/b737/docs/$docId"
              params={{ docId: chapter.id }}
              className={cn(
                "group flex items-center gap-4 py-4 text-ink",
                "no-underline hover:text-accent",
              )}
            >
              <span
                className={cn(
                  "w-10 shrink-0 text-right font-serif text-3xl font-bold",
                  "text-muted group-hover:text-accent",
                )}
              >
                {Number(chapter.id)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">{chapter.title}</span>
                <span className="text-sm text-muted">
                  {chapter.numberOfQuestions} questions
                </span>
              </span>
              <ChevronRightIcon size={18} className="flex-none" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const Route = createFileRoute("/(b737)/modules/b737/docs/")({
  staticData: { breadcrumbs: () => [{ label: "Student notes" }] },
  component: B737DocsPage,
});
