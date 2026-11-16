import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../libs/ui/components/base/button";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplDoc } from "../-server-functions/atpl/fetch-atpl-doc";
import { fetchAtplQuestions } from "../-server-functions/atpl/fetch-atpl-questions";
import type { FC } from "react";

const DocPage: FC = () => {
  const { doc, firstPage } = Route.useLoaderData();

  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchAtplQuestions({
        data: { docId: doc.id, offset },
      }),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <div>
        {doc.parent && (
          <Link
            to="/modules/atpl/docs/$docId"
            params={{ docId: doc.parent.id }}
            className="flex items-center gap-1 text-sm text-muted no-underline"
          >
            <ChevronLeftIcon /> {doc.parent.title}
          </Link>
        )}
        <h1 className="m-0 mt-1 text-2xl font-bold">{doc.title}</h1>
      </div>
      {doc.empty ? (
        <p className="m-0 text-sm text-muted">
          This page has not been written yet.
        </p>
      ) : (
        <Markdown>{doc.content}</Markdown>
      )}
      {doc.children.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Chapters</h2>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
            {doc.children.map((child) => (
              <li key={child.id}>
                <Link
                  to="/modules/atpl/docs/$docId"
                  params={{ docId: child.id }}
                  className={cn("text-accent", child.empty && "opacity-60")}
                >
                  {child.id} {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {doc.learningObjectives.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Learning Objectives</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {doc.learningObjectives.map((learningObjective) => (
              <li key={learningObjective.id} className="flex gap-3">
                <Link
                  to="/modules/atpl/learning-objectives/$learningObjectiveId"
                  params={{
                    learningObjectiveId: learningObjective.id,
                  }}
                  className="flex-none font-semibold text-accent"
                >
                  {learningObjective.id}
                </Link>
                <Markdown>{learningObjective.text}</Markdown>
              </li>
            ))}
          </ul>
        </section>
      )}
      {doc.numberOfQuestions > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">
            Questions ({doc.numberOfQuestions})
          </h2>
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
                      to="/modules/atpl/questions/$questionId"
                      params={{ questionId: question.id }}
                      className="font-semibold text-accent"
                    >
                      {question.id}
                    </Link>
                    {question.learningObjectives.slice(0, 4).map((id) => (
                      <Link
                        key={id}
                        to="/modules/atpl/learning-objectives/$learningObjectiveId"
                        params={{ learningObjectiveId: id }}
                        className="text-muted hover:text-accent"
                      >
                        {id}
                      </Link>
                    ))}
                  </div>
                  <Markdown className="text-[13px]">
                    {question.preview}
                  </Markdown>
                </li>
              ))}
            </ul>
            {hasMore && (
              <Button
                className="self-center"
                disabled={loading}
                onClick={loadMore}
              >
                {loading ? "Loading" : "Load more"}
              </Button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export const Route = createFileRoute("/(atpl)/modules/atpl/docs/$docId")({
  staticData: {
    breadcrumbs: ({ params }) => [
      { label: "Docs", link: { to: "/modules/atpl/docs" } },
      { label: params.docId },
    ],
  },
  loader: async ({ params }) => {
    const [doc, firstPage] = await Promise.all([
      fetchAtplDoc({ data: { ...params } }),
      fetchAtplQuestions({ data: { ...params } }),
    ]);
    return { doc, firstPage };
  },
  component: DocPage,
});
