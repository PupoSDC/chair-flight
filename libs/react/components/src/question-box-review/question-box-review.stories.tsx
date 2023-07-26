import { default as dedent } from "ts-dedent";
import { QuestionMultipleChoice } from "../question-multiple-choice/question-multiple-choice";
import { Playground as QuestionMultipleChoicePlayground } from "../question-multiple-choice/question-multiple-choice.stories";
import { QuestionBoxReview } from "./question-box-review";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionBoxReview>;

export const Playground: Story = {
  args: {
    question: "multiple-choice" as unknown as JSX.Element,
    disableAllButQuestion: false,
    explanation: dedent`
      Paris is indeed the capital of paris

      # This supports markdown

      Because markdown is **cool**. Also^superscript!^
    `,
  },
};

const meta: Meta<typeof QuestionBoxReview> = {
  title: "Components/QuestionBoxReview",
  component: QuestionBoxReview,
  tags: ["autodocs"],
  argTypes: {
    question: {
      options: ["multiple-choice"],
      control: { type: "radio" },
      mapping: {
        "multiple-choice": (
          <QuestionMultipleChoice {...QuestionMultipleChoicePlayground.args} />
        ),
      },
    },
  },
};

export default meta;
