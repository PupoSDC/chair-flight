import { SearchQuery } from "./search-query";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SearchQuery>;

export const Playground: Story = {};

const meta: Meta<typeof SearchQuery> = {
  title: "Components/SearchQuery",
  component: SearchQuery,
  tags: ["autodocs"],
};

export default meta;
