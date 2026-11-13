import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { SearchHeader } from "../../libs/ui/components/base/search-header";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { SearchTable } from "../../libs/ui/components/base/search-table";
import { usePagedItems } from "../../libs/ui/hooks/use-paged-items";
import { fetchCourses } from "../-server-functions/question-bank/fetch-courses";
import { fetchLearningObjectives } from "../-server-functions/question-bank/fetch-learning-objectives";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(modules)/modules/$questionBank");

const LearningObjectivesPage: FC = () => {
  const { questionBank } = Route.useParams();
  const { q = "", subject = "", course = "", field = "" } = Route.useSearch();
  const { firstPage, courses } = Route.useLoaderData();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();
  const searchField = field === "id" || field === "text" ? field : "all";
  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchLearningObjectives({
        data: {
          questionBank,
          query: q,
          subject,
          course,
          field: searchField,
          offset,
        },
      }),
  );

  const courseNames = Object.fromEntries(
    courses.map((item) => [item.id, item.text]),
  );
  const visibleCourses = (ids: string[]) =>
    ids.filter((id) => !course || id === course);

  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        placeholder="Search Learning Objectives..."
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
          ...(courses.length > 0
            ? [
                {
                  name: "course",
                  label: "Course",
                  value: course || "all",
                  options: [
                    { value: "all", label: "All Courses" },
                    ...courses.map((item) => ({
                      value: item.id,
                      label: item.text,
                    })),
                  ],
                },
              ]
            : []),
          {
            name: "field",
            label: "Field",
            value: field || "all",
            options: [
              { value: "all", label: "All Fields" },
              { value: "id", label: "Learning Objective ID" },
              { value: "text", label: "Text" },
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
        emptyMessage="No Learning Objectives found"
        query={q}
        correctedQuery={firstPage.correctedQuery}
        onLoadMore={loadMore}
        columns={[
          {
            header: "LO",
            className: "w-32",
            render: (lo) => (
              <Link
                to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
                params={{ questionBank, learningObjectiveId: lo.id }}
                className="text-accent"
              >
                <Highlight>{lo.id}</Highlight>
              </Link>
            ),
          },
          {
            header: "Description",
            render: (lo) => <Markdown>{lo.text}</Markdown>,
          },
          {
            header: "Source",
            className: "w-56",
            render: (lo) => <Markdown>{lo.source}</Markdown>,
          },
          {
            header: "Courses",
            className: "w-56",
            render: (lo) => (
              <div className="flex flex-wrap gap-1">
                {visibleCourses(lo.courses).map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-rule px-2 py-0.5 text-[11px]"
                  >
                    {courseNames[id] ?? id}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: "Questions",
            className: "w-28 text-right",
            render: (lo) => lo.numberOfQuestions,
          },
        ]}
        renderCard={(lo) => (
          <div className="flex flex-col gap-1">
            <Link
              to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
              params={{ questionBank, learningObjectiveId: lo.id }}
              className="text-[13px] font-semibold text-accent"
            >
              {lo.id}
            </Link>
            <span className="text-[10px] text-muted">
              {lo.courses.map((id) => courseNames[id] ?? id).join(", ")}
            </span>
            <span className="text-[10px] text-muted">
              Number of Questions {lo.numberOfQuestions}
            </span>
            <div className="max-h-28 overflow-hidden text-xs [mask-image:linear-gradient(to_bottom,black_50%,transparent)]">
              <Markdown>{lo.text}</Markdown>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/learning-objectives/",
)({
  validateSearch: z.object({
    q: z.string().optional(),
    subject: z.string().optional(),
    course: z.string().optional(),
    field: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const [firstPage, courses] = await Promise.all([
      fetchLearningObjectives({
        data: {
          questionBank: params.questionBank,
          query: deps.q,
          subject: deps.subject,
          course: deps.course,
          field:
            deps.field === "id" || deps.field === "text" ? deps.field : "all",
        },
      }),
      fetchCourses({ data: { questionBank: params.questionBank } }),
    ]);
    return { firstPage, courses };
  },
  component: LearningObjectivesPage,
});
