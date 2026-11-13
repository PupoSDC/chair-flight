export type QuestionBankName = keyof typeof QUESTION_BANKS;

export const QUESTION_BANK_NAMES = ["atpl", "type", "prep"] as const;

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
  type: {
    title: "737/A320 Type Rating Questions",
    shortTitle: "Type Rating",
    description:
      "Prepare or review your theory knowledge for a type rating on the Boeing 737 or the Airbus A320.",
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
