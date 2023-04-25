import { TestQuestionResult } from "./test-question-result";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestQuestionResult>;

export const Playground: Story = {
  args: {
    questionId: "12412412",
    questionIndex: 5,
    correct: false,
    question: "what is the capital of France?",
    correctOptions: "Paris",
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
