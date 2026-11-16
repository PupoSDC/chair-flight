import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Badge } from "../../libs/ui/components/base/badge";
import { Button } from "../../libs/ui/components/base/button";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplQuestions } from "../-server-functions/atpl/fetch-atpl-questions";
import { fetchLearningObjectiveRevision } from "../-server-functions/atpl-learning-objectives/fetch-learning-objective-revision";
import type { FC } from "react";

const LearningObjectiveText: FC<{
  text: string;
  items: string[];
  className?: string;
}> = ({ text, items, className }) => (
  <div className={cn("leading-6 wrap-break-word", className)}>
    <p className="m-0">
      <Highlight>{text}</Highlight>
    </p>
    {items.length > 0 && (
      <ul className="mt-3 mb-0 list-disc pl-6">
        {items.map((item) => (
          <li key={item}>
            <Highlight>{item}</Highlight>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const LearningObjectivePage: FC = () => {
  const { detail, firstPage } = Route.useLoaderData();
  const { revision, version, versions, parent, children, current } = detail;
  const latest = versions.at(-1);
  const isLatest = latest?.id === version.id;
  const versionSearch = (versionId: string) => ({
    version: versionId === latest?.id ? undefined : versionId,
  });

  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchAtplQuestions({
        data: { learningObjective: revision.id, offset },
      }),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <div>
        {parent && (
          <Link
            to="/modules/atpl/learning-objectives/$learningObjectiveId"
            params={{ learningObjectiveId: parent.id }}
            search={versionSearch(version.id)}
            className="flex items-center gap-1 text-sm text-muted no-underline"
          >
            <ChevronLeftIcon /> {parent.id}
          </Link>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-2xl font-bold">{revision.id}</h1>
        </div>
      </div>
      <nav className="flex flex-wrap gap-1">
        {versions.map((item) => (
          <Link
            key={item.id}
            to="/modules/atpl/learning-objectives/$learningObjectiveId"
            params={{ learningObjectiveId: revision.id }}
            search={versionSearch(item.id)}
            disabled={!item.present}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs no-underline",
              item.id === version.id
                ? "bg-accent text-white"
                : "bg-rule text-ink",
              !item.present && "pointer-events-none opacity-40",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <LearningObjectiveText
        text={revision.text}
        items={revision.items}
        className="text-sm"
      />
      {revision.source && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Source</h2>
          <p className="m-0 text-sm whitespace-pre-line">{revision.source}</p>
        </section>
      )}
      {revision.courses.length > 0 && (
        <p className="m-0 flex flex-wrap gap-1">
          {revision.courses.map((course) => (
            <Badge key={course.id}>{course.text}</Badge>
          ))}
        </p>
      )}
      {isLatest && current?.docId && (
        <Link
          to="/modules/atpl/docs/$docId"
          params={{ docId: current.docId }}
          className="text-sm text-accent"
        >
          Read the docs for {current.docId}
        </Link>
      )}
      {children.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Learning Objectives</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {children.map((child) => (
              <li key={child.id} className="flex gap-3">
                <Link
                  to="/modules/atpl/learning-objectives/$learningObjectiveId"
                  params={{ learningObjectiveId: child.id }}
                  search={versionSearch(version.id)}
                  className="flex-none font-semibold text-accent"
                >
                  {child.id}
                </Link>
                <LearningObjectiveText
                  text={child.text}
                  items={child.items}
                  className="min-w-0 flex-1"
                />
                {isLatest && (
                  <span className="flex-none text-xs text-muted">
                    {child.numberOfQuestions}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {isLatest && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">
            Questions ({current?.numberOfQuestions ?? 0})
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

export const Route = createFileRoute(
  "/(atpl)/modules/atpl/learning-objectives/$learningObjectiveId",
)({
  staticData: {
    breadcrumbs: ({ params }) => [
      {
        label: "Learning Objectives",
        link: { to: "/modules/atpl/learning-objectives" },
      },
      { label: params.learningObjectiveId },
    ],
  },
  validateSearch: z.object({
    version: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const detail = await fetchLearningObjectiveRevision({
      data: {
        learningObjectiveId: params.learningObjectiveId,
        version: deps.version,
      },
    });
    const isLatest = detail.versions.at(-1)?.id === detail.version.id;
    const firstPage = isLatest
      ? await fetchAtplQuestions({
          data: {
            learningObjective: params.learningObjectiveId,
          },
        })
      : { items: [], nextOffset: null, correctedQuery: null };
    return { detail, firstPage };
  },
  component: LearningObjectivePage,
});
