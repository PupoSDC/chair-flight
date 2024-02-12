import { mockRetrieveQuestionsData } from "../../__mocks__/search-questions";
import { QuestionList } from "./question-list";
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
    items: mockRetrieveQuestionsData.items,
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  argTypes: {},
};

export default meta;
