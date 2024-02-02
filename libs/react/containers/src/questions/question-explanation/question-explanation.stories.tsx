import { trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionExplanation } from "./question-explanation";
import { mockData } from "./question-explanation.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionExplanation>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionExplanation> = {
  title: "Containers/Questions/QuestionExplanation",
  component: QuestionExplanation,
  tags: ["autodocs"],
  args: {
    questionId: "Q00YQLC8JS",
    questionBank: "atpl",
  },
  argTypes: {
    questionId: {
      control: "select",
      options: ["Q00YQLC8JS"],
    },
    questionBank: {
      control: "select",
      options: ["atpl"],
    },
  },
  parameters: {
    msw: [
      trpcMsw.containers.questions.getQuestionExplanation.query(() => mockData),
    ],
  },
};

export default meta;
