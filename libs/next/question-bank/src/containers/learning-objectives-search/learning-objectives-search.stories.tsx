import { trpcMsw } from "@chair-flight/trpc/mock";
import { mockSearchLearningObjectivesData } from "../../__mocks__/search-learning-objectives";
import { LearningObjectivesSearch } from "./learning-objectives-search";
import { mockData } from "./learning-objectives-search.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectivesSearch>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectivesSearch> = {
  title: "Containers/LearningObjectives/LearningObjectivesSearch",
  component: LearningObjectivesSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    sx: { height: 500 },
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.containers.learningObjectives.getLearningObjectivesSearch.query(
          () => mockData,
        ),
        trpcMsw.common.search.searchLearningObjectives.query(
          () => mockSearchLearningObjectivesData,
        ),
      ],
    },
  },
};

export default meta;
