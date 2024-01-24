import {
  trpcMsw,
  questionBankAnnexSearchGetSearchConfigMock,
  questionBankAnnexSearchSearchAnnexesMock,
} from "@chair-flight/trpc/mock";
import { AnnexSearch } from "./annex-search";
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
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.questionBankAnnexSearch.getSearchConfigFilters.query(
          () => questionBankAnnexSearchGetSearchConfigMock,
        ),
        trpcMsw.questionBankAnnexSearch.searchAnnexes.query(
          () => questionBankAnnexSearchSearchAnnexesMock,
        ),
      ],
    },
  },
};

export default meta;
