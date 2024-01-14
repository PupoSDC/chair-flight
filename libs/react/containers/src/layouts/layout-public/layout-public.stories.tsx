import { LayoutPublic } from "./layout-public";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LayoutPublic>;

export const Playground: Story = {};

const meta: Meta<typeof LayoutPublic> = {
  title: "Containers/Layouts/LayoutPublic",
  component: LayoutPublic,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
};

export default meta;
