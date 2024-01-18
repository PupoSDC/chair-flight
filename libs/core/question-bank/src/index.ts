import { QuestionBank } from "./question-bank";
import type { QuestionBankName } from "@chair-flight/base/types";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export type { QuestionBank };
