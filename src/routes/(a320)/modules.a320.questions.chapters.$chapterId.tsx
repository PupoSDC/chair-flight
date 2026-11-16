import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../libs/ui/components/base/button";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { cn } from "../../libs/ui/utils/cn";
import { getA320QuestionPreviews } from "../-server-functions/question-banks/get-a320-question-previews";
import type { FC } from "react";

const ChapterQuestionsPage: FC = () => {
  const { chapterId } = Route.useParams();
  const firstPage = Route.useLoaderData();

  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      getA320QuestionPreviews({
        data: { chapter: chapterId, offset },
      }),
  );

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <div className="flex flex-col gap-2">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((question) => (
            <li
              key={question.id}
              className={cn(
                "grid gap-x-4 gap-y-1 rounded-lg border border-rule bg-paper",
                "p-3 sm:grid-cols-[9rem_1fr]",
              )}
            >
              <div className="flex flex-col gap-1 text-xs">
                <Link
                  to="/modules/a320/questions/$questionId"
                  params={{ questionId: question.id }}
                  className="font-semibold text-accent"
                >
                  {question.id}
                </Link>
              </div>
              <Markdown className="text-[13px]">{question.preview}</Markdown>
            </li>
          ))}
        </ul>
        {hasMore && (
          <Button className="self-center" disabled={loading} onClick={loadMore}>
            {loading ? "Loading" : "Load more"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/(a320)/modules/a320/questions/chapters/$chapterId",
)({
  staticData: {
    breadcrumbs: ({ params }) => [
      { label: "Questions", link: { to: "/modules/a320/questions" } },
      { label: `Chapter ${Number(params.chapterId)}` },
    ],
  },
  loader: ({ params }) =>
    getA320QuestionPreviews({
      data: { chapter: params.chapterId },
    }),
  component: ChapterQuestionsPage,
});
