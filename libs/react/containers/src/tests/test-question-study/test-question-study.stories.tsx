import { useEffect } from "react";
import { mockTest } from "@chair-flight/trpc/mock";
import { useTestProgress } from "../use-test-progress";
import { TestQuestionStudy } from "./test-question-study";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestQuestionStudy>;

export const Playground: Story = {};

const meta: Meta<typeof TestQuestionStudy> = {
  title: "Containers/Test/TestQuestionStudy",
  component: TestQuestionStudy,
  tags: ["autodocs"],
  args: {
    testId: mockTest.id,
  },
  argTypes: {
    testId: {
      // disable control
    },
  },
  decorators: [
    (Story) => {
      const testId = mockTest.id;
      const addTest = useTestProgress((state) => state.addTest);
      const test = useTestProgress((s) => s.tests[testId]);
      useEffect(() => addTest({ test: mockTest }), [addTest]);
      return test ? <Story /> : <>Loading...</>;
    },
  ],
};

export default meta;
