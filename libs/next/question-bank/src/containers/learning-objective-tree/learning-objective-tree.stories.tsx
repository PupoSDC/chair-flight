import { trpcMsw } from "@chair-flight/trpc/mock";
import { LearningObjectiveTree } from "./learning-objective-tree";
import { mockData } from "./learning-objective-tree.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectiveTree>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectiveTree> = {
  title: "Containers/LearningObjectives/LearningObjectiveTree",
  component: LearningObjectiveTree,
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
        trpcMsw.containers.learningObjectives.getLearningObjectiveTree.query(
          () => mockData,
        ),
      ],
    },
  },
};

export default meta;
