import { trpcMsw } from "@chair-flight/trpc/mock";
import { FlashcardCollectionList } from "./flashcard-collection-list";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof FlashcardCollectionList>;

export const Playground: Story = {};

const meta: Meta<typeof FlashcardCollectionList> = {
  title: "Containers/Flashcards/FlashcardCollectionList",
  component: FlashcardCollectionList,
  tags: ["autodocs"],
  args: {
    questionBank: "prep",
    sx: {
      minHeight: 600,
    },
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.questionBank.getFlashcardsCollections.query(() => ({
          collections: [1, 2, 3, 4, 5].map((id) => ({
            id: `${id}`,
            title: `collection ${id}`,
            numberOfFlashcards: id * 234,
          })),
        })),
      ],
    },
  },
};

export default meta;
