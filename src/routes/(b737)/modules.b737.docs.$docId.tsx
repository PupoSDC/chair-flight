import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ButtonLink } from "../../libs/ui/components/base/button-link";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { ListIcon } from "../../libs/ui/icons/list-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchB737Chapter } from "../-server-functions/b737/fetch-b737-chapter";
import type { FC } from "react";

const DocLayout: FC = () => {
  const { chapter } = Route.useLoaderData();
  const chapterNumber = Number(chapter.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <header className="flex flex-col gap-4">
        <Link
          to="/modules/b737/docs"
          className={cn(
            "hidden items-center gap-1 text-sm text-muted no-underline",
            "hover:text-accent sm:flex",
          )}
        >
          <ChevronLeftIcon size={16} /> Student notes
        </Link>
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-xs font-semibold tracking-widest text-accent uppercase",
            )}
          >
            Chapter {chapterNumber}
          </span>
          <h1 className="m-0 font-serif text-3xl font-bold sm:text-4xl">
            {chapter.title}
          </h1>
        </div>
      </header>
      <Outlet />
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink
          to="/modules/b737/create-test"
          search={{ chapter: chapter.id }}
          variant="primary"
          size="large"
          className="flex-1"
        >
          <ListIcon size={18} />
          Create test
        </ButtonLink>
        <ButtonLink
          to="/modules/b737/questions/chapters/$chapterId"
          params={{ chapterId: chapter.id }}
          size="large"
          className="flex-1"
        >
          <HelpIcon size={18} />
          Questions ({chapter.numberOfQuestions})
        </ButtonLink>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(b737)/modules/b737/docs/$docId")({
  staticData: {
    breadcrumbs: ({ params }) => [
      { label: "Student notes", link: { to: "/modules/b737/docs" } },
      { label: `Chapter ${Number(params.docId)}` },
    ],
  },
  loader: ({ params }) =>
    fetchB737Chapter({ data: { chapterId: params.docId } }).then((chapter) => ({
      chapter,
    })),
  component: DocLayout,
});
