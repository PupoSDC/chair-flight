import { QuestionBank } from "./providers/question-bank";
import type { BankName } from "./types/bank";

export const questionBanks: Record<BankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export type { QuestionBank };
