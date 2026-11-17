import {
  createFileRoute,
  getRouteApi,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { ChapterNavigation } from "../../libs/ui/components/question-bank/chapter-navigation";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(b737)/modules/b737");

const QuestionsLayout: FC = () => {
  const chapters = MODULE_ROUTE.useLoaderData().chapters;
  const matches = useMatches();
  const chapterId = matches.reduce<string | undefined>((found, match) => {
    if (match.routeId === "/(b737)/modules/b737/questions/chapters/$chapterId")
      return (match.params as { chapterId: string }).chapterId;
    if (match.routeId === "/(b737)/modules/b737/questions/$questionId")
      return (match.loaderData as { chapter: { id: string } } | undefined)
        ?.chapter.id;
    return found;
  }, undefined);

  return (
    <div
      data-scroll-reset
      className={cn(
        "flex h-full flex-col lg:flex-row",
        !chapterId && "max-lg:overflow-auto",
      )}
    >
      <nav
        aria-label="Chapters"
        className={cn(
          "w-full flex-none border-rule lg:w-64 lg:overflow-auto lg:bg-paper",
          "lg:overscroll-none",
          "lg:border-r",
          chapterId ? "hidden lg:block" : "block",
        )}
      >
        <div className="p-4 pt-0 lg:p-0">
          <ChapterNavigation
            chapters={chapters}
            selectedChapterId={chapterId}
            chapterLink={(id) => ({
              to: "/modules/b737/questions/chapters/$chapterId",
              params: { chapterId: id },
            })}
          />
        </div>
      </nav>
      <div
        data-scroll-reset
        className={cn(
          "min-h-0 min-w-0 lg:flex-1 lg:overflow-auto lg:overscroll-none",
          chapterId
            ? "flex-1 overflow-auto overscroll-none"
            : "max-lg:order-first max-lg:flex-none",
        )}
      >
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(b737)/modules/b737/questions")({
  component: QuestionsLayout,
});
