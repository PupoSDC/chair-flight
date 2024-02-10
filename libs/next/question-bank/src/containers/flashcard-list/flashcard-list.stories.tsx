import { trpcMsw } from "@chair-flight/trpc/mock";
import { FlashcardList } from "./flashcard-list";
import { mockData } from "./flashcard-list.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof FlashcardList>;

export const Playground: Story = {};

const meta: Meta<typeof FlashcardList> = {
  title: "Containers/Flashcards/FlashcardList",
  component: FlashcardList,
  tags: ["autodocs"],
  args: {
    questionBank: "prep",
    collectionId: "123",
    sx: {
      minHeight: 600,
    },
  },
  argTypes: {
    questionBank: { control: false },
    collectionId: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.containers.flashcards.getFlashcardList.query(() => mockData),
      ],
    },
  },
};

export default meta;
