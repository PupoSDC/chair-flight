import {
  mockQuestionSearchItems,
  mockSubjects,
  trpcMsw,
} from "@chair-flight/trpc/mock";
import { QuestionSearch } from "./question-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionSearch>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionSearch> = {
  title: "Containers/Questions/QuestionSearch",
  component: QuestionSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    docs: {
      story: {
        height: "300px",
      },
    },
    msw: {
      handlers: [
        trpcMsw.questionBank.getAllSubjects.query(() => ({
          subjects: mockSubjects,
        })),
        trpcMsw.questionBankQuestionSearch.searchQuestions.query(() => ({
          items: mockQuestionSearchItems,
          nextCursor: 20,
          totalResults: mockQuestionSearchItems.length,
        })),
      ],
    },
  },
};

export default meta;
