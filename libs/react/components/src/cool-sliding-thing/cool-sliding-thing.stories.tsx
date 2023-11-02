import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { CoolSlidingThing } from "./cool-sliding-thing";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof CoolSlidingThing>;

export const Playground: Story = {
  parameters: {},
  render: () => (
    <>
      <CoolSlidingThing />
      <Box sx={{ minHeight: 400 }} />
      <Global
        styles={css`
          body {
            padding: 0 !important;
          }
        `}
      />
    </>
  ),
};

const meta: Meta<typeof CoolSlidingThing> = {
  title: "Components/CoolSlidingThing",
  component: CoolSlidingThing,
  tags: ["autodocs"],
};

export default meta;
