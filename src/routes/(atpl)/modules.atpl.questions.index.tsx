import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "../../libs/ui/components/base/input";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { SearchTable } from "../../libs/ui/components/base/search-table";
import { Select } from "../../libs/ui/components/base/select";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplQuestions } from "../-server-functions/atpl/fetch-atpl-questions";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(atpl)/modules/atpl");

const QuestionsPage: FC = () => {
  const { q = "", subject = "", field = "" } = Route.useSearch();
  const firstPage = Route.useLoaderData();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();

  const [draft, setDraft] = useState(q);

  useEffect(() => {
    if (draft === q) return;
    const timeout = setTimeout(() => updateSearch("q", draft), 300);
    return () => clearTimeout(timeout);
  }, [draft, q]);

  const updateSearch = (name: string, value: string) =>
    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        [name]: value === "all" || value === "" ? undefined : value,
      }),
    });

  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchAtplQuestions({
        data: {
          query: q,
          subject,
          field: field === "id" || field === "text" ? field : "all",
          offset,
        },
      }),
  );

  const questionLink = (id: string) => (
    <Link
      to="/modules/atpl/questions/$questionId"
      params={{ questionId: id }}
      className="text-accent"
    >
      <Highlight>{id}</Highlight>
    </Link>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-wrap gap-2 p-3">
        <div className="min-w-48 flex-1 max-sm:basis-full">
          <Input
            label="Search"
            hideLabel
            type="search"
            placeholder="Search Questions..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <div className="w-36 max-sm:flex-1">
          <Select
            label="Subject"
            hideLabel
            placeholder="Subject"
            value={subject || "all"}
            options={[
              { value: "all", label: "All Subjects" },
              ...subjects.map((item) => ({
                value: item.id,
                label: `${item.id} - ${item.shortName}`,
              })),
            ]}
            onChange={(event) => updateSearch("subject", event.target.value)}
          />
        </div>
        <div className="w-36 max-sm:flex-1">
          <Select
            label="Field"
            hideLabel
            placeholder="Field"
            value={field || "all"}
            options={[
              { value: "all", label: "All Fields" },
              { value: "id", label: "Question ID" },
              { value: "text", label: "Text" },
            ]}
            onChange={(event) => updateSearch("field", event.target.value)}
          />
        </div>
      </div>
      <SearchTable
        items={items}
        hasMore={hasMore}
        loading={loading}
        emptyMessage="No questions found"
        query={q}
        correctedQuery={firstPage.correctedQuery}
        onLoadMore={loadMore}
        columns={[
          {
            header: "ID",
            className: "whitespace-nowrap",
            render: (question) => questionLink(question.id),
          },
          {
            header: "Question",
            className: "w-1/2",
            render: (question) => (
              <Markdown className="max-h-40 overflow-hidden">
                {question.preview}
              </Markdown>
            ),
          },
          {
            header: "Learning Objectives",
            className: "whitespace-nowrap",
            render: (question) => (
              <div className="flex flex-col gap-0.5">
                {question.learningObjectives.slice(0, 5).map((id) => (
                  <span key={id}>
                    {" "}
                    <Link
                      to="/modules/atpl/learning-objectives/$learningObjectiveId"
                      params={{ learningObjectiveId: id }}
                      className="text-accent"
                    >
                      {id}
                    </Link>
                  </span>
                ))}
                {question.learningObjectives.length > 5 && (
                  <span className="text-[11px] text-muted">
                    + {question.learningObjectives.length - 5} more
                  </span>
                )}
              </div>
            ),
          },
          {
            header: "Related Questions",
            className: "whitespace-nowrap",
            render: (question) => (
              <div className="flex flex-col gap-0.5">
                {question.relatedQuestions.slice(0, 5).map((id) => (
                  <span key={id}>{questionLink(id)}</span>
                ))}
                {question.relatedQuestions.length > 5 && (
                  <span className="text-[11px] text-muted">
                    + {question.relatedQuestions.length - 5} more
                  </span>
                )}
              </div>
            ),
          },
          {
            header: "External IDs",
            className: "whitespace-nowrap",
            render: (question) => (
              <div className="flex flex-col gap-0.5">
                {question.externalIds.slice(0, 5).map((id) => (
                  <span key={id}>
                    <span className="text-muted">{id}</span>
                  </span>
                ))}
                {question.externalIds.length > 5 && (
                  <span className="text-[11px] text-muted">
                    + {question.externalIds.length - 5} more
                  </span>
                )}
              </div>
            ),
          },
        ]}
        renderCard={(question) => (
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">
              {questionLink(question.id)}
            </span>
            <span className="text-[10px] text-muted">
              {question.learningObjectives.join(", ")}
            </span>
            <div
              className={cn(
                "max-h-40 overflow-hidden text-xs",
                "[mask-image:linear-gradient(to_bottom,black_50%,transparent)]",
              )}
            >
              <Markdown>{question.preview}</Markdown>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const Route = createFileRoute("/(atpl)/modules/atpl/questions/")({
  staticData: { breadcrumbs: () => [{ label: "Questions" }] },
  validateSearch: z.object({
    q: z.string().optional(),
    subject: z.string().optional(),
    field: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    fetchAtplQuestions({
      data: {
        query: deps.q,
        subject: deps.subject,
        field:
          deps.field === "id" || deps.field === "text" ? deps.field : "all",
      },
    }),
  component: QuestionsPage,
});
