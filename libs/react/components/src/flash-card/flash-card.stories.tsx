import { useState } from "react";
import { FlashCard } from "./flash-card";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof FlashCard>;

export const Playground: Story = {
  args: {
    question: "What is the average age of the Ryanair fleet?",
    answer: "Approximately 6.5 years",
    sx: { maxWidth: 400, minHeight: 300 },
  },
  render: function PlayGroundRender(args) {
    const [flipped, setFlipped] = useState(args.flipped ?? false);
    return (
      <FlashCard
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

const meta: Meta<typeof FlashCard> = {
  title: "Components/FlashCard",
  component: FlashCard,
  tags: ["autodocs"],
};

export default meta;
