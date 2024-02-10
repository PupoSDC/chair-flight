import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionStandAlone"] =
  {
    question: {
      questionId: "09UCIcBm",
      templateId: "p0n3ij",
      seed: "l8sPt7SC",
      type: "multiple-choice",
      question:
        "Which Statements are correct?\n\n1) The A/T must be manually disengaged after touchdown.\n\n2) The A/P  automatically disengages approximately 2 seconds after touchdown.",
      annexes: [],
      correctOptionId: "psxoXfNP",
      options: [
        { id: "1kHPWApm", text: "One is correct, two is correct", why: "" },
        { id: "uYN9PZOl", text: "One is correct, two is incorrect", why: "" },
        { id: "XWuMWhsk", text: "One is incorrect, two is correct", why: "" },
        { id: "psxoXfNP", text: "One is incorrect, two is incorrect", why: "" },
      ],
      explanation:
        "\n\n---\n\n- The A/T automatically disengages approximately 2 seconds after touchdown.\n- the A/P must be manually disengaged after touchdown. Landing roll-out is executed manually after disengaging the A/P.",
    },
    annexes: [],
  };
