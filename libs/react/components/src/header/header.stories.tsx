import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { Header } from "./header";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Header>;

export const Playground: Story = {
  args: {
    children: "Empty",
  },
  argTypes: {
    children: {
      options: ["Empty", "Some content", "Test Navigation"],
      control: { type: "radio" },
      mapping: {
        Empty: undefined,
        "Some content": <div>Some content</div>,
      },
    },
  },
};

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          "& > header": { position: "relative" },
        }}
      >
        <Story />
        <Global
          styles={css`
            body {
              padding: 0 !important;
            }
          `}
        />
      </Box>
    ),
  ],
};

export default meta;
