import { dedent } from "ts-dedent";
import { MarkdownClient } from "./markdown-client";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof MarkdownClient>;

export const Playground: Story = {
  args: {
    children: dedent`
      # Hello, world!  

      This component allows you to add markdown to pretty much anything you want.
      It supports GFM features like Emoji :bowtie: :kissing_smiling_eyes: :zzz: :notes:
    `,
  },
  argTypes: {
    children: {
      type: "string",
    },
  },
};

const meta: Meta<typeof MarkdownClient> = {
  title: "Components/MarkdownClient",
  component: MarkdownClient,
  tags: ["autodocs"],
};

export default meta;
