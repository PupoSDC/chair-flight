import { QuestionBank } from "./question-bank";
import type { QuestionBankName } from "@chair-flight/base/types";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  b737: new QuestionBank("b737"),
  a320: new QuestionBank("a320"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export type { QuestionBank };
