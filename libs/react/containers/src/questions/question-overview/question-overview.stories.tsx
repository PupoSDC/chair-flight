import { questionBankGetQuestionMock, trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionOverview } from "./question-overview";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionOverview>;

export const Playground: Story = {
  args: {
    questionId: "Q00YQLC8JS",
  },
};

const meta: Meta<typeof QuestionOverview> = {
  title: "Containers/Questions/QuestionOverview",
  component: QuestionOverview,
  tags: ["autodocs"],
  argTypes: {
    questionId: {
      control: "select",
      options: ["Q00YQLC8JS"],
    },
    variantId: {
      control: "select",
      options: [undefined],
    },
    seed: {
      control: "select",
      options: [undefined],
    },
  },
  parameters: {
    msw: [
      trpcMsw.questionBank.getQuestion.query(() => questionBankGetQuestionMock),
    ],
  },
};

export default meta;
