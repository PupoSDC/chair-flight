import { QuestionBank } from "./question-bank";
import type { QuestionBankName } from "@chair-flight/base/types";

const QuestionBankB737 = new QuestionBank({
  questionBankName: "b737",
  hasQuestions: true,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: false,
});

const QuestionBankA320 = new QuestionBank({
  questionBankName: "a320",
  hasQuestions: true,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: false,
});

const QuestionBankAtpl = new QuestionBank({
  questionBankName: "atpl",
  hasQuestions: true,
  hasLearningObjectives: true,
  hasMedia: true,
  hasFlashcards: false,
});

const QuestionBankPrep = new QuestionBank({
  questionBankName: "prep",
  hasQuestions: false,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: true,
});

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  b737: QuestionBankB737,
  a320: QuestionBankA320,
  atpl: QuestionBankAtpl,
  prep: QuestionBankPrep,
};

export type { QuestionBank };
