import { Link } from "@tanstack/react-router";
import { fetchQuestions } from "../../../../routes/-server-functions/question-bank/fetch-questions";
import { usePagedItems } from "../../hooks/use-paged-items";
import { Markdown } from "../base/markdown";
import { Highlight } from "../base/search-highlight";
import { SearchTable } from "../base/search-table";
import { IdLinks } from "./id-links";
import type { FC } from "react";
import type { QuestionBankName } from "../../../core/question-bank/question-banks";
import type { SearchTableColumn } from "../base/search-table";

type Question = Awaited<ReturnType<typeof fetchQuestions>>["items"][number];

export const QuestionsTable: FC<{
  questionBank: QuestionBankName;
  filters: { query: string; subject: string; field: string };
  firstPage: Awaited<ReturnType<typeof fetchQuestions>>;
}> = ({ questionBank, filters, firstPage }) => {
  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) =>
      fetchQuestions({
        data: {
          questionBank,
          query: filters.query,
          subject: filters.subject,
          field:
            filters.field === "id" || filters.field === "text"
              ? filters.field
              : "all",
          offset,
        },
      }),
  );

  const questionLink = (id: string) => (
    <Link
      to="/modules/$questionBank/questions/$questionId"
      params={{ questionBank, questionId: id }}
      className="text-accent"
    >
      <Highlight>{id}</Highlight>
    </Link>
  );

  const columns: SearchTableColumn<Question>[] = [
    {
      header: "ID",
      className: "whitespace-nowrap",
      render: (q) => questionLink(q.id),
    },
    {
      header: "Question",
      className: "w-1/2",
      render: (q) => (
        <Markdown className="max-h-40 overflow-hidden">{q.preview}</Markdown>
      ),
    },
    {
      header: "Learning Objectives",
      className: "whitespace-nowrap",
      render: (q) => (
        <IdLinks
          ids={q.learningObjectives}
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
      header: "Related Questions",
      className: "whitespace-nowrap",
      render: (q) => (
        <IdLinks ids={q.relatedQuestions} renderId={questionLink} />
      ),
    },
    {
      header: "External IDs",
      className: "whitespace-nowrap",
      render: (q) => (
        <IdLinks
          ids={q.externalIds}
          renderId={(id) => <span className="text-muted">{id}</span>}
        />
      ),
    },
  ];

  return (
    <SearchTable
      items={items}
      columns={columns}
      hasMore={hasMore}
      loading={loading}
      emptyMessage="No questions found"
      query={filters.query}
      correctedQuery={firstPage.correctedQuery}
      onLoadMore={loadMore}
      renderCard={(q) => (
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">
            {questionLink(q.id)}
          </span>
          <span className="text-[10px] text-muted">
            {q.learningObjectives.join(", ")}
          </span>
          <div className="max-h-40 overflow-hidden text-xs [mask-image:linear-gradient(to_bottom,black_50%,transparent)]">
            <Markdown>{q.preview}</Markdown>
          </div>
        </div>
      )}
    />
  );
};
