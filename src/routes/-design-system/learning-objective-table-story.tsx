import { LearningObjectiveTable } from "../../libs/ui/components/question-bank/learning-objective-table";
import {
  STORY_LEARNING_OBJECTIVE_COURSES,
  STORY_LEARNING_OBJECTIVES,
} from "./fixtures";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const LearningObjectiveTableStory: FC = () => (
  <div className="flex flex-col gap-8">
    <StoryBlock title="Default">
      <div className="h-96">
        <LearningObjectiveTable
          items={STORY_LEARNING_OBJECTIVES}
          query=""
          courses={STORY_LEARNING_OBJECTIVE_COURSES}
        />
      </div>
    </StoryBlock>
    <StoryBlock title="Comparison">
      <div className="h-96">
        <LearningObjectiveTable
          items={STORY_LEARNING_OBJECTIVES.map((item, index) => ({
            ...item,
            change: ["reworded", "added", "removed", "courses"][index - 3],
            previous:
              index === 3
                ? {
                    id: item.id,
                    text: "Describe the atmosphere.",
                    items: [],
                    courses: item.courses,
                  }
                : null,
          }))}
          query=""
          courses={STORY_LEARNING_OBJECTIVE_COURSES}
        />
      </div>
    </StoryBlock>
    <StoryBlock title="Loading">
      <div className="h-96">
        <LearningObjectiveTable
          loading
          items={[]}
          query=""
          courses={STORY_LEARNING_OBJECTIVE_COURSES}
        />
      </div>
    </StoryBlock>
  </div>
);
