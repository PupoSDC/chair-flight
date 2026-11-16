import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import { Button } from "../../libs/ui/components/base/button";
import { Wordmark } from "../../libs/ui/components/base/wordmark";
import { TestReview } from "../../libs/ui/components/tests/test-review";
import { useTest } from "../../libs/ui/hooks/use-test";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const TestReviewPage: FC = () => {
  const { testId } = Route.useParams();
  const navigate = useNavigate();
  const { test, clearTest } = useTest();

  if (!test || test.id !== testId) {
    return (
      <p className="p-10 text-center text-sm text-muted">
        Test not found.{" "}
        <Link to="/modules" className="text-accent">
          Back to modules
        </Link>
      </p>
    );
  }

  if (test.status !== "finished") {
    return <Navigate to="/test/$testId" params={{ testId }} replace />;
  }

  return (
    <div className="flex h-dvh flex-col bg-canvas text-ink">
      <header
        className={cn(
          "flex h-12 flex-none items-center gap-4 border-b border-rule",
          "bg-paper px-4",
        )}
      >
        <Wordmark />
        <span className="flex-1" />
        <Button
          onClick={async () => {
            await navigate({ to: `/modules/${test.questionBank}` });
            clearTest();
          }}
        >
          Close review
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
        <TestReview test={test} />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(test)/test/$testId/review")({
  ssr: false,
  head: () => ({ meta: [{ title: "Test review · Chair Flight" }] }),
  component: TestReviewPage,
});
