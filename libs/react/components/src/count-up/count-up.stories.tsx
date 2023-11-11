import { CountUp } from "./count-up";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof CountUp>;

export const Playground: Story = {};

const meta: Meta<typeof CountUp> = {
  title: "Components/CountUp",
  component: CountUp,
  tags: ["autodocs"],
  args: {
    end: 10000,
    duration: 5000,
  },
};

export default meta;
