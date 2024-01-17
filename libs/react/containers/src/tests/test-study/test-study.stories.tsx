import { useEffect } from "react";
import { mockTest } from "@chair-flight/trpc/mock";
import { useTestProgress } from "../hooks/use-test-progress";
import { TestStudy } from "./test-study";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestStudy>;

export const Playground: Story = {};

const meta: Meta<typeof TestStudy> = {
  title: "Containers/Test/TestStudy",
  component: TestStudy,
  tags: ["autodocs"],
  args: {
    testId: mockTest.id,
  },
  argTypes: {
    testId: { disable: true },
  },
  parameters: {
    layout: "fullscreen",
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
