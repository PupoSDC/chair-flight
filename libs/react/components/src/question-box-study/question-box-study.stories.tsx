import { default as dedent } from "ts-dedent";
import { QuestionMultipleChoice } from "../question-multiple-choice/question-multiple-choice";
import { Playground as QuestionMultipleChoicePlayground } from "../question-multiple-choice/question-multiple-choice.stories";
import { QuestionBoxStudy } from "./question-box-study";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionBoxStudy>;

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

const meta: Meta<typeof QuestionBoxStudy> = {
  title: "Components/QuestionBoxStudy",
  component: QuestionBoxStudy,
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
