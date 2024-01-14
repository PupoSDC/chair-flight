import { mockFlashcards, trpcMsw } from "@chair-flight/trpc/mock";
import { FlashcardTest } from "./flashcard-test";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof FlashcardTest>;

export const Playground: Story = {};

const meta: Meta<typeof FlashcardTest> = {
  title: "Containers/Flashcards/FlashcardTest",
  component: FlashcardTest,
  tags: ["autodocs"],
  args: {
    questionBank: "prep",
    collectionId: "123",
    seed: "123",
    sx: {
      minHeight: 600,
    },
  },
  argTypes: {
    questionBank: { control: false },
    collectionId: { control: false },
    seed: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        trpcMsw.questionBank.getFlashcardsCollection.query(() => ({
          flashcardCollection: {
            id: "123",
            title: "Flashcard Collection",
            flashcards: mockFlashcards,
          },
        })),
      ],
    },
  },
};

export default meta;
