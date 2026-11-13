import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SearchHeader } from "../../libs/ui/components/base/search-header";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { SearchTable } from "../../libs/ui/components/base/search-table";
import { IdLinks } from "../../libs/ui/components/question-bank/id-links";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { ConstructionIcon } from "../../libs/ui/icons/construction-icon";
import { HourglassIcon } from "../../libs/ui/icons/hourglass-icon";
import { fetchDocs } from "../-server-functions/question-bank/fetch-docs";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(modules)/modules/$questionBank");

const DocsPage: FC = () => {
  const { questionBank } = Route.useParams();
  const { q = "", subject = "", field = "" } = Route.useSearch();
  const firstPage = Route.useLoaderData();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();
  const searchField = field === "id" || field === "text" ? field : "all";
  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchDocs({
        data: { questionBank, query: q, subject, field: searchField, offset },
      }),
  );

  const subjectNames = Object.fromEntries(
    subjects.map((item) => [item.id, `${item.id} - ${item.shortName}`]),
  );

  const status = (doc: (typeof items)[number], size?: number) =>
    doc.empty ? (
      <span title="This document is just a placeholder. Help Chair Flight grow by contributing!">
        <HourglassIcon size={size} />
      </span>
    ) : (
      <span title="This document is a work in progress. Help Chair Flight grow by contributing!">
        <ConstructionIcon size={size} />
      </span>
    );

  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        placeholder="Search Docs..."
        query={q}
        selects={[
          {
            name: "subject",
            label: "Subject",
            value: subject || "all",
            options: [
              { value: "all", label: "All Subjects" },
              ...subjects.map((item) => ({
                value: item.id,
                label: `${item.id} - ${item.shortName}`,
              })),
            ],
          },
          {
            name: "field",
            label: "Field",
            value: field || "all",
            options: [
              { value: "all", label: "All Fields" },
              { value: "id", label: "Doc ID" },
              { value: "text", label: "Title" },
            ],
          },
        ]}
        onChange={(name, value) =>
          navigate({
            replace: true,
            search: (previous) => ({
              ...previous,
              [name]: value === "all" || value === "" ? undefined : value,
            }),
          })
        }
      />
      <SearchTable
        items={items}
        hasMore={hasMore}
        loading={loading}
        emptyMessage="No docs found"
        query={q}
        correctedQuery={firstPage.correctedQuery}
        onLoadMore={loadMore}
        columns={[
          {
            header: "Subject",
            className: "w-36",
            render: (doc) => (doc.subject ? subjectNames[doc.subject] : "---"),
          },
          {
            header: "Title",
            render: (doc) => (
              <Link
                to="/modules/$questionBank/docs/$docId"
                params={{ questionBank, docId: doc.id }}
                className="text-accent"
              >
                <Highlight>{`[${doc.id}] ${doc.title}`}</Highlight>
              </Link>
            ),
          },
          {
            header: "Learning Objectives",
            className: "w-44",
            render: (doc) => (
              <IdLinks
                ids={doc.learningObjectives}
                renderId={(id) => (
                  <Link
                    to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
                    params={{ questionBank, learningObjectiveId: id }}
                    className="text-accent"
                  >
                    {id}
                  </Link>
                )}
              />
            ),
          },
          {
            header: "Status",
            className: "w-24",
            render: (doc) => <span className="text-muted">{status(doc)}</span>,
          },
        ]}
        renderCard={(doc) => (
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/modules/$questionBank/docs/$docId"
              params={{ questionBank, docId: doc.id }}
              className="text-[13px] text-accent"
            >
              {doc.title}
            </Link>
            <span className="text-muted">{status(doc, 18)}</span>
          </div>
        )}
      />
    </div>
  );
};

export const Route = createFileRoute("/(modules)/modules/$questionBank/docs/")({
  validateSearch: z.object({
    q: z.string().optional(),
    subject: z.string().optional(),
    field: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) =>
    fetchDocs({
      data: {
        questionBank: params.questionBank,
        query: deps.q,
        subject: deps.subject,
        field:
          deps.field === "id" || deps.field === "text" ? deps.field : "all",
      },
    }),
  component: DocsPage,
});
