import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { TestReview } from "../../libs/ui/components/tests/test-review";
import { useTests } from "../../libs/ui/hooks/use-tests";
import type { FC } from "react";

const TestReviewPage: FC = () => {
  const { questionBank, testId } = Route.useParams();
  const { tests } = useTests();
  const test = tests[testId];

  if (!test) {
    return (
      <p className="p-10 text-center text-sm text-muted">
        Test not found.{" "}
        <Link
          to="/modules/$questionBank/tests"
          params={{ questionBank }}
          className="text-accent"
        >
          Back to tests
        </Link>
      </p>
    );
  }

  if (test.status !== "finished") {
    return (
      <Navigate
        to="/modules/$questionBank/tests/$testId"
        params={{ questionBank, testId }}
        replace
      />
    );
  }

  return <TestReview test={test} />;
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/tests/$testId/review",
)({
  ssr: false,
  component: TestReviewPage,
});
