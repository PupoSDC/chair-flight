import { CtaSearch } from "./cta-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof CtaSearch>;

export const Playground: Story = {};

const meta: Meta<typeof CtaSearch> = {
  title: "Components/CtaSearch",
  component: CtaSearch,
  tags: ["autodocs"],
};

export default meta;
