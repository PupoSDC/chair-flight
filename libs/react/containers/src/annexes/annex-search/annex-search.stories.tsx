import { trpcMsw } from "@chair-flight/trpc/mock";
import { AnnexSearch } from "./annex-search";
import { mockData, mockSearchData } from "./annex-search.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof AnnexSearch>;

export const Playground: Story = {};

const meta: Meta<typeof AnnexSearch> = {
  title: "Containers/Annexes/AnnexSearch",
  component: AnnexSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    sx: { height: 500 },
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.containers.annexes.getAnnexSearch.query(() => mockData),
        trpcMsw.common.search.searchAnnexes.query(() => mockSearchData),
      ],
    },
  },
};

export default meta;
