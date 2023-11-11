import { Stack } from "@mui/joy";
import { BlogPostChip } from "./blog-post-chip";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BlogPostChip>;

export const Playground: Story = {};

export const Overview: Story = {
  render: ({ sx, tag, ...other }) => (
    <Stack>
      <BlogPostChip {...other} sx={{ my: 1 }} tag="Technical" />
      <BlogPostChip {...other} sx={{ my: 1 }} tag="Feature" />
      <BlogPostChip {...other} sx={{ my: 1 }} tag="Content" />
    </Stack>
  ),
};

const meta: Meta<typeof BlogPostChip> = {
  title: "Components/BlogPostChip",
  component: BlogPostChip,
  tags: ["autodocs"],
  args: {
    tag: "Technical",
  },
};

export default meta;
