import { ChapterNavigation } from "../../libs/ui/components/question-bank/chapter-navigation";
import { cn } from "../../libs/ui/utils/cn";
import { STORY_CHAPTER_LINK, STORY_CHAPTERS } from "./fixtures";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const ChapterNavigationStory: FC = () => (
  <div className="flex flex-col gap-8">
    <StoryBlock title="Sidebar">
      <div className="w-64 border border-rule bg-paper">
        <ChapterNavigation
          chapters={STORY_CHAPTERS}
          selectedChapterId="03"
          chapterLink={STORY_CHAPTER_LINK}
        />
      </div>
    </StoryBlock>
    <StoryBlock title="Mobile">
      <div className="flex w-sm flex-col border border-rule bg-paper">
        <div className="flex flex-col items-center gap-3 p-8 pb-6">
          <span
            className={cn(
              "bg-gradient-to-b from-ink to-accent bg-clip-text text-8xl",
              "font-bold tracking-tight text-transparent",
            )}
          >
            737
          </span>
          <span
            className={cn(
              "text-xs font-semibold tracking-widest text-accent uppercase",
            )}
          >
            Questions
          </span>
        </div>
        <div className="p-4 pt-0">
          <ChapterNavigation
            chapters={STORY_CHAPTERS}
            chapterLink={STORY_CHAPTER_LINK}
          />
        </div>
      </div>
    </StoryBlock>
  </div>
);
