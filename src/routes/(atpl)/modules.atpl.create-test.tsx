import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { TestMaker } from "../../libs/ui/components/tests/test-maker";
import { TestResumeBanner } from "../../libs/ui/components/tests/test-resume-banner";
import { useTest } from "../../libs/ui/hooks/use-test";
import { startAtplTest } from "../-server-functions/atpl/start-atpl-test";
import type { FC } from "react";
import type { TestMakerConfig } from "../../libs/ui/components/tests/test-maker";

const MODULE_ROUTE = getRouteApi("/(atpl)/modules/atpl");

const AtplCreateTestPage: FC = () => {
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();
  const { test: currentTest, saveTest } = useTest();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createNewTest = async (config: TestMakerConfig) => {
    setSubmitting(true);
    setError("");
    try {
      const test = await startAtplTest({ data: config });
      saveTest(test);
      await navigate({ to: "/test/$testId", params: { testId: test.id } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <TestMaker
      subjects={subjects}
      wide
      submitting={submitting}
      error={error}
      banner={<TestResumeBanner test={currentTest} />}
      onSubmit={createNewTest}
    />
  );
};

export const Route = createFileRoute("/(atpl)/modules/atpl/create-test")({
  staticData: { breadcrumbs: () => [{ label: "Create test" }] },
  component: AtplCreateTestPage,
});
