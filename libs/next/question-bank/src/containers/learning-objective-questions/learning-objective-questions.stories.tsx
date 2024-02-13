import { trpcMsw } from "@chair-flight/trpc/mock";
import { mockRetrieveQuestionsData } from "../../__mocks__/search-questions";
import { LearningObjectiveQuestions } from "./learning-objective-questions";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectiveQuestions>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectiveQuestions> = {
  title: "Containers/LearningObjectives/LearningObjectiveQuestions",
  component: LearningObjectiveQuestions,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    learningObjectiveId: "010",
    forceMode: undefined,
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.containers.learningObjectives.getLearningObjectiveQuestions.query(
          () => mockRetrieveQuestionsData,
        ),
      ],
    },
  },
};

export default meta;
