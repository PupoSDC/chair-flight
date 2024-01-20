import { Select, Option } from "@mui/joy";
import { SearchFilters } from "./search-filters";
import type { SearchFiltersProps } from "./search-filters";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SearchFilters>;

export const Playground: Story = {
  args: {
    filters: "2 selects" as unknown as SearchFiltersProps["filters"],
    fallback: "2 selects" as unknown as SearchFiltersProps["fallback"],
  },
};

const meta: Meta<typeof SearchFilters> = {
  title: "Components/SearchFilters",
  component: SearchFilters,
  tags: ["autodocs"],
  argTypes: {
    filters: {
      control: { type: "radio" },
      options: ["2 selects"],
      mapping: {
        "2 selects": (
          <>
            <Select>
              <Option value="Potatos">Potatos</Option>
              <Option value="Kiwis">Kiwis</Option>
              <Option value="Banas">Banas</Option>
            </Select>
            <Select>
              <Option value="Batman">Batman</Option>
              <Option value="Superman">Superman</Option>
              <Option value="Kiwiman">Kiwiman</Option>
            </Select>
          </>
        ),
      },
    },
    fallback: {
      control: { type: "radio" },
      options: ["2 selects"],
      mapping: {
        "2 selects": (
          <>
            <Select />
            <Select />
          </>
        ),
      },
    },
  },
};

export default meta;
