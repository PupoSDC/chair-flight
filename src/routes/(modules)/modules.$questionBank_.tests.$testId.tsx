import {
  createFileRoute,
  Link,
  Navigate,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { QUESTION_BANK_NAMES } from "../../libs/core/question-bank/question-banks";
import { TestRunner } from "../../libs/ui/components/tests/test-runner";
import { useTests } from "../../libs/ui/hooks/use-tests";
import type { FC } from "react";

const TestPage: FC = () => {
  const { questionBank, testId } = Route.useParams();
  const navigate = useNavigate();
  const { tests, saveTest } = useTests();
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

  if (test.status === "finished") {
    return (
      <Navigate
        to="/modules/$questionBank/tests/$testId/review"
        params={{ questionBank, testId }}
        replace
      />
    );
  }

  return (
    <TestRunner
      test={test}
      onChange={saveTest}
      onExit={() =>
        navigate({
          to: "/modules/$questionBank/tests",
          params: { questionBank },
        })
      }
    />
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank_/tests/$testId",
)({
  ssr: false,
  params: {
    parse: (params) => {
      const questionBank = QUESTION_BANK_NAMES.find(
        (name) => name === params.questionBank,
      );
      if (!questionBank) throw notFound();
      return { ...params, questionBank };
    },
  },
  component: TestPage,
});
