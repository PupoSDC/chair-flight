import { mockQuestion, trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionEditor } from "./question-editor";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionEditor>;

export const BasePage: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit",
        query: {
          questionId: "Q00YQLC8JS",
        },
      },
    },
  },
};

export const VariantSimpleEditor: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit?variantId=Cy1C8vfr",
        query: {
          questionId: "Q00YQLC8JS",
          variantId: "Cy1C8vfr",
        },
      },
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
};

export const VariantOneTwoEditor: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit?variantId=WEC930Kb",
        query: {
          questionId: "WEC930Kb",
          variantId: "WEC930Kb",
        },
      },
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
};

const meta: Meta<typeof QuestionEditor> = {
  title: "Containers/Questions/QuestionEditor",
  component: QuestionEditor,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    questionId: "WEC930Kb",
  },
  argTypes: {
    questionBank: { control: false },
    questionId: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.questionBank.getQuestionFromGithub.query(() => ({
          questionTemplate: mockQuestion,
        })),
        trpcMsw.questionBank.searchLearningObjectives.query(() => ({
          items: [],
          totalResults: 0,
          nextCursor: -1,
        })),
      ],
    },
  },
};

export default meta;
