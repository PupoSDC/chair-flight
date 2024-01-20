import { TestSearch } from "./test-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestSearch>;

export const Playground: Story = {};

const meta: Meta<typeof TestSearch> = {
  title: "Containers/Test/TestSearch",
  component: TestSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    docs: {
      story: {
        height: "500px",
      },
    },
    msw: {
      handlers: [],
    },
  },
};

export default meta;
