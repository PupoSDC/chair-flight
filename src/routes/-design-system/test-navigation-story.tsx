import { useState } from "react";
import { Card } from "../../libs/ui/components/base/card";
import { TestNavigation } from "../../libs/ui/components/tests/test-navigation";
import { STORY_TEST_IN_PROGRESS } from "./fixtures";
import type { FC } from "react";

export const TestNavigationStory: FC = () => {
  const [test, setTest] = useState(STORY_TEST_IN_PROGRESS);

  return (
    <Card className="max-w-md">
      <TestNavigation
        test={test}
        onSelect={(index) => setTest({ ...test, currentQuestionIndex: index })}
        onFinish={() => {}}
      />
    </Card>
  );
};
