import { createFileRoute, Link } from "@tanstack/react-router";
import { formatEpochAsDate } from "../../libs/base/format-values";
import { getTestScore } from "../../libs/core/tests/get-test-score";
import { BUTTON_CLASS_NAME } from "../../libs/ui/components/base/button";
import { IconButton } from "../../libs/ui/components/base/icon-button";
import { useTests } from "../../libs/ui/hooks/use-tests";
import { CloseIcon } from "../../libs/ui/icons/close-icon";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const TestsPage: FC = () => {
  const { questionBank } = Route.useParams();
  const { tests, deleteTest } = useTests();
  const bankTests = Object.values(tests)
    .filter((test) => test.questionBank === questionBank)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold">Tests</h1>
        <Link
          to="/modules/$questionBank/tests/create"
          params={{ questionBank }}
          className={BUTTON_CLASS_NAME}
        >
          New test
        </Link>
      </div>
      {bankTests.length === 0 && (
        <p className="p-6 text-center text-sm text-muted">No tests yet</p>
      )}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {bankTests.map((test) => (
          <li
            key={test.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-rule",
              "bg-paper p-3",
            )}
          >
            <Link
              to={
                test.status === "finished"
                  ? "/modules/$questionBank/tests/$testId/review"
                  : "/modules/$questionBank/tests/$testId"
              }
              params={{ questionBank, testId: test.id }}
              className="flex min-w-0 flex-1 flex-col text-ink no-underline"
            >
              <span className="font-semibold capitalize">{test.title}</span>
              <span className="text-xs text-muted">
                {formatEpochAsDate(test.createdAtEpochMs)} ·{" "}
                {test.questions.length} questions
              </span>
            </Link>
            <span className="text-sm font-semibold">
              {test.status === "finished"
                ? `${getTestScore(test).score}%`
                : "In progress"}
            </span>
            <IconButton label="Delete test" onClick={() => deleteTest(test.id)}>
              <CloseIcon />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Route = createFileRoute("/(modules)/modules/$questionBank/tests/")(
  {
    component: TestsPage,
  },
);
