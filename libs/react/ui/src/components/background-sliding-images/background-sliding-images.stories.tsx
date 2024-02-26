import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { BackgroundSlidingImages } from "./background-sliding-images";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BackgroundSlidingImages>;

export const Playground: Story = {
  render: () => (
    <>
      <BackgroundSlidingImages />
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

const meta: Meta<typeof BackgroundSlidingImages> = {
  title: "Components/BackgroundSlidingImages",
  component: BackgroundSlidingImages,
  tags: ["autodocs"],
};

export default meta;
