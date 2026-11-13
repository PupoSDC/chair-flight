import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { TestMaker } from "../../libs/ui/components/tests/test-maker";
import { useTests } from "../../libs/ui/hooks/use-tests";
import { startTest } from "../-server-functions/question-bank/start-test";
import type { FC } from "react";
import type { TestMakerConfig } from "../../libs/ui/components/tests/test-maker";

const MODULE_ROUTE = getRouteApi("/(modules)/modules/$questionBank");

const TestCreatePage: FC = () => {
  const { questionBank } = Route.useParams();
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();
  const { saveTest } = useTests();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createNewTest = async (config: TestMakerConfig) => {
    setSubmitting(true);
    setError("");
    try {
      const test = await startTest({ data: { questionBank, ...config } });
      saveTest(test);
      await navigate({
        to: "/modules/$questionBank/tests/$testId",
        params: { questionBank, testId: test.id },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <TestMaker
      questionBank={questionBank}
      subjects={subjects}
      submitting={submitting}
      error={error}
      onSubmit={createNewTest}
    />
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/tests/create",
)({
  component: TestCreatePage,
});
