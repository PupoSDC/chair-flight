import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["flashcards"]["getFlashcardTest"] =
  {
    flashcards: [
      {
        question:
          "If the engine driven pump failed, how would you lower the gear?",
        answer: "With the electric driven pump.",
        id: "d757a536-2744-4360-90a7-f2f6aa6e801c",
      },
      {
        question: "How many hydraulic systems does the Boeing 737 have?",
        answer: "The Boeing 737 has 2 hydraulic systems.",
        id: "90fdf32a-5b97-4139-822a-83ce648dcf1d",
      },
      {
        question: "What powers the gear? What is the PSI of the system?",
        answer: "The hydraulic system powers the landing gear.\n\n3000 PSI",
        id: "d664b430-058c-4fa1-b5e7-2b54140e90f2",
      },
      {
        question: "What is the fuel consumption of the Boeing 737?",
        answer: "2000-2600 kg/h",
        id: "3fe180f6-5066-44f4-98d1-6a9c9a7bd907",
      },
    ],
    href: "/modules/prep/flashcards/737/RfjE38YA",
    flashcardsHref: "/modules/prep/flashcards",
  };
