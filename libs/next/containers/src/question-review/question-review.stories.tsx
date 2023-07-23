import { QuestionReview } from "./question-review";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionReview>;

export const Playground: Story = {
  args: {
    title: "multiple-choice",
    questionId: "123",
    variantId: "123",
    seed: "123",
    onNavigateToVariant: () => {},
  },
};

const meta: Meta<typeof QuestionReview> = {
  title: "Containers/QuestionReview",
  component: QuestionReview,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
