import { BackgroundFadedImage } from "./background-faded-image";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BackgroundFadedImage>;

export const Playground: Story = {};

const meta: Meta<typeof BackgroundFadedImage> = {
  title: "Components/BackgroundFadedImage",
  component: BackgroundFadedImage,
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
  args: {
    img: "testCreation",
  },
};

export default meta;
