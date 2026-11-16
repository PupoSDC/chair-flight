import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import { TestRunner } from "../../libs/ui/components/tests/test-runner";
import { useTest } from "../../libs/ui/hooks/use-test";
import type { FC } from "react";

const TestPage: FC = () => {
  const { testId } = Route.useParams();
  const navigate = useNavigate();
  const { test, saveTest } = useTest();

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

  if (test.status === "finished") {
    return <Navigate to="/test/$testId/review" params={{ testId }} replace />;
  }

  return (
    <TestRunner
      test={test}
      onChange={saveTest}
      onExit={() => navigate({ to: `/modules/${test.questionBank}` })}
    />
  );
};

export const Route = createFileRoute("/(test)/test/$testId/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Test · Chair Flight" }] }),
  component: TestPage,
});
