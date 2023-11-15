import { preloadInterviewFlashcardsForStaticRender } from "@chair-flight/content/interview-flashcards";
import { preloadQuestionBank737ForStaticRender } from "@chair-flight/content/question-bank-737";
import { preloadQuestionBankAtplForStaticRender } from "@chair-flight/content/question-bank-atpl";

export const preloadContentForStaticRender = (fs: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all([
    preloadQuestionBankAtplForStaticRender(fs),
    preloadQuestionBank737ForStaticRender(fs),
    preloadInterviewFlashcardsForStaticRender(fs),
  ]);
