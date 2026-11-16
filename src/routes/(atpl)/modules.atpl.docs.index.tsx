import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "../../libs/ui/components/base/input";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { SearchTable } from "../../libs/ui/components/base/search-table";
import { Select } from "../../libs/ui/components/base/select";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { ConstructionIcon } from "../../libs/ui/icons/construction-icon";
import { HourglassIcon } from "../../libs/ui/icons/hourglass-icon";
import { fetchAtplDocs } from "../-server-functions/atpl/fetch-atpl-docs";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(atpl)/modules/atpl");

const DocsPage: FC = () => {
  const { q = "", subject = "", field = "" } = Route.useSearch();
  const firstPage = Route.useLoaderData();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();
  const searchField = field === "id" || field === "text" ? field : "all";
  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchAtplDocs({
        data: { query: q, subject, field: searchField, offset },
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-wrap gap-2 p-3">
        <div className="min-w-48 flex-1 max-sm:basis-full">
          <Input
            label="Search"
            hideLabel
            type="search"
            placeholder="Search Docs..."
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
              { value: "id", label: "Doc ID" },
              { value: "text", label: "Title" },
            ]}
            onChange={(event) => updateSearch("field", event.target.value)}
          />
        </div>
      </div>
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
                to="/modules/atpl/docs/$docId"
                params={{ docId: doc.id }}
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
              <div className="flex flex-col gap-0.5">
                {doc.learningObjectives.slice(0, 5).map((id) => (
                  <span key={id}>
                    <Link
                      to="/modules/atpl/learning-objectives/$learningObjectiveId"
                      params={{ learningObjectiveId: id }}
                      className="text-accent"
                    >
                      {id}
                    </Link>
                  </span>
                ))}
                {doc.learningObjectives.length > 5 && (
                  <span className="text-[11px] text-muted">
                    + {doc.learningObjectives.length - 5} more
                  </span>
                )}
              </div>
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
              to="/modules/atpl/docs/$docId"
              params={{ docId: doc.id }}
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

export const Route = createFileRoute("/(atpl)/modules/atpl/docs/")({
  staticData: { breadcrumbs: () => [{ label: "Docs" }] },
  validateSearch: z.object({
    q: z.string().optional(),
    subject: z.string().optional(),
    field: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    fetchAtplDocs({
      data: {
        query: deps.q,
        subject: deps.subject,
        field:
          deps.field === "id" || deps.field === "text" ? deps.field : "all",
      },
    }),
  component: DocsPage,
});
