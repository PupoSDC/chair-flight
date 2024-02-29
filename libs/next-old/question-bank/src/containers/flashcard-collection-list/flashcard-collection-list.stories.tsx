import { trpcMsw } from "@cf/trpc/mock";
import { FlashcardCollectionList } from "./flashcard-collection-list";
import { mockData } from "./flashcard-collection-list.mock";
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
        trpcMsw.containers.flashcards.getFlashcardCollectionList.query(
          () => mockData,
        ),
      ],
    },
  },
};

export default meta;
