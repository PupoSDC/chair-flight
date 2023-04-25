import { QuestionMultipleChoice } from "../question-multiple-choice/question-multiple-choice";
import { Playground as QuestionMultipleChoicePlayground } from "../question-multiple-choice/question-multiple-choice.stories";
import { QuestionBoxExam } from "./question-box-exam";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionBoxExam>;

export const Playground: Story = {
  args: {
    question: "multiple-choice" as unknown as JSX.Element,
    title: "Question 23",
    timeSpentInMs: 365,
    timeTotalInMs: 1200,
    questionIndex: 12,
    totalQuestions: 40,
  },
};

const meta: Meta<typeof QuestionBoxExam> = {
  title: "Components/QuestionBoxExam",
  component: QuestionBoxExam,
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
