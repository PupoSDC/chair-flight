import { Skeleton } from "./skeleton";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {
  args: {
    sx: { width: "100%", height: "2em", my: 1 },
  },
  argTypes: {},
  render: (args) => (
    <>
      <h1>Potato</h1>
      <Skeleton {...args} />
      <Skeleton {...args} />
      <Skeleton {...args} />
      <Skeleton {...args} />
    </>
  ),
};

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
