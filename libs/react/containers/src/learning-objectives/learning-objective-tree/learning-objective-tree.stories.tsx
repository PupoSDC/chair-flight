import {
  questionBankLoSearchGetSearchConfig,
  questionBankLoSearchSearchLearningObjectivesMock,
  trpcMsw,
} from "@chair-flight/trpc/mock";
import { LearningObjectiveTree } from "./learning-objective-tree";
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
        trpcMsw.questionBankLoSearch.getLearningObjectiveTree.query(
          () => questionBankLoSearchSearchLearningObjectivesMock,
        ),
        trpcMsw.questionBankLoSearch.getSearchConfigFilters.query(
          () => questionBankLoSearchGetSearchConfig,
        ),
      ],
    },
  },
};

export default meta;
