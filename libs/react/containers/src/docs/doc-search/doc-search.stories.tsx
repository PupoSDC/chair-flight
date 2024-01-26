import {
  questionBankDocSearchGetSearchConfigFiltersMock,
  questionBankDocSearchSearchDocsMock,
  trpcMsw,
} from "@chair-flight/trpc/mock";
import { DocSearch } from "./doc-search";
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
        trpcMsw.questionBankDocSearch.getSearchConfigFilters.query(
          () => questionBankDocSearchGetSearchConfigFiltersMock,
        ),
        trpcMsw.questionBankDocSearch.searchDocs.query(
          () => questionBankDocSearchSearchDocsMock,
        ),
      ],
    },
  },
};

export default meta;
