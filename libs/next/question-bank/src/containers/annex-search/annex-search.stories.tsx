import { trpcMsw } from "@cf/trpc/mock";
import { mockSearchAnnexesData } from "../../__mocks__/annex-search";
import { AnnexSearch } from "./annex-search";
import { mockData } from "./annex-search.mock";
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
        trpcMsw.containers.annexes.getAnnexSearch.query(() => {
          return mockData;
        }),
        trpcMsw.common.search.searchAnnexes.query(() => {
          return mockSearchAnnexesData;
        }),
      ],
    },
  },
};

export default meta;
