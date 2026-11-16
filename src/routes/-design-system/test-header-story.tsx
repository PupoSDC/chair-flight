import { useState } from "react";
import { formatMillisecondsAsClock } from "../../libs/base/format-values";
import { TestHeader } from "../../libs/ui/components/tests/test-header";
import { STORY_TEST_IN_PROGRESS } from "./fixtures";
import type { FC } from "react";

export const TestHeaderStory: FC = () => {
  const [index, setIndex] = useState(2);
  const [lastAction, setLastAction] = useState("none");
  const test = STORY_TEST_IN_PROGRESS;

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-rule">
        <TestHeader
          title={test.title}
          index={index}
          total={test.questions.length}
          clock={formatMillisecondsAsClock(
            test.durationInMs - test.timeSpentInMs,
          )}
          showMeta
          onPrevious={() => setIndex(Math.max(0, index - 1))}
          onNext={() =>
            setIndex(Math.min(test.questions.length - 1, index + 1))
          }
          onOpenMeta={() => setLastAction("open meta")}
          onOpenNavigation={() => setLastAction("open navigation")}
          onFinish={() => setLastAction("finish")}
        />
      </div>
      <p className="m-0 text-xs text-muted">Last action: {lastAction}</p>
    </div>
  );
};
