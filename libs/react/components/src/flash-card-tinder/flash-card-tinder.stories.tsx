import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { Playground as FlashCard } from "../flash-card/flash-card.stories";
import { FlashCardTinder } from "./flash-card-tinder";
import type { Meta, StoryObj } from "@storybook/react";
import type { FunctionComponent } from "react";

type Story = StoryObj<typeof FlashCardTinder>;

const FlashCardRender = FlashCard.render as unknown as FunctionComponent;

export const Playground: Story = {
  args: {
    children: [...Array(10)].map((_, i) => (
      <FlashCardRender key={i} {...FlashCard.args} />
    )),
  },
};

const meta: Meta<typeof FlashCardTinder> = {
  title: "Components/FlashCardTinder",
  component: FlashCardTinder,
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
