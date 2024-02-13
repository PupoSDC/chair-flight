import { trpcMsw } from "@cf/trpc/mock";
import { DocSearch } from "./doc-search";
import { mockData, mockSearchData } from "./doc-search.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof DocSearch>;

export const Playground: Story = {};

const meta: Meta<typeof DocSearch> = {
  title: "Containers/Docs/DocSearch",
  component: DocSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    docs: {
      story: {
        height: "300px",
      },
    },
    msw: {
      handlers: [
        trpcMsw.containers.docs.getDocSearch.query(() => mockData),
        trpcMsw.common.search.searchDocs.query(() => mockSearchData),
      ],
    },
  },
};

export default meta;
