import {
  questionBankQuestionSearchGetSearchConfigFiltersMock,
  questionBankQuestionSearchSearchQuestionsMock,
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
        trpcMsw.questionBankQuestionSearch.getSearchConfigFilters.query(
          () => questionBankQuestionSearchGetSearchConfigFiltersMock,
        ),
        trpcMsw.questionBankQuestionSearch.searchQuestions.query(
          () => questionBankQuestionSearchSearchQuestionsMock,
        ),
      ],
    },
  },
};

export default meta;
