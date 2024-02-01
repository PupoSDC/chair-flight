import { QuestionBank } from "./providers/question-bank";
import type { QuestionBankName } from "./types";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export type { QuestionBank };
