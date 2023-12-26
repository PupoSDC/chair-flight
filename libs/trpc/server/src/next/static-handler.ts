import {
  QuestionBank737,
  QuestionBankA320,
  QuestionBankAtpl,
  QuestionBankInterview,
} from "@chair-flight/core/question-bank";

export const preloadContentForStaticRender = (fs: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all([
    QuestionBank737.preloadQuestionBankForStaticRender(fs),
    QuestionBankA320.preloadQuestionBankForStaticRender(fs),
    QuestionBankAtpl.preloadQuestionBankForStaticRender(fs),
    QuestionBankInterview.preloadQuestionBankForStaticRender(fs),
  ]);
