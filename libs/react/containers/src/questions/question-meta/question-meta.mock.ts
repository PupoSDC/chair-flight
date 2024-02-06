import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionMeta"] =
  {
    annexes: {
      items: [],
    },
    learningObjectives: {
      items: [
        {
          id: "B737.04",
          href: "/modules/type/learning-objectives/B737.04",
          parentId: "B737",
          courses: [{ id: "B737", text: "B737" }],
          text: "Automatic Flight",
          source: "B737 FCOM",
          questionBank: "type",
          subject: "B737",
          numberOfQuestions: 31,
        },
      ],
    },
    relatedQuestions: {
      items: [],
    },
    externalIds: [],
  };
