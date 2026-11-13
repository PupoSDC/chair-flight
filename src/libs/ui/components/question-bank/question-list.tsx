import { Link } from "@tanstack/react-router";
import { fetchQuestions } from "../../../../routes/-server-functions/question-bank/fetch-questions";
import { usePagedItems } from "../../hooks/use-paged-items";
import { cn } from "../../utils/cn";
import { Button } from "../base/button";
import { Markdown } from "../base/markdown";
import type { FC } from "react";
import type { QuestionBankName } from "../../../core/question-bank/question-banks";

export const QuestionList: FC<{
  questionBank: QuestionBankName;
  filters: {
    query?: string;
    subject?: string;
    learningObjective?: string;
    docId?: string;
  };
  firstPage: Awaited<ReturnType<typeof fetchQuestions>>;
}> = ({ questionBank, filters, firstPage }) => {
  const { items, hasMore, loading, loadMore } = usePagedItems(
    firstPage,
    (offset) => fetchQuestions({ data: { questionBank, ...filters, offset } }),
  );

  if (items.length === 0) {
    return <p className="p-6 text-center text-sm text-muted">No questions</p>;
  }

  return (
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
                to="/modules/$questionBank/questions/$questionId"
                params={{ questionBank, questionId: question.id }}
                className="font-semibold text-accent"
              >
                {question.id}
              </Link>
              {question.learningObjectives.slice(0, 4).map((id) => (
                <Link
                  key={id}
                  to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
                  params={{ questionBank, learningObjectiveId: id }}
                  className="text-muted hover:text-accent"
                >
                  {id}
                </Link>
              ))}
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
  );
};
