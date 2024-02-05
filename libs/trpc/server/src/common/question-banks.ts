import { QuestionBank } from "@chair-flight/providers/question-bank";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};
