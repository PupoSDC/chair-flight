import { trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionStandAlone } from "./question-stand-alone";
import { mockData } from "./question-stand-alone.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionStandAlone>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionStandAlone> = {
  title: "Containers/Questions/QuestionStandAlone",
  component: QuestionStandAlone,
  tags: ["autodocs"],
  args: {
    questionId: "Q00YQLC8JS",
    questionBank: "atpl",
    seed: "seed",
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
    seed: {
      control: "select",
      options: ["example-seed"],
    },
  },
  parameters: {
    msw: [
      trpcMsw.containers.questions.getQuestionStandAlone.query(() => mockData),
    ],
  },
};

export default meta;
