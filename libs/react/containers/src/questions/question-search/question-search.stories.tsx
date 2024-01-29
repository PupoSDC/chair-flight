import { trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionSearch } from "./question-search";
import { mockData, mockSearchData } from "./question-search.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionSearch>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionSearch> = {
  title: "Containers/Questions/QuestionSearch",
  component: QuestionSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    forceMode: "mobile",
    sx: { height: 500, overflowY: "scroll" },
  },
  argTypes: {
    questionBank: { control: false },
    sx: { control: false },
    component: { control: false },
    forceMode: {
      options: ["mobile", "desktop"],
      control: { type: "radio" },
    },
  },
  parameters: {
    docs: {
      story: {
        height: "300px",
      },
    },
    msw: {
      handlers: [
        trpcMsw.containers.questions.getQuestionSearch.query(() => mockData),
        trpcMsw.common.search.searchQuestions.query(() => mockSearchData),
      ],
    },
  },
};

export default meta;
