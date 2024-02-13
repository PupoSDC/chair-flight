import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["flashcards"]["getFlashcardCollectionList"] =
  {
    collections: [
      { id: "737", title: "737", numberOfFlashcards: 4 },
      {
        id: "atpl-technical-interview",
        title: "Atpl Technical Interview",
        numberOfFlashcards: 246,
      },
      { id: "ryanair", title: "Ryanair", numberOfFlashcards: 9 },
      { id: "seneca", title: "Seneca", numberOfFlashcards: 22 },
    ],
  };
