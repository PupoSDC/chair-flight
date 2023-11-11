import { AppLogo } from "./app-logo";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof AppLogo>;

export const Playground: Story = {};

const meta: Meta<typeof AppLogo> = {
  title: "Components/AppLogo",
  component: AppLogo,
  tags: ["autodocs"],
};

export default meta;
