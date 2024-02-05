export type QuestionBankFlashcardContent = {
  question: string;
  answer: string;
  id: string;
};

export type QuestionBankFlashcardCollection = {
  id: string;
  title: string;
  flashcards: QuestionBankFlashcardContent[];
};
