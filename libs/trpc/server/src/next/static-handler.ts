import { preloadInterviewFlashcardsForStaticRender } from "@chair-flight/content/interview-flashcards";
import { QuestionBank737 } from "@chair-flight/content/question-bank-737";
import { QuestionBankA320 } from "@chair-flight/content/question-bank-a320";
import { QuestionBankAtpl } from "@chair-flight/content/question-bank-atpl";

export const preloadContentForStaticRender = (fs: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all([
    new QuestionBankAtpl().preloadQuestionBankForStaticRender(fs),
    new QuestionBankA320().preloadQuestionBankForStaticRender(fs),
    new QuestionBank737().preloadQuestionBankForStaticRender(fs),
    preloadInterviewFlashcardsForStaticRender(fs),
  ]);
