import { QuestionList } from "./question-list";
import { itemsMock } from "./question-list.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionList>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionList> = {
  title: "Components/QuestionList",
  component: QuestionList,
  tags: ["autodocs"],
  args: {
    loading: false,
    error: false,
    forceMode: undefined,
    items: itemsMock,
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  argTypes: {},
};

export default meta;
