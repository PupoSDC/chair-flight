import type { AppRouterOutput } from "@chair-flight/trpc/client";

export const mockData: AppRouterOutput["containers"]["overviews"]["getOverviewModules"] =
  {
    numberOfFlashcards: 4,
    numberOfAtplQuestions: 25964,
    numberOfTypeQuestions: 1168,
  };
