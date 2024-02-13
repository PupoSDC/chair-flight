import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { Playground as flashcard } from "../flashcard/flashcard.stories";
import { FlashcardTinder } from "./flashcard-tinder";
import type { Meta, StoryObj } from "@storybook/react";
import type { FunctionComponent } from "react";

type Story = StoryObj<typeof FlashcardTinder>;

const FlashcardRender = flashcard.render as unknown as FunctionComponent;

export const Playground: Story = {
  args: {
    children: [...Array(10)].map((_, i) => (
      <FlashcardRender key={i} {...flashcard.args} />
    )),
  },
};

const meta: Meta<typeof FlashcardTinder> = {
  title: "Components/FlashcardTinder",
  component: FlashcardTinder,
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
