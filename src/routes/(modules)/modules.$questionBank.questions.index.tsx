import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { z } from "zod";
import { SearchHeader } from "../../libs/ui/components/base/search-header";
import { QuestionsTable } from "../../libs/ui/components/question-bank/questions-table";
import { fetchQuestions } from "../-server-functions/question-bank/fetch-questions";
import type { FC } from "react";

const MODULE_ROUTE = getRouteApi("/(modules)/modules/$questionBank");

const QuestionsPage: FC = () => {
  const { questionBank } = Route.useParams();
  const { q = "", subject = "", field = "" } = Route.useSearch();
  const firstPage = Route.useLoaderData();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        placeholder="Search Questions..."
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
              { value: "id", label: "Question ID" },
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
      <QuestionsTable
        questionBank={questionBank}
        filters={{ query: q, subject, field }}
        firstPage={firstPage}
      />
    </div>
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/questions/",
)({
  validateSearch: z.object({
    q: z.string().optional(),
    subject: z.string().optional(),
    field: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) =>
    fetchQuestions({
      data: {
        questionBank: params.questionBank,
        query: deps.q,
        subject: deps.subject,
        field:
          deps.field === "id" || deps.field === "text" ? deps.field : "all",
      },
    }),
  component: QuestionsPage,
});
