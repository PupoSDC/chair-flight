import { TestQuestionResult } from "./test-question-result";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestQuestionResult>;

export const Playground: Story = {
  args: {
    correct: false,
    questionTemplateId: "123124",
    title: "Question 5",
    question: "what is the capital of France?",
    correctOption: "Paris",
    selectedOption: "Berlin",
    learningObjectives: ["010.03.01.01"],
  },
};

export const WithMarkdown: Story = {
  args: {
    ...Playground.args,
    question: "Which option is correct?\n\n- Option a)\n- Option b)",
    correctOption: "**Option B**",
    selectedOption: "Berlin",
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
