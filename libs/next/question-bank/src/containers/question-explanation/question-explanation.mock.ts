import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionExplanation"] =
  {
    explanation: {
      mdContent: "This is a mock explanation",
    },
  };
