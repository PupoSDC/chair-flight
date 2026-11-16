import { TestReview } from "../../libs/ui/components/tests/test-review";
import { STORY_TEST_FINISHED } from "./fixtures";
import type { FC } from "react";

const CHAPTERS = [
  { id: "050.01", text: "The atmosphere" },
  { id: "050.02", text: "Wind" },
];

const QUESTION_LEARNING_OBJECTIVES = Object.fromEntries(
  STORY_TEST_FINISHED.questions.map((question, index) => [
    question.templateId,
    [index < 4 ? "050.01.01" : "050.02.01"],
  ]),
);

export const TestReviewStory: FC = () => (
  <div className="overflow-hidden rounded-lg border border-rule">
    <TestReview
      test={STORY_TEST_FINISHED}
      chapters={CHAPTERS}
      questionLearningObjectives={QUESTION_LEARNING_OBJECTIVES}
    />
  </div>
);
