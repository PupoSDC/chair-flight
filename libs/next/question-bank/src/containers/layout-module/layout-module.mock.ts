import type { AppRouterOutput } from "@cf/trpc/client";

export const mockData: AppRouterOutput["containers"]["layouts"]["getLayoutModule"] =
  {
    routes: {
      home: { href: "/modules/atpl", isVisible: true },
      questions: { href: "/modules/atpl/questions", isVisible: true },
      learningObjectives: {
        href: "/modules/atpl/learningObjectives",
        isVisible: true,
      },
      annexes: { href: "/modules/atpl/annexes", isVisible: true },
      tests: { href: "/modules/atpl/tests", isVisible: true },
      docs: { href: "/modules/atpl/docs", isVisible: true },
      flashcards: { href: "/modules/atpl/flashcards", isVisible: false },
    },
    questionBank: "atpl",
  };
