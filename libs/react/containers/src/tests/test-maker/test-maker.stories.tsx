import { mockSubjects, mockTest, trpcMsw } from "@chair-flight/trpc/mock";
import { TestMaker } from "./test-maker";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestMaker>;

export const Playground: Story = {};

const meta: Meta<typeof TestMaker> = {
  title: "Containers/Test/TestMaker",
  component: TestMaker,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    sx: { p: 4 },
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.questionBank.getAllSubjects.query(() => ({
          subjects: mockSubjects,
        })),
        trpcMsw.tests.createTest.mutation(() => ({
          test: mockTest,
        })),
      ],
    },
  },
};

export default meta;
