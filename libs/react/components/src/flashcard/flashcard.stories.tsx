import { useState } from "react";
import { Flashcard } from "./flashcard";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Flashcard>;

export const Playground: Story = {
  args: {
    question: "What is the average age of the Ryanair fleet?",
    answer: "Approximately 6.5 years",
    sx: { maxWidth: 400, minHeight: 300 },
  },
  render: function PlayGroundRender(args) {
    const [flipped, setFlipped] = useState(args.flipped ?? false);
    return (
      <Flashcard
        {...args}
        flipped={flipped}
        onFlip={(flipped) => {
          args.onFlip?.(flipped);
          setFlipped(flipped);
        }}
      />
    );
  },
};

const meta: Meta<typeof Flashcard> = {
  title: "Components/flashcard",
  component: Flashcard,
  tags: ["autodocs"],
};

export default meta;
