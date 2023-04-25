import { generateQuestionsForNavigation } from "../__utils__/generate-questions-for-navigation";
import { TestQuestionNavigation } from "./test-question-navigation";
import type { TestQuestionNavigationProps } from "./test-question-navigation";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestQuestionNavigation>;

export const Playground: Story = {
  args: {
    status: "in-progress",
    loading: false,
    questions:
      "20 questions" as unknown as TestQuestionNavigationProps["questions"],
    currentId: "13",
    sx: {
      width: "230px",
      height: "700px",
    },
  },
  argTypes: {
    questions: {
      defaultValue: "20 questions",
      options: [
        "20 questions",
        "40 questions",
        "100 questions",
        "1000 questions",
      ],
      mapping: {
        "20 questions": generateQuestionsForNavigation(20, 15),
        "40 questions": generateQuestionsForNavigation(40, 27),
        "100 questions": generateQuestionsForNavigation(100, 70),
        "1000 questions": generateQuestionsForNavigation(1000, 565),
      },
    },
  },
};

const meta: Meta<typeof TestQuestionNavigation> = {
  title: "Components/TestQuestionNavigation",
  component: TestQuestionNavigation,
  tags: ["autodocs"],
};

export default meta;
