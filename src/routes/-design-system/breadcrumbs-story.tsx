import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { cn } from "../../libs/ui/utils/cn";
import { STORY_LINK, StoryBlock } from "./story-block";
import type { FC } from "react";

export const BreadcrumbsStory: FC = () => (
  <div className="flex max-w-2xl flex-col gap-6">
    <StoryBlock
      title="Trail"
      note="The last crumb has no link: it is the current page."
    >
      <div
        className={cn(
          "flex h-12 items-center rounded-lg border border-rule bg-paper",
          "px-4",
        )}
      >
        <Breadcrumbs
          items={[
            { label: "737", link: STORY_LINK },
            { label: "Student notes", link: STORY_LINK },
            { label: "Hydraulics" },
          ]}
        />
      </div>
    </StoryBlock>
    <StoryBlock title="Single crumb">
      <div
        className={cn(
          "flex h-12 items-center rounded-lg border border-rule bg-paper",
          "px-4",
        )}
      >
        <Breadcrumbs items={[{ label: "Backoffice", link: STORY_LINK }]} />
      </div>
    </StoryBlock>
  </div>
);
