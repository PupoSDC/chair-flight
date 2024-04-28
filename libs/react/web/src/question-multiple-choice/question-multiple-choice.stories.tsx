import { QuestionMultipleChoice } from "./question-multiple-choice";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionMultipleChoice>;

export const Playground: Story = {
  args: {
    question: "What is the capital of France?",
    correctOptionId: "1",
    options: [
      { id: "1", text: "Paris" },
      { id: "2", text: "London" },
      { id: "3", text: "Berlin" },
      { id: "4", text: "Rome" },
    ],
    selectedOptionId: "1",
    status: "in-progress",
  },
};

const meta: Meta<typeof QuestionMultipleChoice> = {
  title: "Components/QuestionMultipleChoice",
  component: QuestionMultipleChoice,
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: ["in-progress", "show-result"],
      control: { type: "radio" },
    },
    selectedOptionId: {
      options: ["1", "2", "3", "4"],
      control: { type: "radio" },
    },
  },
};

export default meta;
