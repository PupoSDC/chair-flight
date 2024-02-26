import { generateQuestionsForNavigation } from "../../__utils__/generate-questions-for-navigation";
import { QuestionNavigation } from "./question-navigation";
import type { QuestionNavigationProps } from "./question-navigation";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionNavigation>;

export const Playground: Story = {
  args: {
    status: "in-progress",
    loading: false,
    questions:
      "20 questions" as unknown as QuestionNavigationProps["questions"],
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

const meta: Meta<typeof QuestionNavigation> = {
  title: "Components/QuestionNavigation",
  component: QuestionNavigation,
  tags: ["autodocs"],
};

export default meta;
