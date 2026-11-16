import { ModuleTitle } from "../../libs/ui/components/base/module-title";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const ModuleTitleStory: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <StoryBlock title="With subtitle">
        <ModuleTitle title="ATPL" subtitle="EASA ECQB 2026" />
      </StoryBlock>
      <StoryBlock title="Without subtitle">
        <ModuleTitle title="737" />
      </StoryBlock>
    </div>
  );
};
