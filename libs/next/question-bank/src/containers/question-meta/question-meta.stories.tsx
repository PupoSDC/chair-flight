import { trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionMeta } from "./question-meta";
import { mockData } from "./question-meta.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionMeta>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionMeta> = {
  title: "Containers/Questions/QuestionMeta",
  component: QuestionMeta,
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
      options: ["ATPL"],
    },
  },
  parameters: {
    msw: [trpcMsw.containers.questions.getQuestionMeta.query(() => mockData)],
  },
};

export default meta;
