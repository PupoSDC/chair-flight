import { dedent } from "ts-dedent";
import { MarkdownClient } from "./markdown-client";
import { MarkdownClientDemo } from "./markdown-client-demo";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof MarkdownClient>;

const demoMarkdown = dedent`
  # Hello, world!  

  This component allows you to add markdown to pretty much anything you want.
  It supports GFM features like Emoji :bowtie: :kissing_smiling_eyes: :zzz: :notes:
`;

export const Playground: Story = {
  args: {
    children: demoMarkdown,
  },
  argTypes: {
    children: {
      type: "string",
    },
  },
};

export const MarkdownClientDemoStory: Story = {
  name: "MarkdownClientDemo",
  render: () => <MarkdownClientDemo initialMarkdown={demoMarkdown} />,
};

const meta: Meta<typeof MarkdownClient> = {
  title: "Components/MarkdownClient",
  component: MarkdownClient,
  tags: ["autodocs"],
};

export default meta;
