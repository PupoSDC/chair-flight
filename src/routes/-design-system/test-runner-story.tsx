import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { TestRunner } from "../../libs/ui/components/tests/test-runner";
import { STORY_TEST_IN_PROGRESS } from "./fixtures";
import type { FC } from "react";

export const TestRunnerStory: FC = () => {
  const [test, setTest] = useState(STORY_TEST_IN_PROGRESS);
  const [running, setRunning] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-muted">
        The runner fills the viewport, so it opens on top of this page.
      </p>
      <div>
        <Button onClick={() => setRunning(true)}>Open test runner</Button>
      </div>
      {running && (
        <div className="fixed inset-0 z-50 bg-canvas">
          <TestRunner
            test={test}
            onChange={setTest}
            onExit={() => setRunning(false)}
          />
        </div>
      )}
    </div>
  );
};
