import { trpcMsw } from "@chair-flight/trpc/mock";
import { LearningObjectiveOverview } from "./learning-objective-overview";
import { mockData } from "./learning-objective-overview.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectiveOverview>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectiveOverview> = {
  title: "Containers/LearningObjectives/LearningObjectiveOverview",
  component: LearningObjectiveOverview,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    learningObjectiveId: "010",
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.containers.learningObjectives.getLearningObjectiveOverview.query(
          () => mockData,
        ),
      ],
    },
  },
};

export default meta;
