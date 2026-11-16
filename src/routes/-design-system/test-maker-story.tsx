import { useState } from "react";
import { TestMaker } from "../../libs/ui/components/tests/test-maker";
import { cn } from "../../libs/ui/utils/cn";
import { STORY_SUBJECTS } from "./fixtures";
import type { FC } from "react";
import type { TestMakerConfig } from "../../libs/ui/components/tests/test-maker";

export const TestMakerStory: FC = () => {
  const [config, setConfig] = useState<TestMakerConfig>();

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[760px] overflow-hidden rounded-lg border border-rule">
        <TestMaker
          subjects={STORY_SUBJECTS}
          submitting={false}
          error=""
          onSubmit={setConfig}
        />
      </div>
      <pre
        className={cn(
          "m-0 overflow-auto rounded-lg border border-rule bg-paper p-3",
          "text-xs",
        )}
      >
        {config ? JSON.stringify(config, null, 2) : "Submit to see the config"}
      </pre>
    </div>
  );
};
