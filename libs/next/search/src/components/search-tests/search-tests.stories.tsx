import { SearchTests } from "./search-tests";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SearchTests>;

export const Playground: Story = {};

const meta: Meta<typeof SearchTests> = {
  title: "Containers/Test/SearchTests",
  component: SearchTests,
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
