import { ImageWithModal } from "./image-with-modal";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ImageWithModal>;

const prefix =
  "https://www.chair-flight.com/content/content-question-bank-atpl/media";

export const Playground: Story = {
  args: {
    href: "image 1",
    width: 200,
    height: 200,
  },
  argTypes: {
    href: {
      defaultValue: "image 1",
      options: ["image 1", "image 2", "image 3", "image 4"],
      mapping: {
        "image 1": `${prefix}/facd988e59bbec4bfd2c2ab4427a45ed.jpg`,
        "image 2": `${prefix}/ede35b3c1eb70d78a1ed95c8d1410148.jpg`,
        "image 3": `${prefix}/eb38917314ded07e0c84adfe1a2c84c1.jpg`,
        "Not Found Image": `${prefix}/potato.jpg`,
      },
      control: {
        type: "select",
      },
    },
  },
};

const meta: Meta<typeof ImageWithModal> = {
  title: "Components/ImageWithModal",
  component: ImageWithModal,
  tags: ["autodocs"],
};

export default meta;
