import { trpcMsw } from "@chair-flight/trpc/mock";
import { BlogPost } from "./blog-post";
import { mockData } from "./blog-post.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BlogPost>;

export const Playground: Story = {};

const meta: Meta<typeof BlogPost> = {
  title: "Containers/Blog/BlogPost",
  component: BlogPost,
  tags: ["autodocs"],
  args: {
    postId: "potato",
  },
  argTypes: {
    postId: { control: false },
  },
  parameters: {
    msw: {
      handlers: [trpcMsw.containers.blog.getBlogPost.query(() => mockData)],
    },
  },
};

export default meta;
