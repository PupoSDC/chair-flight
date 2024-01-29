import { TestReview } from "./test-review";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestReview>;

export const Playground: Story = {};

const meta: Meta<typeof TestReview> = {
  title: "Containers/Test/TestReview",
  component: TestReview,
  tags: ["autodocs"],
  argTypes: {
    testId: { disable: true },
  },
  parameters: {
    layout: "fullscreen",
  } /**
  decorators: [
    (Story) => {
      const testId = mockTest.id;
      const addTest = useTestProgress((state) => state.addTest);
      const test = useTestProgress((s) => s.tests[testId]);
      useEffect(() => addTest({ test: mockTest }), [addTest]);
      return test ? <Story /> : <>Loading...</>;
    },
  ], */,
};

export default meta;
