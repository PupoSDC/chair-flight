import { mockSearchLearningObjectivesData } from "../../__mocks__/search-learning-objectives";
import { LearningObjectiveList } from "./learning-objective-list";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectiveList>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectiveList> = {
  title: "Components/LearningObjectiveList",
  component: LearningObjectiveList,
  tags: ["autodocs"],
  args: {
    loading: false,
    error: false,
    forceMode: undefined,
    items: mockSearchLearningObjectivesData.items,
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  argTypes: {},
};

export default meta;
