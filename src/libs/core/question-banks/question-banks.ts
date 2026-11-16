export type QuestionBankName = keyof typeof QUESTION_BANKS;

export const QUESTION_BANK_NAMES = ["atpl", "prep", "a320", "b737"] as const;

export const QUESTION_BANKS_WITH_QUESTIONS = ["atpl", "a320", "b737"] as const;

export const QUESTION_BANKS = {
  atpl: {
    title: "EASA ATPL Theory",
    shortTitle: "ATPL",
    description:
      "Explore questions, learning objectives, and theory reviews from the EASA QB ATPL exams.",
    image: "/images/modules/atpl.png",
    hasQuestions: true,
    hasFlashcards: false,
  },
  a320: {
    title: "Airbus A320 Type Rating",
    shortTitle: "A320",
    description:
      "Prepare or review your theory knowledge for a type rating on the Airbus A320.",
    image: "/images/modules/a320.png",
    hasQuestions: true,
    hasFlashcards: false,
  },
  b737: {
    title: "Boeing 737 Type Rating",
    shortTitle: "737",
    description:
      "Prepare or review your theory knowledge for a type rating on the Boeing 737.",
    image: "/images/modules/737.png",
    hasQuestions: true,
    hasFlashcards: false,
  },
  prep: {
    title: "Interview Preparation",
    shortTitle: "Interview Prep",
    description:
      "Use our flash cards to practise answering open ended questions and secure your first job.",
    image: "/images/modules/prep.png",
    hasQuestions: false,
    hasFlashcards: true,
  },
};
