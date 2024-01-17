import { mockQuestionSearchItems, trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionSearch } from "./question-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionSearch>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionSearch> = {
  title: "Containers/Questions/QuestionSearch",
  component: QuestionSearch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
    },
    msw: {
      handlers: [
        trpcMsw.questionBank.getNumberOfQuestions.query(() => ({ count: 123 })),
        trpcMsw.questionBank.searchQuestions.query(() => {
          const items = mockQuestionSearchItems;

          return {
            items,
            nextCursor: 20,
            totalResults: items.length,
          };
        }),
      ],
    },
  },
};

export default meta;
