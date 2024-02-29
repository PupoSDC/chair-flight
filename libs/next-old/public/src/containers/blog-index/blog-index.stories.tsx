import { trpcMsw } from "@cf/trpc/mock";
import { BlogIndex } from "./blog-index";
import { mockData } from "./blog-index.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BlogIndex>;

export const Playground: Story = {};

const meta: Meta<typeof BlogIndex> = {
  title: "Containers/Blog/BlogIndex",
  component: BlogIndex,
  tags: ["autodocs"],
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    msw: {
      handlers: [trpcMsw.containers.blog.getBlogIndex.query(() => mockData)],
    },
  },
};

export default meta;
