import { Ups } from "./ups";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Ups>;

export const Playground: Story = {
  args: {
    message: "404 Not Found",
  },
};

const meta: Meta<typeof Ups> = {
  title: "Components/Ups",
  component: Ups,
  tags: ["autodocs"],
};

export default meta;
