import { TestExam } from "./test-exam";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestExam>;

export const Playground: Story = {};

const meta: Meta<typeof TestExam> = {
  title: "Containers/Test/TestExam",
  component: TestExam,
  tags: ["autodocs"],
  argTypes: {
    testId: { control: false },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    /**
    (Story) => {
      const testId = mockTest.id;
      const addTest = useTestProgress((state) => state.addTest);
      const test = useTestProgress((s) => s.tests[testId]);
      useEffect(() => addTest({ test: mockTest }), [addTest]);
      return test ? <Story /> : <>Loading...</>;
    },
  */
  ],
};

export default meta;
