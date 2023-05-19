import { TestQuestionResult } from "./test-question-result";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestQuestionResult>;

export const Playground: Story = {
  args: {
    correct: false,
    title: "Question 5",
    question: "what is the capital of France?",
    correctOption: "Paris",
    selectedOption: "Berlin",
    learningObjectives: ["010.03.01.01"],
  },
  argTypes: {},
};

const meta: Meta<typeof TestQuestionResult> = {
  title: "Components/TestQuestionResult",
  component: TestQuestionResult,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
